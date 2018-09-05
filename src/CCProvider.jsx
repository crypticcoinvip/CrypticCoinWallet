import * as React from 'react'

import { inject, observer } from 'mobx-react'

import { ThemeProvider } from 'styled-components'

const CCProvider = inject('SettingsStore')(
  observer(({ children, SettingsStore }) => (
    <ThemeProvider theme={{ light: !SettingsStore.getDarkTheme }}>
      {children}
    </ThemeProvider>
  )),
)

export default CCProvider
