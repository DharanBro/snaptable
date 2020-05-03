import pixelWidth from 'string-pixel-width';
export default class Utils {
    static trauncateText(text: string, fontSize: number, width: number): string {
        let availableWidth = width;
        let widthSum = pixelWidth('...', { size: fontSize });
        let i = 0;
        let truncatedText = '';
        while (i < text.length) {
            truncatedText = truncatedText.concat(text.charAt(i));
            widthSum = pixelWidth(truncatedText, { size: fontSize });
            i++;
            if (widthSum > availableWidth) {
                break;
            }
        }

        if (truncatedText.length === text.length) {
            return text;
        }
        return truncatedText.concat('...');
    }
}
