import { parse } from 'marked'
import license from './license.md?raw'

const md = parse(license)

export default function PrivacyPolicyPage() {
  console.log(md)
  return (
    <div>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div dangerouslySetInnerHTML={{ __html: md }} />
    </div>
  )
}
