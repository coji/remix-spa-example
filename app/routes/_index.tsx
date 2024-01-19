import {
  ClientLoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/react'
import { ExternalLink } from 'lucide-react'
import { SignInModal } from '~/routes/_auth+/sign_in'
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
  if (user) {
    redirect(`/${user.handle}`)
  }
  return null
}

export default function IndexPage() {
  return (
    <div>
      <div className="px-4 py-32 max-w-lg w-full mx-auto flex flex-col justify-center items-center gap-8 leading-10">
        <h1 className="text-xl">しずかな Remix SPA Example</h1>

        <SignInModal />

        <div>
          しずかな Remix SPA Example は Remix SPA モードで Firebase を使った Web
          アプリを作ってみたかったので実験で作った、文章書き散らしサービスです。
        </div>

        <div>
          catnose さんが開発・運営されている「
          <a
            className="underline whitespace-nowrap"
            target="_blank"
            rel="noreferrer"
            href="https://sizu.me"
          >
            しずかなインターネット
            <ExternalLink className="inline h-4 w-4 ml-1" />
          </a>
          」リスペクトのもと、UI をかなり参考にさせていただいています。
          「しずかなインターネットは」とても素敵なサービスです。まだのかたはぜひご利用ください。
        </div>

        <div className="text-muted-foreground">coji が運営中</div>
      </div>

      <div className="p-8 container text-center bg-slate-50">
        <div className="px-16 flex flex-col md:flex-row justify-between">
          <div>hoge</div>
          <div>hogehoge</div>
        </div>
      </div>
    </div>
  )
}
