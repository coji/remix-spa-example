import { useFetcher } from '@remix-run/react'
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
import { useAuthUser } from '~/services/auth'

export const UserAvatarMenu = () => {
  const user = useAuthUser()
  const isLoading = user === undefined

  const fetcher = useFetcher()
  const handleSelectSignOut = () => {
    fetcher.submit({}, { method: 'POST', action: '/sign_out' })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>no user</div>
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
        <DropdownMenuItem onSelect={() => handleSelectSignOut()}>
          サインアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
