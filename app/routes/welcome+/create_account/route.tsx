import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { FrownIcon } from 'lucide-react'
import { Form, redirect } from 'react-router'
import { z } from 'zod'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Alert, AlertDescription, Button, Input, toast } from '~/components/ui'
import { userContext } from '~/middlewares/user-context'
import { createAccount } from '~/models/account'
import { useSignOut } from '~/routes/auth+/sign_out/route'
import type { Route } from './+types/route'

const schema = z.object({
  handle: z
    .string({ error: 'ハンドルネームは必須です' })
    .min(3, '最低3文字必要です')
    .max(20, '最大20文字までです')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'ハンドルネームは半角英数字とアンダースコア(_)のみ使用できます',
    ),
})

export const clientAction = async ({
  request,
  context,
}: Route.ClientActionArgs) => {
  // Middleware でセットされたユーザ情報を取得
  const user = context.get(userContext)
  if (!user) {
    throw new Error('システムエラー: ユーザ情報がありません')
  }

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  try {
    await createAccount(user.uid, submission.value.handle, {
      displayName: submission.value.handle,
      photoURL: null,
    })
    toast('アカウントを作成しました', {
      description: 'ようこそ！',
    })

    return redirect(`/${submission.value.handle}`)
  } catch (e) {
    return {
      lastResult: submission.reply({
        formErrors: [`アカウントの作成に失敗しました: ${e}`],
      }),
    }
  }
}

export default function CreateAccountPage({
  actionData,
}: Route.ComponentProps) {
  const [form, { handle }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const { signOut } = useSignOut()

  return (
    <AppHeadingSection className="items-center">
      <div className="text-xl">アカウントを作成します</div>

      <Form method="POST" {...getFormProps(form)}>
        <div className="flex flex-col gap-4 rounded-3xl bg-slate-100 p-6">
          <div className="text-slate-700">ハンドルネームを決めましょう</div>

          <div className="flex flex-row gap-4">
            <div className="whitespace-nowrap">
              remix-spa-example.web.app /{' '}
            </div>
            <Input
              {...getInputProps(handle, { type: 'text' })}
              className={`${
                handle.errors
                  ? 'outline outline-red-500 focus-visible:ring-red-500'
                  : ''
              }`}
              autoFocus
            />
          </div>

          <Button type="submit" variant="outline">
            これで始める
          </Button>

          {handle.errors && (
            <Alert variant="destructive">
              <AlertDescription className="flex flex-row items-center gap-2">
                <FrownIcon className="h-4 w-4" /> {handle.errors}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Form>

      <Button variant="link" onClick={() => signOut()}>
        アカウント作成をやめる
      </Button>
    </AppHeadingSection>
  )
}
