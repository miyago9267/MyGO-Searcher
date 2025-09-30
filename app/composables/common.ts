export const StringEmpty = (str: string | null | undefined) => {
  return !str || str.trim().length == 0
}

export const copyToClipboard = async (content: string) => {
  try {
    const response = await fetch(content + '?t=' + new Date().getTime(), {
      method: 'GET',
    })
    const convertJpegToPng = async (jpegBlob: Blob) => {
      const img = document.createElement('img')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            resolve(blob)
          }, 'image/png')
        }
        img.onerror = reject
        img.src = URL.createObjectURL(jpegBlob)
      })
    }
    const blob = await response.blob()
    const pngBlob = await convertJpegToPng(blob)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const clipboardItem = new ClipboardItem({ 'image/png': pngBlob as Blob })
      await navigator.clipboard.write([clipboardItem])
    }
    reader.readAsDataURL(blob)
  }
  catch (error) {
    console.error('複製圖片失敗', error)
  }
}
