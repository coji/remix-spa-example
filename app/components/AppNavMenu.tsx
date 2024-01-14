import { MenuIcon, XIcon } from 'lucide-react'

interface AppNavMenuProps {
  isOpen: boolean
  onClick: (isOpen: boolean) => void
}
export const AppNavMenu = ({ isOpen, onClick }: AppNavMenuProps) => {
  return (
    <nav
      className={`transition-all border-r overflow-auto flex flex-col gap-8 p-2 ${
        isOpen ? 'max-w-96' : 'max-w-16'
      }`}
    >
      <div>
        <button type="button" onClick={() => onClick(!isOpen)}>
          ex
        </button>
      </div>

      <div>Hoge {isOpen ? 'hohgoehogehoge' : ''}</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
      <div>hoge</div>
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
