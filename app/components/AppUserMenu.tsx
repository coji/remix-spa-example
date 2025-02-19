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
import { useSignOut } from '~/routes/auth/sign_out/page'
import { useAuthUser } from '~/services/auth'

export const AppUserMenu = () => {
  const user = useAuthUser()
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
            alt={user.handle ?? undefined}
          />
          <AvatarFallback>{user.handle}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div>@{user.handle}</div>
          <div className="font-normal leading-none text-muted-foreground">
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
