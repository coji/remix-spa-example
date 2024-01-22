import {
  ClientLoaderFunctionArgs,
  Link,
  json,
  useLoaderData,
} from '@remix-run/react'
import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
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
        <nav className="flex py-2 px-4">
          <Button variant="ghost" size="sm" className="rounded-full">
            <Link to={`/${handle}`}>
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" asChild>
            <Link to={`/${handle}/posts/${id}/edit`}>
              <PencilIcon className="w-4 h-4 mr-2" />
              記事を編集
            </Link>
          </Button>
        </nav>
      )}

      <AppHeadingSection className="items-stretch">
        <h1 className="text-2xl">{post.title}</h1>

        <div>{handle}</div>

        <div>{post.content}</div>
      </AppHeadingSection>
    </div>
  )
}
