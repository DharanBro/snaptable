import Cell from "../Cell";

/* eslint-disable @typescript-eslint/no-namespace */
export interface ICell {
    text: string;
    background: string;
    color: string;
    cellSpan?: number;
}

export interface IRow {
    isHeader: boolean;
    rowHeight: number;
    columns: Cell[];
    rowSpan?: number;
}

export interface IPageConfiguration {
    pageNumber?: {
        enabled: boolean;
        hPosition: 'CENTER' | 'LEFT' | 'RIGHT';
        vPosition: 'TOP' | 'BOTTOM';
    };
    margin?: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    borderColor?: string;
}

export interface IInternalConfiguration {
    cellPadding: {
        left: number,
        right: number,
    }
}

export type IMergedConfiguration = IPageConfiguration & IInternalConfiguration;

export interface IPage {
    configuration: IPageConfiguration;
    columnCount: number;
    rowCount: number;
    columnWidth: number[];
    header: ICell[];
    data: IRow[];
}

export namespace JsPDFX {
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
}
