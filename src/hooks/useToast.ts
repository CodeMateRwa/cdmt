import type { Dispatch, SetStateAction } from 'react'

export type ToastType = 'success' | 'error' | 'info'
export type Toast = { id: number; message: string; type: ToastType }

let _setToasts: Dispatch<SetStateAction<Toast[]>> | null = null

export function registerToastSetter(
  setter: Dispatch<SetStateAction<Toast[]>>,
) {
  _setToasts = setter
}

let nextId = 0
export function toast(message: string, type: ToastType = 'info') {
  if (!_setToasts) return
  const id = ++nextId
  _setToasts(prev => [...prev, { id, message, type }])
  setTimeout(() => {
    _setToasts?.(prev => prev.filter(t => t.id !== id))
  }, 4000)
}
