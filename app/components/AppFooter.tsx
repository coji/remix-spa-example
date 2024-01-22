import { Link } from '@remix-run/react'
import { UserIcon } from 'lucide-react'
import { SignInModal } from '~/routes/auth+/sign_in'
import { useSignOut } from '~/routes/auth+/sign_out'
import { useAuthUser } from '~/services/auth'
import { Button } from './ui'

export const AppFooter = () => {
  const user = useAuthUser()
  const { signOut } = useSignOut()

  return (
    <div className="py-14 bg-slate-50">
      <div className="mx-auto w-full px-6 xs:px-7 sm:px-10 max-w-screen-lg flex flex-col gap-11 md:flex-row">
        <div className="flex-1">
          {user ? (
            <div>
              <Link className="underline" to={`/${user.handle}`}>
                <UserIcon className="inline mr-2" /> @{user.handle}
              </Link>
              <Button variant="link" onClick={() => signOut()}>
                サインアウト
              </Button>
            </div>
          ) : (
            <div className="gap-4 flex flex-col">
              <div>しずかな Remix SPA Example</div>
              <div>
                <SignInModal />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/">ホーム</Link>
          <Link to="/license">規約とポリシー</Link>
          <Link to="https://github.com/coji/remix-spa-example">
            ソースコード
          </Link>
        </div>
      </div>
    </div>
  )
}
