import {
  ClientLoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from '@remix-run/react'
import { listUserPosts } from '~/models/posts'
import { requireUser } from '~/services/auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: '/' })
  const posts = await listUserPosts(user.handle)
  return { user, posts }
}

export default function Index() {
  const { user, posts } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <h1 className="text-2xl">@{user.handle}</h1>

      {posts.map((post) => (
        <div key={post.id}>{JSON.stringify(post)}</div>
      ))}
    </div>
  )
}
