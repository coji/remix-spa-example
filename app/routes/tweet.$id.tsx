import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { items } from '~/store/item'

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
