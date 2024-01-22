import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  json,
  redirect,
  useLoaderData,
} from '@remix-run/react'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Input, Label, Textarea } from '~/components/ui'
import { getUserPostById, updateUserPonst } from '~/models/posts'
import { requireUser } from '~/services/auth'

export const clientLoader = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
  const { handle, id } = params
  if (!handle || !id) throw json({ message: 'Not found', status: 404 })

  // 本人の投稿以外は編集できない / 存在確認
  const user = await requireUser(request, { failureRedirect: '/' })
  if (handle !== user.handle) throw json({ message: 'Forbidden', status: 403 })

  const post = await getUserPostById(handle, id)
  if (!post) throw json({ message: 'Not found', status: 404 })
  return { handle, id, post, user }
}

export const clientAction = async ({
  request,
  params,
}: ClientActionFunctionArgs) => {
  const { handle, id } = params
  if (!handle || !id) throw json({ message: 'Not found', status: 404 })

  // 本人の投稿以外は編集できない / 存在確認
  const user = await requireUser(request, { failureRedirect: '/' })
  if (handle !== user.handle) throw json({ message: 'Forbidden', status: 403 })

  const formData = await request.formData()
  await updateUserPonst(handle, {
    id,
    uid: user.uid,
    handle,
    title: String(formData.get('title')),
    content: String(formData.get('content')),
    publishedAt: 'hoge',
  })
  return redirect(`/${handle}/posts/${id}`)
}

export default function PostEditPage() {
  const { handle, post } = useLoaderData<typeof clientLoader>()

  return (
    <div>
      <Form method="POST" className="flex flex-col gap-4">
        <AppHeadingSection className="items-stretch">
          <div>
            <Label>タイトル</Label>
            <Input type="text" name="title" defaultValue={post.title} />
          </div>

          <div>
            <Label>本文</Label>
            <Textarea name="content" defaultValue={post.content} />
          </div>

          <Button type="submit">更新</Button>
        </AppHeadingSection>
      </Form>
    </div>
  )
}
