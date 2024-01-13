import { Form, Link } from '@remix-run/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui'
import { useAuthUser } from '~/services/auth'

export const AppUserProfile = () => {
  const user = useAuthUser()
  const isLoading = user === undefined

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <Form method="POST" action="/sign_in">
        <Button variant="outline" size="sm">
          サインイン
        </Button>
      </Form>
    )
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
          <div>{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Form method="POST" action="/sign_out">
            <Button type="submit" variant="default" size="sm">
              サインアウト
            </Button>
          </Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
