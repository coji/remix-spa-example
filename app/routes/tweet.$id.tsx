import { useLoaderData, ClientLoaderFunctionArgs } from '@remix-run/react'
import { items } from '~/store/item'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card'

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) => {
  const item = items.find((item) => item.id === params.id)
  return item ?? { name: 'not found', id: params.id }
}

export default function ItemDetailPage() {
  const item = useLoaderData<typeof clientLoader>()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>Item description</CardDescription>
      </CardHeader>
      <CardContent>item detail</CardContent>
    </Card>
  )
}
