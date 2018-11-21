import * as React from 'react'
import uuidv4 from 'uuid/v4'
import { inject, observer } from 'mobx-react'
import { Collapsible, CollapsibleItem } from 'react-materialize'
import i18nReact from 'i18n-react'
import styledComponents from 'styled-components'
import Settings from 'react-material-icon-svg/dist/SettingsIcon'
import AppleKeyboardCommand from 'react-material-icon-svg/dist/AppleKeyboardCommandIcon'
import Link from 'react-material-icon-svg/dist/LinkIcon'
import Backup from 'react-material-icon-svg/dist/BackupRestoreIcon'

import CurrencySetting from './settingItems/CurrencySetting'
import Keymap from './keymaps/Keymap'
import RegionSetting from './settingItems/RegionSetting'
import AboutSetting from './settingItems/AboutSetting'
import ShieldCoinbase from './blockchain/ShieldCoinbase'
import Reindex from './blockchain/Reindex'
import ShieldTo from './blockchain/ShieldTo'
import AutoShieldCoinbase from './blockchain/AutoShieldCoinbase'
import ExportWallet from './backup/ExportWallet'
import ImportWallet from './backup/ImportWallet'

class SettingsTab extends React.Component {
  getKeyMaps() {
    return [
      {
        name: i18nReact.translate('settings.shortkey.quicksend.name'),
        keyName: 'CTRL/CMD + S',
        usage: i18nReact.translate('settings.shortkey.quicksend.usage'),
      },
      {
        name: i18nReact.translate('settings.shortkey.hideinformation.name'),
        keyName: 'CTRL/CMD + H',
        usage: i18nReact.translate('settings.shortkey.hideinformation.usage'),
      },
      {
        name: i18nReact.translate('settings.shortkey.lockwallet.name'),
        keyName: 'CTRL/CMD + L',
        usage: i18nReact.translate('settings.shortkey.lockwallet.usage'),
      },
    ]
  }          

  render() {
    return (
      <div id="settings" className="col s12">
        <Collapsible style={{ overflow: 'overlay', maxHeight: 'calc(100vh - 132px)' }}>
          <li className="active">
            <div className="collapsible-header active">
              <Backup style={{ fill: '#262626', marginRight: '24px' }} />
              {i18nReact.translate('settings.backup')}
            </div>
            <div className="collapsible-body">
              <div className="container">
                <div className="row">
                  <ExportWallet />
                  <ImportWallet />
                  {/* <button
                className="btn amber lighten-2 waves-effect waves-light grey darken-3"
                onClick={() => autoUpdater.checkForUpdatesAndNotify()}
                style={{
                  display: 'inline-flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginLeft: '0%',
                }}
              >
                Check Update
              </button> */}
                </div>
              </div>
            </div>
          </li>
          <li className="active">
            <div className="collapsible-header active">
              <Link style={{ fill: '#262626', marginRight: '24px' }} />
              {i18nReact.translate('settings.blockchain')}
            </div>
            <div className="collapsible-body">
              <div className="container">
                <div className="row">
                  <Reindex />
                  <AutoShieldCoinbase />
                  <ShieldTo />
                  <ShieldCoinbase />
                </div>
              </div>
            </div>
          </li>        
          <li className="active">
            <div className="collapsible-header active">
              <Settings style={{ fill: '#262626', marginRight: '24px' }} />
              {i18nReact.translate('settings.title')}
            </div>
            <div className="collapsible-body">
              <div className="container">
                <div className="row">
                  <AboutSetting />
                  <CurrencySetting />
                  <RegionSetting />
                </div>
              </div>
            </div>
          </li>
          <li className="active">
            <div className="collapsible-header active">
              <AppleKeyboardCommand style={{ fill: '#262626', marginRight: '24px' }} />
              {i18nReact.translate('settings.keymap')}
            </div>
            <div className="collapsible-body">
              <div className="container">
                <div className="row">
                  {this.getKeyMaps().map(keyItem => (
                    <Keymap key={uuidv4()} {...keyItem} />
                  ))}
                </div>
              </div>
            </div>
          </li>
        </Collapsible>
      </div>
    )
  }
}

export default inject('SettingsStore')(observer(SettingsTab))
