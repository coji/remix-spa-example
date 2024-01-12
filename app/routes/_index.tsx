import { type MetaFunction } from '@remix-run/node'
import {
  ClientActionFunction,
  useLoaderData,
  Form,
  Link,
  redirect,
} from '@remix-run/react'
import { items, add } from '../store/item'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix SPA' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export const clientLoader = async () => {
  return {
    message: 'Hello from the client!',
    items,
  }
}

export const clientAction: ClientActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const newItem = {
    id: (items.length + 1).toString(),
    name: formData.get('name')?.toString() ?? 'nothing',
  }
  add(newItem)
  return redirect(`/item/${newItem.id}`)
}

export default function Index() {
  const { message, items } = useLoaderData<typeof clientLoader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix (SPA Mode)</h1>
      <div>{message}</div>

      <Form method="post">
        <input name="name" />
        <button>submit</button>
      </Form>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/item/${item.id}`}>{item.id}</Link>
              </td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
