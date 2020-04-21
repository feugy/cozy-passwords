import React, { useState, useCallback } from 'react'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import getSupportedPlatforms, { platforms } from 'supportedPlatforms'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { isAndroid, isIOS } from 'cozy-device-helper'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Text } from 'cozy-ui/transpiled/react/Text'

import Dialog from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
import keyBy from 'lodash/keyBy'
import { AppStoreButton, PlayStoreButton } from './StoreButtons'

const PlatformButton = props => {
  const { icon, ...rest } = props
  const color = props.theme === 'primary' ? 'var(--white)' : 'var(--slateGrey)'
  return (
    <ButtonLink
      icon={<Icon icon={icon} size={16} color={color} />}
      theme="secondary"
      className="u-mb-half"
      {...rest}
    />
  )
}
const storeLinksPerOS = keyBy(
  Object.values(platforms).filter(x => x.os),
  'os'
)

export const InstallNativeAppButton = props => {
  const [isSmartphoneModalOpened, setSmartphoneModalOpened] = useState(false)
  const mobileOS = isAndroid() ? 'android' : isIOS() ? 'ios' : null
  const handleOpenModal = useCallback(() => {
    setSmartphoneModalOpened(true)
  }, [setSmartphoneModalOpened])

  const handleDismissModal = useCallback(() => {
    setSmartphoneModalOpened(false)
  }, [setSmartphoneModalOpened])

  return (
    <>
      <PlatformButton
        icon="phone"
        href={mobileOS !== null ? storeLinksPerOS[mobileOS].storeUrl : null}
        onClick={mobileOS === null ? handleOpenModal : null}
        {...props}
      />
      {isSmartphoneModalOpened ? (
        <Dialog open={isSmartphoneModalOpened} onClose={handleDismissModal}>
          <DialogCloseButton onClick={() => handleDismissModal()} />
          <DialogContent className="u-flex u-flex-column u-flex-justify-center">
            <div className="u-ta-center">
              <AppStoreButton href={storeLinksPerOS.ios.storeUrl} />
              <PlayStoreButton href={storeLinksPerOS.android.storeUrl} />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  )
}

const AvailablePlatforms = props => {
  const { t } = useI18n()
  const supportedPlatforms = getSupportedPlatforms()
  return (
    <Card {...props}>
      <Stack spacing="m">
        <Text>{t('AvailablePlatforms.text')}</Text>
        <div>
          {Object.entries(supportedPlatforms)
            .filter(([, infos]) => infos.type === 'browser')
            .map(([platform, infos]) => (
              <PlatformButton
                key={platform}
                href={infos.storeUrl}
                icon={`browser-${platform}`}
                label={infos.label}
              />
            ))}
          <InstallNativeAppButton label={t('AvailablePlatforms.smartphone')} />
        </div>
      </Stack>
    </Card>
  )
}

export default AvailablePlatforms
