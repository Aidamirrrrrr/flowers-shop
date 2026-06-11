'use client'

import { useId } from 'react'
import { Camera, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductImageUploadProps = {
  previewSrc: string | null
  onFileSelect: (file: File) => void
  className?: string
}

export function ProductImageUpload({
  previewSrc,
  onFileSelect,
  className,
}: ProductImageUploadProps) {
  const inputId = useId()

  return (
    <div className={cn('w-full', className)}>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
          e.target.value = ''
        }}
      />
      <label
        htmlFor={inputId}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden bg-muted"
      >
        {previewSrc ? (
          <>
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-foreground/70 to-transparent px-4 pb-5 pt-12">
              <Camera className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Заменить фото</span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 border-b border-dashed border-border p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
              <ImagePlus className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Добавить фото товара</p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP</p>
          </div>
        )}
      </label>
    </div>
  )
}
