export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export function downloadFile(file: Blob, fileName: string) {
  const url = window.URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}