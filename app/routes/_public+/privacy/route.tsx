import { parse } from 'marked'
import license from './privacy.md?raw'
const md = parse(license)

export default function PrivacyPolicyPage() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: md }} />
}
