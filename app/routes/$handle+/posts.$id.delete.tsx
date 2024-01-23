import {
  ClientActionFunctionArgs,
  json,
  useFetcher,
  useParams,
} from '@remix-run/react'
import { Post } from '~/models/posts'
import { deleteUserPost } from '~/models/posts'
import { requireUser } from '~/services/auth'

export const clientAction = async ({
  params,
  request,
}: ClientActionFunctionArgs) => {
  const { handle, id } = params
  if (!id) throw json({ message: 'Not found' }, { status: 404 })
  const user = await requireUser(request, { failureRedirect: '/' })
  if (user.handle !== handle) {
    throw json({ message: 'Unauthorized' }, { status: 401 })
  }
  await deleteUserPost(handle, id)
  return null
}

export const DeletePostLink = ({ post }: { post: Post }) => {
  const params = useParams()
  const { handle } = params

  const fetcher = useFetcher()

  return (
    <button
      type="button"
      onClick={() => {
        fetcher.submit(`/${handle}/posts/${post.id}/delete`, { method: 'POST' })
      }}
    >
      削除
    </button>
  )
}
