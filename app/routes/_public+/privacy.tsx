import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import Content from '~/assets/privacy.mdx?raw'
import { Button } from '~/components/ui'

export const meta = () => {
  return [{ title: 'プライバシーポリシー - しずかな Remix SPA Example' }]
}

export default function Privacy() {
  return (
    <div className="markdown prose container">
      <ReactMarkdown>{Content}</ReactMarkdown>

      <div className="my-16 text-center">
        <Button variant="link" asChild>
          <Link to="/">トップに戻る</Link>
        </Button>
      </div>
    </div>
  )
}
