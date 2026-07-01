import type { jsPDF as JsPDFType } from 'jspdf'

async function buildPDF(elementId: string): Promise<JsPDFType | null> {
  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')

  const element = document.getElementById(elementId)
  if (!element) return null

  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = 210
  const pageHeight = 297
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let position = 0
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)

  let heightLeft = imgHeight - pageHeight
  while (heightLeft > 0) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  return pdf
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportToPDF(elementId: string, filename: string) {
  const pdf = await buildPDF(elementId)
  pdf?.save(filename)
}

export async function sharePDF(elementId: string, filename: string, subject: string) {
  const pdf = await buildPDF(elementId)
  if (!pdf) return

  const blob = pdf.output('blob')
  const file = new File([blob], filename, { type: 'application/pdf' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: subject })
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return
      triggerDownload(blob, filename)
    }
  } else {
    triggerDownload(blob, filename)
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá, segue em anexo o orçamento em PDF.')}`
    )
  }
}
