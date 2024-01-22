import {
  ClientLoaderFunctionArgs,
  Link,
  json,
  useLoaderData,
} from '@remix-run/react'
import { getUserPostById } from '~/models/posts'
import { isAuthenticated } from '~/services/auth'

export const clientLoader = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
  const handle = params.handle
  const id = params.id
  if (!handle || !id) throw json({ message: 'Not found', status: 404 })

  const user = await isAuthenticated(request)

  const post = await getUserPostById(handle, id)
  if (!post) throw json({ message: 'Not found', status: 404 })

  return { handle, id, post, user }
}

export default function PostPage() {
  const { handle, id, post, user } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      {handle === user?.handle && (
        <nav>
          <Link to={`/${handle}/posts/${id}/edit`}>Edit</Link>
        </nav>
      )}
      <h1>Post</h1>
      <div>{post.title}</div>
      <div>{post.content}</div>
    </div>
  )
}
