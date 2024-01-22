import { Link } from '@remix-run/react'
import { ExternalLinkIcon } from 'lucide-react'
import { SignInModal } from '~/routes/auth+/sign_in'
import { useSignOut } from '~/routes/auth+/sign_out'
import { useAuthUser } from '~/services/auth'
import { Avatar, AvatarImage, Button } from './ui'

export const AppFooter = () => {
  const user = useAuthUser()
  const { signOut } = useSignOut()

  return (
    <div className="py-14 bg-slate-50">
      <div className="mx-auto w-full px-6 xs:px-7 sm:px-10 max-w-screen-lg flex flex-col gap-11 md:flex-row">
        <div className="flex-1">
          {user ? (
            <div className="flex flex-col gap-4">
              <Link
                className="hover:underline flex gap-2 items-center"
                to={`/${user.handle}`}
              >
                <Avatar>
                  <AvatarImage src={user.photoURL ?? undefined} />
                </Avatar>
                @{user.handle}
              </Link>

              <div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => signOut()}
                >
                  サインアウト
                </Button>
              </div>
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
          <Link className="hover:underline" to="/">
            ホーム
          </Link>
          <Link className="hover:underline" to="/license">
            規約とポリシー
          </Link>
          <Link
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
            to="https://github.com/coji/remix-spa-example"
          >
            ソースコード
            <ExternalLinkIcon className="h-4 w-4 inline ml-1 mb-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
