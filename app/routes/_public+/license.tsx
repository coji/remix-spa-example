import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import Content from '~/assets/license.mdx?raw'
import { Button } from '~/components/ui'

export const meta = () => {
  return [{ title: '利用規約 - しずかな Remix SPA Example' }]
}

export default function License() {
  return (
    <div className="markdown prone container">
      <ReactMarkdown>{Content}</ReactMarkdown>

      <div className="my-16 text-center">
        <Button variant="link" asChild>
          <Link to="/">トップに戻る</Link>
        </Button>
      </div>
    </div>
  )
}
