import { Button } from '~/components/ui'
import { SignInModal } from '~/routes/_auth+/sign_in'

export default function IndexPage() {
  return (
    <div>
      <div className="px-4 py-32 max-w-lg w-full mx-auto flex flex-col justify-center items-center gap-8 leading-10">
        <div>しずかな Remix SPA</div>

        <SignInModal />

        <div>
          しずかな Remix SPA は Remix SPA モードで Firebase を使った Web
          アプリを作ってみたかったので実験で作った、文章書き散らしサービスです。
        </div>

        <div>
          ここではなんら有益な情報はもとめられていません。Remix SPA
          モードで作った Web
          アプリがどんな感じでうごくのか？そんなかんたんな気持ちで、文章を書くための場所です。
        </div>

        <div className="text-muted-foreground">coji が運営中</div>
      </div>

      <div className="p-4 text-center bg-slate-50">hoge</div>
    </div>
  )
}
