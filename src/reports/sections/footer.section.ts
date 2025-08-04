import { Content } from 'pdfmake/interfaces';

export const footerSection = (
  currentPage: number,
  pageCount: number,
): Content => {
  return {
    text: currentPage.toString() + ' of ' + pageCount,
    alignment: 'center',
    fontSize: 10,
    margin: [0, 20, 40, 20],
  };
};
