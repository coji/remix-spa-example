import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui'
import { useSignOut } from '~/routes/_auth+/sign_out'
import { useAuthUser } from '~/services/auth'

export const AppUserMenu = () => {
  const { user } = useAuthUser()
  const { signOut } = useSignOut()

  const isLoading = user === undefined
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div> </div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user.photoURL ?? undefined}
            alt={user.displayName ?? undefined}
          />
          <AvatarFallback>{user.displayName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div>{user.displayName}</div>
          <div className="text-muted-foreground leading-none font-normal">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          サインアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
