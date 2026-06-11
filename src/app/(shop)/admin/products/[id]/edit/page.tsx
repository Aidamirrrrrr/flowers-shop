import { ProductFormPage } from '@/views/admin/ProductFormPage'

type PageProps = { params: Promise<{ id: string }> }

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ProductFormPage mode="edit" productId={id} />
}
