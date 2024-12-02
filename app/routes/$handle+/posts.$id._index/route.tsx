import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { data, Link } from 'react-router'
import { $path } from 'remix-routes'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
import { getUserPostById } from '~/models/posts'
import { isAuthenticated } from '~/services/auth'
import type { Route } from './+types/route'

export const clientLoader = async ({
  request,
  params,
}: Route.ClientLoaderArgs) => {
  const { handle, id } = zx.parseParams(params, {
    handle: z.string(),
    id: z.string(),
  })

  const post = await getUserPostById(handle, id)
  if (!post) throw data(null, { status: 404 })

  const user = await isAuthenticated(request)

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
            <Link to={$path('/:handle', { handle })} prefetch="intent">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" asChild>
            <Link
              to={$path('/:handle/posts/:id/edit', { handle, id })}
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
            <Link to={$path('/:handle', { handle: post.handle })}>
              {post.handle}
            </Link>
          </div>
          <div>·</div>
          <div>{dayjs(post.publishedAt).format('YYYY/MM/DD')}</div>
        </div>

        <ReactMarkdown className="prose leading-loose tracking-wider">
          {post.content}
        </ReactMarkdown>
      </AppHeadingSection>
    </div>
  )
}
