export const StringEmpty = (str: string | null | undefined) => {
    return !str || str.trim().length == 0;
}

export const copyToClipboard = (content: string) => {
    try {
        const copyPng = async () => {
            const jpegImageResponse = await fetch(content + '?t=' + new Date().getTime(), {
                method: 'GET',
            });
            const jpegBlob = await jpegImageResponse.blob();

            return await new Promise<Blob>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((resultBlob) => {
                            if (resultBlob) resolve(resultBlob);
                            else reject(new Error('canvas toBlob failed'));
                        }, 'image/png');
                    } catch (e) {
                        reject(e);
                    }
                };
                img.onerror = () => reject;
                img.src = URL.createObjectURL(jpegBlob);
            });
        };
        const clipboardItem = new ClipboardItem({ ['image/png']: copyPng() });
        navigator.clipboard.write([clipboardItem]);
    } catch (error) {
        console.error('複製圖片失敗', error);
    }
}
