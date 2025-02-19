import { ExternalLinkIcon } from 'lucide-react'
import { Link, href } from 'react-router'
import { SignInModal } from '~/routes/auth/sign_in/page'
import { useSignOut } from '~/routes/auth/sign_out/page'
import { useAuthUser } from '~/services/auth'
import { Avatar, AvatarImage, Button } from './ui'

export const AppFooter = () => {
  const user = useAuthUser()
  const { signOut } = useSignOut()

  return (
    <div className="text-slate-00 bg-slate-50 py-14 text-sm">
      <div className="mx-auto flex w-full max-w-screen-md flex-col gap-11 px-4 sm:px-10 md:flex-row md:px-6">
        <div className="flex-1">
          {user?.handle ? (
            <div className="flex items-center gap-1">
              <Link
                className="flex items-center gap-2 hover:underline"
                to={href('/:handle', { handle: user.handle })}
              >
                <Avatar>
                  <AvatarImage src={user.photoURL ?? undefined} />
                </Avatar>
                @{user.handle}
              </Link>

              <div>·</div>

              <Button variant="link" className="p-0" onClick={() => signOut()}>
                サインアウト
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>しずかな Remix SPA Example</div>
              <div>
                <SignInModal />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link className="hover:underline" to={href('/home')}>
            ホーム
          </Link>
          <Link className="hover:underline" to={href('/license')}>
            規約とポリシー
          </Link>
          <Link
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
            to="https://github.com/coji/remix-spa-example"
          >
            ソースコード
            <ExternalLinkIcon className="mb-1 ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
