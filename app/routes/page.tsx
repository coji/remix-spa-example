import { ExternalLink } from 'lucide-react'
import { href, Link, redirect, type MetaFunction } from 'react-router'
import { AppFooter } from '~/components/AppFooter'
import { AppHeadingSection } from '~/components/AppHeadingSection'
import { Button } from '~/components/ui'
import { SignInModal } from '~/routes/auth/sign_in/page'
import { isAuthenticated } from '~/services/auth'
import type { Route } from './+types/page'

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

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const user = await isAuthenticated(request)
  if (user?.handle) {
    throw redirect(href('/:handle', { handle: user.handle }))
  }
  return { user }
}

export default function IndexPage({
  loaderData: { user },
}: Route.ComponentProps) {
  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <AppHeadingSection className="items-center">
        <h1 className="text-xl">しずかな Remix SPA Example</h1>

        {user?.handle ? (
          <Button variant="outline" className="rounded-full" asChild>
            <Link to={href('/:handle', { handle: user.handle })}>
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
          to={href('/:handle', { handle: 'coji' })}
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
