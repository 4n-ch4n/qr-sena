import { Injectable } from '@nestjs/common';
import * as path from 'path';
import PdfPrinter from 'pdfmake';
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

const customTableLayouts: Record<string, CustomTableLayout> = {
  customLayout: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return i === node.table.headerRows ? 2 : 1;
    },
    vLineWidth: function () {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#aaa';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return i === node.table.widths!.length - 1 ? 0 : 8;
    },
    fillColor: function (i) {
      if (i === 0) return '#7b90be';
      return i % 2 === 0 ? '#f3f3f3' : null;
    },
  },
};

@Injectable()
export class PrinterService {
  private fonts = {
    Roboto: {
      normal: path.join(process.cwd(), 'src/assets/fonts/Roboto-Regular.ttf'),
      bold: path.join(process.cwd(), 'src/assets/fonts/Roboto-Medium.ttf'),
      italics: path.join(process.cwd(), 'src/assets/fonts/Roboto-Italic.ttf'),
      bolditalics: path.join(
        process.cwd(),
        'src/assets/fonts/Roboto-MediumItalic.ttf',
      ),
    },
  };

  private printer = new PdfPrinter(this.fonts);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    },
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
