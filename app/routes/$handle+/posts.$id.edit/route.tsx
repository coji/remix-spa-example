import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { data, Form, href, Link, redirect, useNavigation } from 'react-router'
import { z } from 'zod'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button, Input, Label, Textarea } from '~/components/ui'
import { userContext } from '~/middlewares/user-context'
import { deleteUserPost, getUserPostById, updateUserPost } from '~/models/posts'
import type { Route } from './+types/route'

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('delete'),
  }),
  z.object({
    intent: z.literal('update'),
    title: z
      .string({ required_error: '必須です' })
      .max(60, 'タイトルは60字までです。'),
    content: z
      .string({ required_error: '必須です' })
      .max(14000, '最大文字数に達しました 14000 / 14000 字'),
  }),
])

export const clientLoader = async ({
  params: { handle, id },
  context,
}: Route.ClientLoaderArgs) => {
  // ミドルウェアからセットされたオプショナルのユーザ情報を取得
  const user = context.get(userContext)
  // 本人の投稿以外は編集できない / 存在確認
  if (user?.handle !== handle) throw data(null, { status: 403 })

  const post = await getUserPostById(handle, id)
  if (!post) throw data(null, { status: 404 })

  return { handle, id, post, user }
}

export const clientAction = async ({
  request,
  params: { handle, id },
  context,
}: Route.ClientActionArgs) => {
  // ミドルウェアからセットされたオプショナルのユーザ情報を取得
  const user = context.get(userContext)
  // 本人の投稿以外は編集できない / 存在確認
  if (user?.handle !== handle) {
    throw data(null, { status: 403 })
  }

  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // 削除
  if (submission.value.intent === 'delete') {
    await deleteUserPost(handle, id)
    throw redirect(href('/:handle', { handle }))
  }

  // 更新
  if (submission.value.intent === 'update') {
    await updateUserPost(handle, {
      id,
      uid: user.uid,
      handle,
      title: submission.value.title,
      content: submission.value.content,
      publishedAt: null,
    })
    throw redirect(href('/:handle/posts/:id', { handle, id }))
  }
}

export default function PostEditPage({
  loaderData: { handle, id, post },
  actionData,
}: Route.ComponentProps) {
  const [form, { title, content }] = useForm({
    id: 'post-edit',
    defaultValue: {
      title: post.title,
      content: post.content,
    },
    lastResult: actionData?.lastResult,
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const navigation = useNavigation()

  return (
    <div className="relative">
      <nav className="sticky top-0 flex flex-row gap-4 px-4 py-2 sm:justify-between">
        {post.publishedAt ? (
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link
              to={href('/:handle/posts/:id', { handle, id })}
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
          name="intent"
          value="update"
          form={form.id}
          isLoading={navigation.state === 'submitting'}
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
