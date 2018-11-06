import * as React from 'react'
import { inject, observer } from 'mobx-react'
import i18nReact from 'i18n-react'

import Row from '../Row'
import ReindexModal from '../../modals/ReindexModal'

export class Reindex extends React.Component {
  state = {
    
  }

  toggleShieldCoinbase() {
    $(`#reindexModal`).modal('open')
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <Row className="row">
        <div className="col s3">
          <span>
            {i18nReact.translate('settings.reindex.name')}
          </span>
        </div>
        <div className="col s3 center-align">
          <ReindexModal toggle={this.toggleShieldCoinbase} />
          <a 
            className="btn grey darken-3 waves-effect waves-light"
            onClick={
              this.toggleShieldCoinbase
            }
          >{i18nReact.translate('settings.reindex.shield')}</a>
        </div>
        <div className="col s6">
          <span className="grey-text text-darken-1">
            {i18nReact.translate('settings.reindex.explain')}
          </span>
        </div>
      </Row>
    )
  }
}

export default inject('SettingsStore', 'AccountInformationStore')(observer(Reindex))
