import * as React from 'react'
import { Modal } from 'react-materialize'

export default ({ open, toggle, title, children, style, id }) => (
  <Modal
    id={id}
    header={title}
    style={style}
  >
    {children}
  </Modal>
)
