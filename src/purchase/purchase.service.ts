import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, Prisma, ShippingStatus, User } from '@prisma/client';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { CreatePurchaseDTO, PlateDTO } from './dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateShippingInfoOptions } from './interface/shipping.interface';
import { UpdateShippingDTO } from './dto/update-shipping.dto';
import { PrinterService } from 'src/printer/printer.service';
import { orderByIdReport } from 'src/reports/purchase-by-id.report';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger('PurchaseService');

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly printerService: PrinterService,
  ) {}

  private baseUrl = this.configService.get<string>('FRONT_URL');

  private client = new MercadoPagoConfig({
    accessToken:
      this.configService.get<string>('STAGE') === 'prod'
        ? (this.configService.get<string>('PROD_ACCESS_TOKEN') ?? '')
        : (this.configService.get<string>('DEV_ACCESS_TOKEN') ?? ''),
  });

  async checkout(createPurchaseDTO: CreatePurchaseDTO, user: User) {
    const { items, address, city, state, postalCode, phone, fullName } =
      createPurchaseDTO;

    const totalPrice = items.reduce((acc, item) => acc + item.price, 20000);

    return this.prisma.$transaction(async (tx) => {
      const purchase = await this.createPurchase(user.id, totalPrice, tx);

      await this.createShippingInfo(
        purchase!.id,
        {
          fullName,
          phone,
          address,
          city,
          state,
          postalCode,
        },
        tx,
      );

      const purchaseItems = await this.createPurchaseItems(
        purchase!.id,
        items,
        tx,
      );

      const preference = await new Preference(this.client).create({
        body: {
          items: [
            ...purchaseItems!.map((item) => ({
              id: item.id,
              title: `Collar ${item.type}`,
              unit_price: Number(item.unit_price),
              quantity: 1,
            })),
            {
              id: 'addres',
              title: 'Precio de envio',
              unit_price: 20000,
              quantity: 1,
            },
          ],
          metadata: {
            purchaseId: purchase!.id,
            userId: user.id,
            userEmail: user.email,
          },
          back_urls: {
            success: `${this.baseUrl}/pago/exito`,
            failure: `${this.baseUrl}/pago/fallo`,
          },
          external_reference: purchase!.id,
        },
      });

      return { initPoint: preference.init_point };
    });
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const purchases = await this.prisma.purchase.findMany({
      take: limit,
      skip: offset,
      where: { user_id: user.id },
      include: {
        items: {
          select: {
            name_to_engrave: true,
            type: true,
            unit_price: true,
          },
        },
        shippingInfo: {
          select: {
            full_name: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            postal_code: true,
            status: true,
            carrier: true,
            tracking_code: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return purchases;
  }

  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            name_to_engrave: true,
            type: true,
            unit_price: true,
          },
        },
        shippingInfo: {
          select: {
            full_name: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            postal_code: true,
            status: true,
            carrier: true,
            tracking_code: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            last_name: true,
          },
        },
      },
    });

    if (!purchase)
      throw new NotFoundException(`Purchase with id ${id} not found`);

    return purchase;
  }

  async findByStatus(status: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const validStatus = OrderStatus[status as keyof typeof OrderStatus];

    if (!validStatus)
      throw new BadRequestException(`Invalid status: ${status}`);

    const purchases = await this.prisma.purchase.findMany({
      take: limit,
      skip: offset,
      where: { status: validStatus },
      include: {
        items: {
          select: {
            name_to_engrave: true,
            type: true,
            unit_price: true,
          },
        },
        shippingInfo: {
          select: {
            full_name: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            postal_code: true,
            status: true,
            carrier: true,
            tracking_code: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });

    return purchases;
  }

  async shipPurchase(purchaseId: string, updateShippingDto: UpdateShippingDTO) {
    const { carrier, trackingCode } = updateShippingDto;

    const purchase = await this.findOne(purchaseId);

    if (purchase.status !== OrderStatus.PAID)
      throw new BadRequestException('Purchase must be paid before shipping');

    try {
      const updatedShipping = await this.prisma.shippingInfo.update({
        where: { purchase_id: purchaseId },
        data: {
          status: ShippingStatus.SHIPPED,
          carrier: carrier,
          tracking_code: trackingCode,
        },
      });

      return updatedShipping;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async completeShipping(purchaseId: string) {
    const purchase = await this.findOne(purchaseId);
    const shippingInfo = await this.prisma.shippingInfo.findUnique({
      where: { purchase_id: purchaseId },
    });

    if (purchase.status !== OrderStatus.PAID)
      throw new BadRequestException(
        'Purchase must be paid before completing shipping',
      );

    if (!shippingInfo)
      throw new NotFoundException(
        `Shipping info for purchase ${purchaseId} not found`,
      );

    if (shippingInfo.status !== ShippingStatus.SHIPPED)
      throw new BadRequestException(
        'Shipping must be in SHIPPED status before completing',
      );

    try {
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: OrderStatus.COMPLETED },
      });

      const updatedShipping = await this.prisma.shippingInfo.update({
        where: { purchase_id: purchase.id },
        data: { status: ShippingStatus.DELIVERED },
      });

      return updatedShipping;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async getPaymentById(id: string) {
    const payment = new Payment(this.client);
    return payment.get({ id });
  }

  async changePurchaseStatusToPaid(purchaseId: string, paymentId: bigint) {
    const puchase = await this.findOne(purchaseId);

    const updatedPurchase = await this.prisma.purchase.update({
      where: { id: puchase.id },
      data: { status: OrderStatus.PAID, payment_id: paymentId },
    });

    return updatedPurchase;
  }

  async getPurchaseReportByPurchaseId(purchaseId: string) {
    const purchase = await this.findOne(purchaseId);

    const docDefinition = orderByIdReport({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: purchase as any,
    });

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }

  private async createPurchase(
    userId: string,
    totalPrice: number,
    connection: Prisma.TransactionClient,
  ) {
    const client = connection || this.prisma;

    try {
      const purchase = await client.purchase.create({
        data: {
          user_id: userId,
          total_price: totalPrice,
        },
      });

      return purchase;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private async createPurchaseItems(
    purchaseId: string,
    items: PlateDTO[],
    connection: Prisma.TransactionClient,
  ) {
    const client = connection || this.prisma;

    try {
      const purchaseItems = await client.purchaseItem.createManyAndReturn({
        data: items.map((items) => ({
          purchase_id: purchaseId,
          type: items.type,
          unit_price: items.price,
          name_to_engrave: items.nameToEngrave,
        })),
      });
      return purchaseItems;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private async createShippingInfo(
    purchaseId: string,
    options: CreateShippingInfoOptions,
    connection: Prisma.TransactionClient,
  ) {
    const client = connection || this.prisma;
    const { fullName, phone, address, city, state, postalCode } = options;

    try {
      await client.shippingInfo.create({
        data: {
          full_name: fullName,
          phone: phone,
          address: address,
          city: city,
          state: state,
          postal_code: postalCode,
          purchase_id: purchaseId,
        },
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') throw new BadRequestException(error.detail);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '22P02') throw new NotFoundException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
