import {
  Link,
  redirect,
  useLoaderData,
  type ClientLoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/react'
import { ExternalLink } from 'lucide-react'
import { $path } from 'remix-routes'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
import { SignInModal } from '~/routes/auth+/sign_in'
import { isAuthenticated } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [
    { title: 'しずかな Remix SPA Example' },
    {
      name: 'description',
      content:
        'しずかな Remix SPA Example は Remix SPA モードで Firebase を使った Web アプリを作ってみたかったので実験で作った、文章書き散らしサービスです。',
    },
  ]
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const user = await isAuthenticated(request)
  if (user?.handle) {
    return redirect($path('/:handle', { handle: user.handle }))
  }
  return user
}

export default function IndexPage() {
  const user = useLoaderData<typeof clientLoader>()

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <AppHeadingSection className="items-center">
        <h1 className="text-xl">しずかな Remix SPA Example</h1>

        {user?.handle ? (
          <Button variant="outline" className="rounded-full" asChild>
            <Link to={$path('/:handle', { handle: user.handle })}>
              自分のページへ
            </Link>
          </Button>
        ) : (
          <SignInModal />
        )}

        <div>
          しずかな Remix SPA Example は Remix SPA モードで Firebase を使った Web
          アプリを作ってみたかったので実験で作った、文章書き散らしサービスです。
        </div>

        <div>
          あくまで技術的な実験のために作ったものなので、このサイトはいつ消えてもおかしくありません。
          その場合は作成されたアカウントや投稿も、すべて消えてしまいます。あしからずご了承ください。
        </div>

        <div>
          catnose さんが開発・運営されている「
          <a
            className="whitespace-nowrap underline"
            target="_blank"
            rel="noreferrer"
            href="https://sizu.me"
          >
            しずかなインターネット
            <ExternalLink className="ml-1 inline h-4 w-4" />
          </a>
          」リスペクトのもと、UI を参考にさせていただいています。
          「しずかなインターネットは」とても素敵なサービスです。まだのかたはぜひご利用ください。
        </div>

        <Link
          to={$path('/:handle', { handle: 'coji' })}
          className="text-muted-foreground underline"
          prefetch="intent"
        >
          @coji が運営中
        </Link>
      </AppHeadingSection>

      <AppFooter />
    </div>
  )
}
