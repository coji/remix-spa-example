import { conform, useForm } from '@conform-to/react'
import { parse, refine } from '@conform-to/zod'
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useActionData,
} from '@remix-run/react'
import { FrownIcon } from 'lucide-react'
import { z } from 'zod'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Alert, AlertDescription, Button, Input, toast } from '~/components/ui'
import { createAccount, isAccountExistsByUID } from '~/models/account'
import { useSignOut } from '~/routes/auth+/sign_out'
import { requireAuth } from '~/services/auth'

const createSchema = (
  constraint: {
    isUniqueHandle?: (handle: string) => Promise<boolean>
  } = {},
) => {
  return z.object({
    handle: z
      .string({ required_error: 'ハンドルネームは必須です' })
      .min(3, '最低3文字必要です')
      .max(20, '最大20文字までです')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'ハンドルネームは半角英数字とアンダースコア(_)のみ使用できます',
      )
      .pipe(
        z.string().superRefine((handle, ctx) =>
          refine(ctx, {
            validate: () => constraint?.isUniqueHandle?.(handle),
            message: 'このハンドルネームは既に使われています',
          }),
        ),
      ),
  })
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const user = await requireAuth(request, { failureRedirect: '/' })
  if (user.handle) {
    return redirect(`/${user.handle}`)
  }
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const user = await requireAuth(request, { failureRedirect: '/' })

  const formData = await request.formData()
  const submission = await parse(formData, {
    schema: createSchema({
      isUniqueHandle: async (handle) => {
        return !(await isAccountExistsByUID(handle))
      },
    }),
    async: true,
  })

  if (!submission.value) {
    return submission
  }

  await createAccount(user.uid, submission.value.handle, {
    displayName: submission.value.handle,
    photoURL: null,
  })

  toast({
    title: 'アカウントを作成しました',
    description: 'ようこそ！',
  })

  return redirect(`/${submission.value.handle}`)
}

export default function CreateAccountPage() {
  const lastSubmission = useActionData<typeof clientAction>()
  const [form, { handle }] = useForm({
    lastSubmission,
    onValidate: ({ formData }) => parse(formData, { schema: createSchema() }),
  })
  const { signOut } = useSignOut()

  return (
    <AppHeadingSection className="items-center">
      <div className="text-xl">アカウントを作成します</div>

      <Form method="POST" {...form.props}>
        <div className="bg-slate-100 rounded-3xl flex flex-col gap-4 p-6">
          <div className="text-slate-700">ハンドルネームを決めましょう</div>

          <div className="flex flex-row gap-4">
            <div className="whitespace-nowrap">
              remix-spa-example.web.app /{' '}
            </div>
            <Input
              {...conform.input(handle)}
              className={`${
                handle.error
                  ? 'outline outline-red-500 focus-visible:ring-red-500'
                  : ''
              }`}
              autoFocus
            />
          </div>

          <Button type="submit" variant="outline">
            これで始める
          </Button>

          {handle.error && (
            <Alert variant="destructive">
              <AlertDescription className="items-center flex flex-row gap-2">
                <FrownIcon className="h-4 w-4" /> {handle.error}
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
