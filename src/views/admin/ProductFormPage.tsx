'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ProductFormValues } from '@/types/admin'
import { EMPTY_PRODUCT_FORM } from '@/types/admin'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminProductQuery } from '@/hooks/queries/admin/use-admin-products-query'
import { useAdminCategoriesQuery } from '@/hooks/queries/admin/use-admin-categories-query'
import { useSaveProductMutation } from '@/hooks/queries/admin/use-admin-mutations'

type ProductFormPageProps = {
  mode: 'create' | 'edit'
  productId?: string
}

async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = (await res.json()) as { url?: string; error?: string }
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? 'Не удалось загрузить фото')
  }
  return data.url
}

export function ProductFormPage({ mode, productId }: ProductFormPageProps) {
  const router = useRouter()
  const saveProduct = useSaveProductMutation()
  const { data: categories = [] } = useAdminCategoriesQuery()
  const productQuery = useAdminProductQuery(productId, mode === 'edit')
  const [form, setForm] = useState<ProductFormValues>(EMPTY_PRODUCT_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(mode === 'create')

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  useEffect(() => {
    if (mode === 'create' && categories.length > 0) {
      setForm((prev) => ({ ...prev, categoryId: prev.categoryId || categories[0].id }))
      setInitialized(true)
    }
  }, [mode, categories])

  useEffect(() => {
    if (mode !== 'edit' || !productQuery.data) return
    const p = productQuery.data
    setForm({
      name: p.name,
      price: String(p.price),
      image: p.image,
      categoryId: p.categoryId,
      description: p.description,
      careTips: p.careTips,
      active: p.active,
    })
    setImagePreview(p.image)
    setInitialized(true)
  }, [mode, productQuery.data])

  useEffect(() => {
    if (productQuery.error) {
      setError(productQuery.error instanceof Error ? productQuery.error.message : 'Ошибка загрузки')
    }
  }, [productQuery.error])

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      let imageUrl = form.image
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile)
      } else if (!imageUrl) {
        throw new Error('Загрузите изображение товара')
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        image: imageUrl,
        categoryId: form.categoryId,
        description: form.description,
        careTips: form.careTips,
        active: form.active,
      }

      await saveProduct.mutateAsync({ mode, productId, payload })
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    }
  }

  const previewSrc = imagePreview ?? (form.image || null)
  const loading = mode === 'edit' && (productQuery.isPending || !initialized)

  if (loading) {
    return <Skeleton className="h-40 w-full" />
  }

  return (
    <div className="space-y-4 pb-6">
      <PageHeader title={mode === 'create' ? 'Новый товар' : 'Редактировать товар'}>
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Назад
          </Link>
        </Button>
      </PageHeader>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div className="space-y-2">
          <Label htmlFor="product-name">Название</Label>
          <Input
            id="product-name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Букет «Нежность»"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-price">Цена, ₽</Label>
          <Input
            id="product-price"
            type="number"
            min={1}
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Категория</Label>
          <Select value={form.categoryId} onValueChange={(v) => update('categoryId', v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-image">Фото</Label>
          <Input
            id="product-image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            required={mode === 'create' && !form.image}
          />
          {previewSrc && (
            <img
              src={previewSrc}
              alt=""
              className="aspect-square w-full max-w-[240px] rounded-md border border-border object-cover"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-description">Описание</Label>
          <Textarea
            id="product-description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-care">Уход за букетом</Label>
          <Textarea
            id="product-care"
            rows={3}
            value={form.careTips}
            onChange={(e) => update('careTips', e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
          <Label htmlFor="product-active" className="cursor-pointer">
            Показывать в каталоге
          </Label>
          <Switch
            id="product-active"
            checked={form.active}
            onCheckedChange={(checked) => update('active', checked)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href="/admin/products">Отмена</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={saveProduct.isPending}>
            {saveProduct.isPending ? 'Сохраняем…' : mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  )
}
