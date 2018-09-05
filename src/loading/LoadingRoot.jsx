import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ipcRenderer } from 'electron'

class LoadingRoot extends React.Component {
  componentDidMount() {
    setTimeout(() => ipcRenderer.send('finalized-loading'), 1000)
  }

  render() {
    return (
      <div
        className="container"
        fluid={true}
        style={{ backgroundColor: 'black' }}
      >
        <img
          className="logo-svg center-block"
          style={{
            height: 'auto',
            width: '512px',
          }}
        />
        <div className="row" style={{ background: '#ffc600', color: 'black', padding: '10px' }}>
          <div>Official <strong>CrypticCoin Wallet</strong></div>
          <div>version {this.props.SettingsStore.appVersion}</div>
        </div>
      </div>
    )
  }
}

export default inject('CoinStatsStore', 'SettingsStore')(observer(LoadingRoot))
