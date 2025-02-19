import { data, href, redirect, useFetcher } from 'react-router'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenuItem,
} from '~/components/ui'
import { deleteUserPost, type Post } from '~/models/posts'
import { requireUser } from '~/services/auth'
import type { Route } from './+types/page'

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  const { handle, id } = zx.parseParams(params, {
    handle: z.string(),
    id: z.string(),
  })

  const user = await requireUser(request, { failureRedirect: href('/') })
  if (user.handle !== handle) {
    throw data(null, { status: 401 })
  }
  await deleteUserPost(handle, id)
  return redirect(href('/:handle', { handle }))
}

interface PostDeleteMenuItemProps {
  handle: string
  post: Post
  className?: string
  children: React.ReactNode
}
export const PostDeleteMenuItem = ({
  post,
  handle,
  className,
  children,
}: PostDeleteMenuItemProps) => {
  const fetcher = useFetcher()

  return (
    <DropdownMenuItem
      onSelect={() => {
        fetcher.submit(
          {},
          {
            method: 'POST',
            action: href('/:handle/posts/:id/delete', { handle, id: post.id }),
          },
        )
      }}
      className={className}
    >
      {children}
    </DropdownMenuItem>
  )
}

interface DeleteAlertDialogProps {
  open: boolean
  handle: string
  post: Post
  onCanceled: () => void
}
export const DeleteAlertDialog = ({
  open,
  handle,
  post,
  onCanceled,
}: DeleteAlertDialogProps) => {
  const fetcher = useFetcher()

  const handleClickDelete = () => {
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: href('/:handle/posts/:id/delete', { handle, id: post.id }),
      },
    )
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>記事を削除します</AlertDialogTitle>
          <AlertDialogDescription>本当に削除しますか？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCanceled()}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => handleClickDelete()}
            >
              削除
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function DeletePage() {
  return <div />
}
