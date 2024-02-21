import { MenuIcon, XIcon } from 'lucide-react'

interface AppNavMenuProps {
  isOpen: boolean
  onClick: (isOpen: boolean) => void
}
export const AppNavMenu = ({ isOpen, onClick }: AppNavMenuProps) => {
  return (
    <nav
      className={`flex flex-col gap-8 overflow-y-auto overflow-x-clip border-r p-2 transition-all ${
        isOpen ? 'max-w-96' : 'max-w-16'
      }`}
    >
      <div>
        <button type="button" onClick={() => onClick(!isOpen)}>
          ex
        </button>
      </div>

      <div className="whitespace-nowrap">
        Hoge {isOpen ? 'hohgoehogehoge' : ''}
      </div>
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
