import type { SyntaxHighlighterProps } from 'react-syntax-highlighter'

import ReactSyntaxHighlighter from 'react-syntax-highlighter'

// @ts-ignore
const SyntaxHighlighter = ({ children: { props } }: SyntaxHighlighterProps) => {
  return (
    <div className="mockup-code">
      <ReactSyntaxHighlighter {...props}>
        {props.children}
      </ReactSyntaxHighlighter>
    </div>
  )
}

export default SyntaxHighlighter
