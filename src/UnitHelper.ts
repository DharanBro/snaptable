export default class UnitHelper {
    static UNIT_SCALE_MAP = {
        mm: 2.834645669291339,
        pt: 1,
        cm: 28.346456692913385,
        in: 72,
        px: 1.3333333333333333,
    };

    static getDocumentUnit(scaleFactor: number): string {
        for (let unit in UnitHelper.UNIT_SCALE_MAP) {
            if (UnitHelper.UNIT_SCALE_MAP[unit] === scaleFactor) {
                return unit;
            }
        }
        throw new Error('Invalid unit / scale factor. This could probably as a result of change in JsPDF');
    }

    static pxToDocumentUnit(value: number, scaleFactor: number): number {
        const documentUnit = UnitHelper.getDocumentUnit(scaleFactor);
        return (value / UnitHelper.UNIT_SCALE_MAP.px) * UnitHelper.UNIT_SCALE_MAP[documentUnit];
    }

    static documentUnitToPx(value: number, scaleFactor: number) {
        const documentUnit = UnitHelper.getDocumentUnit(scaleFactor);
        return (value / UnitHelper.UNIT_SCALE_MAP[documentUnit]) * UnitHelper.UNIT_SCALE_MAP.px;
    }

    static documentUnitToPt(value: number, scaleFactor: number) {
        const documentUnit = UnitHelper.getDocumentUnit(scaleFactor);
        return value / UnitHelper.UNIT_SCALE_MAP[documentUnit];
    }

    static convertToPt(value: number, scaleFactor: number) {
        const documentUnit = UnitHelper.getDocumentUnit(scaleFactor);
        return value / UnitHelper.UNIT_SCALE_MAP[documentUnit];
    }

    static converToDocumentUnit(value: number, scaleFactor: number) {
        const documentUnit = UnitHelper.getDocumentUnit(scaleFactor);
        return (value / UnitHelper.UNIT_SCALE_MAP.pt) * UnitHelper.UNIT_SCALE_MAP[documentUnit];
    }

    static convertPtToPx(value: number) {
        return value * UnitHelper.UNIT_SCALE_MAP.px;
    }
    static convertPxToPt(value: number) {
        return value / UnitHelper.UNIT_SCALE_MAP.px;
    }
}
