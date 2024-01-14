import { MenuIcon, XIcon } from 'lucide-react'

interface AppNavMenuProps {
  isOpen: boolean
  onClick: (isOpen: boolean) => void
}
export const AppNavMenu = ({ isOpen, onClick }: AppNavMenuProps) => {
  return (
    <nav
      className={`transition-all border-r border-l p-2 ${
        isOpen ? 'w-96' : 'w-16'
      }`}
    >
      <button type="button" onClick={() => onClick(!isOpen)}>
        expand
      </button>

      <div>Hoge</div>
      <div>hoge</div>
      <div>hoge</div>
    </nav>
  )
}

interface AppNavMenuButtonProps extends AppNavMenuProps {}
export const AppNavMenuButton = ({
  isOpen,
  onClick,
}: AppNavMenuButtonProps) => {
  return (
    <button type="button" onClick={() => onClick(!isOpen)}>
      {isOpen ? <XIcon /> : <MenuIcon />}
    </button>
  )
}
