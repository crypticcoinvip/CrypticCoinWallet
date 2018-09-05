;--------------------------------
;Include Modern UI

  !include "MUI2.nsh"

;--------------------------------
;General

  ;Name and file
  Name "CrypticCoin"
  OutFile "dist/crypticcoin-setup.exe"

  ;Default installation folder
  InstallDir "$PROGRAMFILES\CrypticCoin"

  ;Get installation folder from registry if available
  InstallDirRegKey HKCU "Software\CrypticCoin" ""

  ;Request application privileges for Windows Vista
  RequestExecutionLevel admin

;--------------------------------
;Variables

;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING

;--------------------------------
;Pages

  ;!insertmacro MUI_PAGE_LICENSE "tmp/LICENCE"
  ;!insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY

  ;Start Menu Folder Page Configuration
  !define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
  !define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\CrypticCoin"
  !define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"

  ;!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder

  !insertmacro MUI_PAGE_INSTFILES

  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

;--------------------------------
;Languages

  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

Section

  SetOutPath "$INSTDIR"

  ;ADD YOUR OWN FILES HERE...
  file /r build\crypticcoin-wallet-win32-x64\*.*

  ;Store installation folder
  WriteRegStr HKCU "Software\CrypticCoin" "" $INSTDIR

  ;Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"


  CreateShortCut "$DESKTOP\CrypticCoin.lnk" "$INSTDIR\CrypticCoin.exe" ""

  ;create start-menu items
  CreateDirectory "$SMPROGRAMS\CrypticCoin"
  CreateShortCut "$SMPROGRAMS\CrypticCoin\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0
  CreateShortCut "$SMPROGRAMS\CrypticCoin\CrypticCoin.lnk" "$INSTDIR\CrypticCoin.exe" "" "$INSTDIR\CrypticCoin.exe" 0

  CreateDirectory "$PROFILE\AppData\Roaming\CrypticcoinParams"
  CopyFiles "$INSTDIR\resources\sprout-proving.key" "$PROFILE\AppData\Roaming\CrypticcoinParams"
  CopyFiles "$INSTDIR\resources\sprout-verifying.key" "$PROFILE\AppData\Roaming\CrypticcoinParams"

  CreateDirectory "$PROFILE\AppData\Roaming\Crypticcoin"
  CopyFiles "$INSTDIR\resources\CrypticCoin.conf" "$PROFILE\AppData\Roaming\Crypticcoin"

  CreateDirectory "C:\Crypticcoin\Tor"
  CopyFiles "$INSTDIR\resources\win32" "C:\Crypticcoin\Tor"

SectionEnd

;--------------------------------
;Descriptions

  ;Assign language strings to sections
  ;!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  ;  !insertmacro MUI_DESCRIPTION_TEXT ${SecDummy} $(DESC_SecDummy)
  ;!insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------
;Uninstaller Section

Section "Uninstall"

  ;ADD YOUR OWN FILES HERE...
  RMDir /r "$INSTDIR\*.*"

  RMDir "$INSTDIR"

  Delete "$DESKTOP\CrypticCoin.lnk"
  Delete "$SMPROGRAMS\CrypticCoin\*.*"
  RmDir  "$SMPROGRAMS\CrypticCoin"

  Delete "C:\Crypticcoin\*.*"
  RmDir  "C:\Crypticcoin"

  Delete "$PROFILE\AppData\Roaming\Crypticcoin\*.*"
  RmDir  "$PROFILE\AppData\Roaming\Crypticcoin"

  Delete "$PROFILE\AppData\Roaming\CrypticcoinParams\*.*"
  RmDir  "$PROFILE\AppData\Roaming\CrypticcoinParams"

  DeleteRegKey /ifempty HKCU "Software\CrypticCoin"

SectionEnd