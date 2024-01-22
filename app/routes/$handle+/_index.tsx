import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'
import { listUserPosts } from '~/models/posts'
import { isAuthenticated } from '~/services/auth'

export const clientLoader = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
  const handle = params.handle
  if (!handle) throw new Error('Not found')

  const user = await isAuthenticated(request)
  const posts = await listUserPosts(handle)
  return { handle, user, posts, isAuthor: handle === user?.handle }
}

export default function Index() {
  const { handle, user, posts, isAuthor } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <h1 className="text-2xl">@{handle}</h1>

      {posts.map((post) => (
        <div key={post.id}>{JSON.stringify(post)}</div>
      ))}
    </div>
  )
}
