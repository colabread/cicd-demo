import * as React from 'react'

const AntdIconPlaceholder = React.memo(function AntdIconPlaceholder(
  props: React.HTMLAttributes<HTMLSpanElement>,
) {
  return <span {...props} aria-hidden="true" />
})

export default AntdIconPlaceholder
