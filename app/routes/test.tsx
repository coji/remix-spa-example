import { useLoaderData } from '@remix-run/react'
import { listAllPosts } from '~/models/posts'

export const clientLoader = async () => {
  return await listAllPosts()
}

export default function TestPage() {
  const posts = useLoaderData<typeof clientLoader>()
  console.log({ posts })
  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <div>{post.id}</div>
            <div>{post.title}</div>
            <div>{post.content}</div>
            <div>{post.uid}</div>
          </div>
        )
      })}
    </div>
  )
}
