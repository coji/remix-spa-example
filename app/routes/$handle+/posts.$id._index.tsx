import {
  ClientLoaderFunctionArgs,
  Link,
  json,
  useLoaderData,
} from '@remix-run/react'
import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
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
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link to={`/${handle}`} prefetch="intent">
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" asChild>
            <Link to={`/${handle}/posts/${id}/edit`} prefetch="intent">
              <PencilIcon className="w-4 h-4 mr-2" />
              記事を編集
            </Link>
          </Button>
        </nav>
      )}

      <AppHeadingSection>
        <h1 className="text-2xl leading-loose tracking-wider">{post.title}</h1>

        <div className="flex gap-1 items-center text-slate-500">
          <div>
            <Link to={`/${post.handle}`}>{post.handle}</Link>
          </div>
          <div>·</div>
          <div>{dayjs(post.publishedAt).format('YYYY/MM/DD')}</div>
        </div>

        <div className="leading-loose tracking-wider">{post.content}</div>
      </AppHeadingSection>
    </div>
  )
}
