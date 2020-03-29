declare module 'string-pixel-width';
interface ICell {
    text: string;
    background: string;
    color: string;
    cellSpan?: number;
}

interface IRow {
    isHeader: boolean;
    rowHeight: number;
    columns: ICell[];
    rowSpan?: number;
}

interface IPageConfiguration {
    pageNumber: {
        enabled: boolean;
        hPosition: 'CENTER' | 'LEFT' | 'RIGHT';
        vPosition: 'TOP' | 'BOTTOM';
    };
    margin: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}

interface IPage {
    configuration: IPageConfiguration;
    columnCount: number;
    rowCount: number;
    columnWidth: number[];
    header: ICell[];
    data: IRow[];
}

namespace JsPDF_X {
    interface IMediaBox {
        bottomLeftX: number;
        bottomLeftY: number;
        topRightX: number;
        topRightY: number;
    }

    interface IPageContext {
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

    interface ICurrentPageInfo {
        objId: number;
        pageNumber: number;
        pageContext: IPageContext;
    }

}
