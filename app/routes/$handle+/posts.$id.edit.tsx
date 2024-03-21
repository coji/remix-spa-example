import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  Form,
  Link,
  json,
  redirect,
  useActionData,
  useLoaderData,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
} from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Input, Label, Textarea } from '~/components/ui'
import { deleteUserPost, getUserPostById, updateUserPost } from '~/models/posts'
import { requireUser } from '~/services/auth'

const schema = z.object({
  title: z
    .string({ required_error: '必須です' })
    .max(60, 'タイトルは60字までです。'),
  content: z
    .string({ required_error: '必須です' })
    .max(14000, '最大文字数に達しました 14000 / 14000 字'),
})

export const clientLoader = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
  const { handle, id } = zx.parseParams(params, {
    handle: z.string(),
    id: z.string(),
  })

  // 本人の投稿以外は編集できない / 存在確認
  const user = await requireUser(request, { failureRedirect: $path('/') })
  if (handle !== user.handle) throw json({ message: 'Forbidden', status: 403 })

  const post = await getUserPostById(handle, id)
  if (!post) throw json({ message: 'Not found', status: 404 })
  return { handle, id, post, user }
}

export const clientAction = async ({
  request,
  params,
}: ClientActionFunctionArgs) => {
  const { handle, id } = zx.parseParams(params, {
    handle: z.string(),
    id: z.string(),
  })

  // 本人の投稿以外は編集できない / 存在確認
  const user = await requireUser(request, { failureRedirect: $path('/') })
  if (handle !== user.handle) throw json({ message: 'Forbidden', status: 403 })

  const formData = await request.formData()

  // 削除
  if (String(formData.get('intent')) === 'delete') {
    await deleteUserPost(handle, id)
    return redirect($path('/:handle', { handle }))
  }

  // 更新
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  await updateUserPost(handle, {
    id,
    uid: user.uid,
    handle,
    title: submission.value.title,
    content: submission.value.content,
    publishedAt: null,
  })
  return redirect($path('/:handle/posts/:id', { handle, id }))
}

export default function PostEditPage() {
  const { handle, id, post } = useLoaderData<typeof clientLoader>()
  const lastResult = useActionData<typeof clientAction>()

  const [form, { title, content }] = useForm({
    id: 'post-edit',
    defaultValue: {
      title: post.title,
      content: post.content,
    },
    lastResult,
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <div className="relative">
      <nav className="sticky top-0 flex flex-row gap-4 px-4 py-2 sm:justify-between">
        {post.publishedAt ? (
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link
              to={$path('/:handle/posts/:id', { handle, id })}
              prefetch="intent"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Form method="POST">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              name="intent"
              value="delete"
              type="submit"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Form>
        )}

        <Button
          className="rounded-full transition-all"
          type="submit"
          size="sm"
          form={form.id}
        >
          更新する
        </Button>

        <div />
      </nav>

      <Form
        method="POST"
        className="flex flex-col gap-4"
        {...getFormProps(form)}
      >
        <AppHeadingSection>
          <fieldset>
            <Label htmlFor={title.id}>タイトル</Label>
            <Input {...getInputProps(title, { type: 'text' })} />
            <div className="text-destructive">{title.errors}</div>
          </fieldset>

          <fieldset>
            <Label htmlFor={content.id}>本文</Label>
            <Textarea {...getTextareaProps(content)} />

            <div className="text-destructive">{content.errors}</div>
          </fieldset>
        </AppHeadingSection>
      </Form>
    </div>
  )
}
