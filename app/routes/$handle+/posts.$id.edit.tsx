import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  json,
  redirect,
  useLoaderData,
} from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Input, Label, Textarea } from '~/components/ui'
import { getUserPostById, updateUserPonst } from '~/models/posts'
import { requireUser } from '~/services/auth'

const schema = z.object({
  title: z.string().min(1, '必須です').max(60, 'タイトルは60字までです。'),
  content: z
    .string()
    .min(1, '必須です')
    .max(14000, '最大文字数に達しました 14000 / 14000 字'),
})

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
  const { handle, id, post } = useLoaderData<typeof clientLoader>()
  const [form, { title, content }] = useForm({
    defaultValue: {
      title: post.title,
      content: post.content,
    },
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parse(formData, { schema }),
  })

  return (
    <div>
      <nav className="flex py-2 px-4">
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <Link to={`/${handle}/posts/${id}`} prefetch="intent">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </Button>

        <div className="flex-1" />
      </nav>

      <Form method="POST" className="flex flex-col gap-4" {...form.props}>
        <AppHeadingSection>
          <fieldset>
            <Label htmlFor={title.id}>タイトル</Label>
            <Input type="text" {...conform.input(title)} />
            {title.error && (
              <div className="text-destructive">{title.error}</div>
            )}
          </fieldset>

          <fieldset>
            <Label htmlFor={content.id}>本文</Label>
            <Textarea {...conform.textarea(content)} />
            {content.error && (
              <div className="text-destructive">{content.error}</div>
            )}
          </fieldset>

          <Button type="submit">更新</Button>
        </AppHeadingSection>
      </Form>
    </div>
  )
}
