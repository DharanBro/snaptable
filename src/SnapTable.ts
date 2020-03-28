import jsPDF from "jspdf";
import Page from "./Page";

export type ITableData = {
    head: string[];
    body: string[][];
}

export interface IMediaBox {
    bottomLeftX: number;
    bottomLeftY: number;
    topRightX: number;
    topRightY: number;
}

export interface IPageContext {
    objId: number;
    contentsObjId: number;
    userUnit: number;
    artBox?: any;
    bleedBox?: any;
    cropBox?: any;
    trimBox?: any;
    mediaBox: IMediaBox;
    annotations: any[];
}

export interface ICurrentPageInfo {
    objId: number;
    pageNumber: number;
    pageContext: IPageContext;
}

export default class SnapTable {
    doc: jsPDF;
    pageWidth: number;
    pageHeight: number;

    rowHeight: number = 15;
    columnWidth: number = 100;

    // TO-DO: Review the usage of configuration 
    configuration: IPageConfiguration = {
        pageNumber: {
            enabled: false,
            hPosition: 'RIGHT',
            vPosition: 'BOTTOM',
        },
        margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        }
    };

    constructor(doc: jsPDF) {
        this.doc = doc;
        const currentPageInfo: ICurrentPageInfo = this.doc.internal.getCurrentPageInfo();
        this.pageWidth = currentPageInfo.pageContext.mediaBox.topRightX / 1.33;
        this.pageHeight = currentPageInfo.pageContext.mediaBox.topRightY / 1.33;
    }

    writeTable(data: ITableData) {
        const rows = data.body;
        const header = data.head;
        let contentHeight = 15; // Start with height of header
        let columnWidth: number[] = [];
        const {
            top: topMargin,
            bottom: bottomMargin,
        } = this.configuration.margin;

        let page = new Page(this.doc, header);
        for (let i = 0; i < rows.length; i++) {
            contentHeight += this.rowHeight;
            if (contentHeight > (this.pageHeight - topMargin - bottomMargin - 15)) { // 15 is header height
                contentHeight = 0;
                page.writeToPdf();
                page = new Page(this.doc, header);
            }
            page.addRow(rows[i]);
        }
        page.writeToPdf();
    }
}