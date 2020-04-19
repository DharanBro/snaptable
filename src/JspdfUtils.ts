import jsPDF from 'jspdf';
export default class JspdfUtils {
    static getCurrentPageNumber(doc: jsPDF): number {
        return doc.internal.getCurrentPageInfo().pageNumber;
    }
}