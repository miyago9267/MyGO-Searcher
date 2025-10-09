export const StringEmpty = (str: string | null | undefined) => {
  return !str || str.trim().length == 0
}

export const copyToClipboard = async (content: string) => {
  try {
    const clipboard = navigator.clipboard
    const canWriteImage = clipboard && typeof clipboard.write === 'function' && typeof ClipboardItem !== 'undefined'

    const copyUrlAsText = async () => {
      if (clipboard && typeof clipboard.writeText === 'function') {
        await clipboard.writeText(content)
        return
      }

      // 最後的相容性備援，透過 execCommand 操作複製
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      }
      finally {
        document.body.removeChild(textarea)
      }
    }

    if (!canWriteImage) {
      await copyUrlAsText()
      return
    }

    const response = await fetch(content + '?t=' + new Date().getTime(), {
      method: 'GET',
    })

    const convertJpegToPng = async (jpegBlob: Blob) => {
      const img = document.createElement('img')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

      return new Promise<Blob>((resolve, reject) => {
        const objectUrl = URL.createObjectURL(jpegBlob)

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(objectUrl)
            if (blob) {
              resolve(blob)
            }
            else {
              reject(new Error('無法產生 PNG Blob'))
            }
          }, 'image/png')
        }
        img.onerror = reject
        img.src = objectUrl
      })
    }

    try {
      const blob = await response.blob()
      const pngBlob = await convertJpegToPng(blob)
      const clipboardItem = new ClipboardItem({ 'image/png': pngBlob })
      await clipboard.write([clipboardItem])
    }
    catch (err) {
      console.warn('圖片寫入剪貼簿失敗，改以文字連結複製', err)
      await copyUrlAsText()
    }
  }
  catch (error) {
    console.error('複製圖片失敗', error)
  }
}
