import { type MetaFunction } from '@remix-run/node'
import { ClientActionFunctionArgs, useLoaderData, Form } from '@remix-run/react'

interface Item {
  id: string
  name: string
}
const items: Item[] = []

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

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  items.push({
    id: items.length.toString(),
    name: formData.get('name')?.toString() ?? 'nothing',
  })
  return {}
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
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
