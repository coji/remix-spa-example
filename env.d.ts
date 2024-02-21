/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module '*.mdx' {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let MDXComponent: (props: any) => JSX.Element
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  export const frontmatter: any
  export default MDXComponent
}
