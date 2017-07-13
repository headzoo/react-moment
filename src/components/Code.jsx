import React from 'react';

const Code = ({ lang, children, ...props }) => (
  <pre {...props}>
    <code className={lang}>
      {children.trim()}
    </code>
  </pre>
);

export default Code;