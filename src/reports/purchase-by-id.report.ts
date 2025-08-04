import { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { IPurchase } from './interfaces/purchase.interface';
import { footerSection } from './sections/footer.section';

interface ReportValues {
  title?: string;
  subTitle?: string;
  data: IPurchase;
}

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    margin: [0, 30, 0, 0],
  },
  subHeader: {
    fontSize: 16,
    bold: true,
    margin: [0, 20, 0, 0],
  },
};

export const orderByIdReport = (value: ReportValues): TDocumentDefinitions => {
  const { data } = value;
  const { shippingInfo, items, id, payment_id } = data;

  const subTotal = items.reduce(
    (acc, curr) => acc + Number(curr.unit_price),
    20000,
  );

  return {
    styles,
    pageMargins: [40, 80, 40, 60],
    footer: footerSection,
    content: [
      {
        text: `INU QR Recibo de Compra`,
        style: 'header',
      },
      {
        columns: [
          {
            text: `${shippingInfo.address}, \n${shippingInfo.city}, ${shippingInfo.state}\nGuia: ${shippingInfo.tracking_code ?? 'Aun no enviado'}\n${shippingInfo.carrier ?? 'Aun no enviado'}`,
          },
          {
            text: [
              {
                text: `Compra Id. ${id}\n`,
                bold: true,
              },
              `Pago Id. ${payment_id}\n`,
            ],
            alignment: 'right',
          },
        ],
      },
      { qr: 'https://github.com/4n-ch4n', fit: 75, alignment: 'right' },
      {
        text: [
          {
            text: 'Factura a: \n',
            style: 'subHeader',
          },
          `
          Nombre: ${shippingInfo.full_name},
          Contacto: ${shippingInfo.phone}
          `,
        ],
      },
      {
        layout: 'headerLineOnly',
        margin: [0, 20],
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            ['Descripcion', 'Precio'],
            ...items.map((item) => [
              `Collar ${item.type}`,
              item.unit_price.toString(),
            ]),
            ['Envio', '20000'],
          ],
        },
      },
      '\n\n',
      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              body: [
                [
                  { text: 'Total', bold: true },
                  {
                    text: subTotal,
                    alignment: 'right',
                    bold: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  };
};
