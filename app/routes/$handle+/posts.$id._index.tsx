import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'
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
  const { handle, id } = params
  if (!handle || !id) throw new Error('Not found')
  const post = await getUserPostById(handle, id)
  if (!post) throw new Error('Not found')

  const user = await isAuthenticated(request)

  return { handle, id, post, user }
}

export default function PostPage() {
  const { handle, id, post, user } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      {handle === user?.handle && (
        <nav className="flex px-4 py-2">
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link to={`/${handle}`} prefetch="intent">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" asChild>
            <Link to={`/${handle}/posts/${id}/edit`} prefetch="intent">
              <PencilIcon className="mr-2 h-4 w-4" />
              記事を編集
            </Link>
          </Button>
        </nav>
      )}

      <AppHeadingSection>
        <h1 className="text-2xl leading-loose tracking-wider">{post.title}</h1>

        <div className="flex items-center gap-1 text-slate-500">
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
