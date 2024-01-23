import { parse } from 'marked'
import license from '~/assets/license.md?raw'
const md = parse(license)

export default function LisencePage() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: md }} />
}
