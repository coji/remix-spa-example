import {
  ClientActionFunctionArgs,
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { useEffect, useRef } from 'react'
import {
  Button,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { authenticate } from '~/services/auth'
import { add, items } from '~/store/item'

export const clientLoader = async () => {
  return {
    message: 'Hello from the client!',
    items,
  }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await authenticate({ failureRedirect: '/sign_in' })

  const formData = await request.formData()
  const tweet = formData.get('tweet')?.toString()
  if (!tweet) {
    return null
  }
  const newItem = {
    id: (items.length + 1).toString(),
    name: formData.get('tweet')?.toString() ?? 'nothing',
  }
  add(newItem)
  return newItem
}

export default function Index() {
  const navigation = useNavigation()
  const { items } = useLoaderData<typeof clientLoader>()
  const actionData = useActionData<typeof clientAction>()
  const $form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (navigation.state === 'idle' && $form.current) {
      if (actionData) {
        $form.current.reset()
      }
      $form.current
        .querySelector<HTMLInputElement>('input[name="tweet"]')
        ?.focus()
    }
  }, [navigation.state, actionData])

  return (
    <div>
      <h1 className="text-2xl">Tweeter!</h1>

      <Form method="POST" ref={$form} className="flex flex-row gap-4 items-end">
        <Label>
          name
          <Input name="tweet" />
        </Label>
        <Button disabled={navigation.state !== 'idle'}>submit</Button>
      </Form>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>id</TableHead>
              <th>name</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link to={`/item/${item.id}`}>{item.id}</Link>
                </TableCell>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
