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