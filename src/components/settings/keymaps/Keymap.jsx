import * as React from 'react'
import Row from '../Row'

export default ({ name, keyName, usage }) => (
  <Row className="row">
    <div className="col s3">{name}</div>
    <div className="col s3 center-align">{keyName}</div>
    <div className="col s6 grey-text text-darken-1">{usage}</div>
  </Row>
)
