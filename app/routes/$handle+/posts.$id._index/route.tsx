import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { data, href, Link } from 'react-router'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
import { authContext } from '~/middlewares/auth-context'
import { getUserPostById } from '~/models/posts'
import type { Route } from './+types/route'

export const clientLoader = async ({
  params: { handle, id },
  context,
}: Route.ClientLoaderArgs) => {
  const post = await getUserPostById(handle, id)
  if (!post) throw data(null, { status: 404 })

  // ミドルウェアからセットされたオプショナルのユーザ情報を取得
  const user = context.get(authContext)

  return { handle, id, post, user }
}

export default function PostPage({
  loaderData: { handle, id, post, user },
}: Route.ComponentProps) {
  return (
    <div>
      {handle === user?.handle && (
        <nav className="flex px-4 py-2">
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link to={href('/:handle', { handle })} prefetch="intent">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" asChild>
            <Link
              to={href('/:handle/posts/:id/edit', { handle, id })}
              prefetch="intent"
            >
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
            <Link to={href('/:handle', { handle: post.handle })}>
              {post.handle}
            </Link>
          </div>
          <div>·</div>
          <div>{dayjs(post.publishedAt).format('YYYY/MM/DD')}</div>
        </div>

        <div className="prose leading-loose tracking-wider">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </AppHeadingSection>
    </div>
  )
}
