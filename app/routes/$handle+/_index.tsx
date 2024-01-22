import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from '@remix-run/react'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui'
import { addUserPost, listUserPosts } from '~/models/posts'
import { isAuthenticated, requireUser } from '~/services/auth'

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

export const clientAction = async ({
  params,
  request,
}: ClientActionFunctionArgs) => {
  const handle = params.handle
  const user = await requireUser(request, { failureRedirect: '/' })
  if (user.handle !== handle) {
    throw new Error('Unauthorized')
  }

  const newPost = await addUserPost(user.handle)
  return redirect(`/${handle}/posts/${newPost.id}/edit`)
}

export default function Index() {
  const { handle, user, posts, isAuthor } = useLoaderData<typeof clientLoader>()
  return (
    <div className="mx-auto w-full px-6 xs:px-7 sm:px-10 max-w-screen-lg grid grid-cols-1 gap-4">
      <h1 className="text-2xl">@{handle}</h1>

      <div className="w-full gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Card key={post.id} className="relative">
            <Link
              to={`/${handle}/posts/${post.id}`}
              className="absolute inset-0"
              prefetch="intent"
            >
              &nbsp;
            </Link>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription />
            </CardHeader>
            <CardContent>{post.publishedAt}</CardContent>
          </Card>
        ))}
      </div>

      {isAuthor && (
        <Form method="POST">
          <Button type="submit">Add Post</Button>
        </Form>
      )}
    </div>
  )
}
