import { MoreVerticalIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import {
  Form,
  Link,
  redirect,
  type ClientActionFunctionArgs,
} from 'react-router'
import { $path } from 'remix-routes'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui'
import { dayjs } from '~/libs/dayjs'
import { isAccountExistsByHandle } from '~/models/account'
import { addUserPost, listUserPosts, type Post } from '~/models/posts'
import { DeleteAlertDialog } from '~/routes/$handle+/posts.$id.delete/route'
import { isAuthenticated, requireUser } from '~/services/auth'
import type * as Route from './+types.route'

export const clientLoader = async ({
  request,
  params,
}: Route.ClientLoaderArgs) => {
  const { handle } = zx.parseParams(params, { handle: z.string() })

  const isExist = await isAccountExistsByHandle(handle)
  if (!isExist) throw new Error('Not found')

  const user = await isAuthenticated(request)
  const posts = await listUserPosts(handle)
  return { handle, user, posts, isAuthor: handle === user?.handle }
}

export const clientAction = async ({
  params,
  request,
}: ClientActionFunctionArgs) => {
  const { handle } = zx.parseParams(params, { handle: z.string() })
  const user = await requireUser(request, { failureRedirect: $path('/') })
  if (user.handle !== handle) {
    throw new Error('Unauthorized')
  }

  const newPost = await addUserPost(user.handle)
  return redirect($path('/:handle/posts/:id', { handle, id: newPost.id }))
}

const PostCard = ({ handle, post }: { handle: string; post: Post }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false)

  const handleClickDeleteMenu = () => {
    setIsDeleteAlertOpen(true)
  }

  return (
    <Card
      key={post.id}
      className="relative rounded-xl border-none bg-slate-100"
    >
      <Link
        to={$path('/:handle/posts/:id', { handle: post.handle, id: post.id })}
        className="absolute inset-0"
        prefetch="intent"
      >
        &nbsp;
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-0" asChild>
          <Button size="sm" variant="ghost">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => handleClickDeleteMenu()}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlertDialog
        handle={handle}
        post={post}
        open={isDeleteAlertOpen}
        onCanceled={() => setIsDeleteAlertOpen(false)}
      />

      <CardHeader>
        <div className="mx-auto flex h-24 w-20 flex-col gap-[2px] overflow-clip bg-white p-[8px] shadow-md">
          <div className="text-[4px]">{post.title}</div>
          <div className="line-clamp-6 text-[2px]">{post.content}</div>
        </div>
      </CardHeader>
      <CardContent className="leading-loose">
        <div className="line-clamp-2">{post.title}</div>
        <div className="text-sm text-slate-400">
          {dayjs(post.publishedAt).format('YYYY/MM/DD')}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Index({
  loaderData: { handle, posts, isAuthor },
}: Route.ComponentProps) {
  return (
    <AppHeadingSection>
      <div className="flex">
        <h1 className="flex-1 text-2xl">@{handle}</h1>
        {isAuthor && (
          <Form method="POST">
            <Button
              variant="outline"
              className="rounded-full px-2"
              type="submit"
            >
              <PlusIcon />
            </Button>
          </Form>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} handle={handle} post={post} />
        ))}
      </div>
    </AppHeadingSection>
  )
}
