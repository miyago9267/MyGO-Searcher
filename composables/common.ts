export const StringEmpty = (str: string | null | undefined) => {
    return !str || str.trim().length == 0;
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
}

export const CopyToClipboard = (text: string) => {
    if (StringEmpty(text)) {
        return;
    }
    copyToClipboard(text);
    }