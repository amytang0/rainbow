import { useRoute } from '@react-navigation/native';
import lang from 'i18n-js';
import React, { useCallback, useEffect } from 'react';
import { cloudPlatform } from '../../../utils/platform';
import { RainbowButton } from '../../buttons';
import { SheetActionButton } from '../../sheet';
import { analytics } from '@/analytics';
import BackupIcon from '@/assets/backupIcon.png';
import BackupIconDark from '@/assets/backupIconDark.png';
import { Box, Stack, Text } from '@/design-system';
import WalletBackupStepTypes from '@/helpers/walletBackupStepTypes';
import { useWallets } from '@/hooks';
import { ImgixImage } from '@/components/images';
import { useNavigation } from '@/navigation';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { useTheme } from '@/theme';

const BackupButton = styled(RainbowButton).attrs({
  type: 'small',
  width: ios ? 221 : 270,
})({});

const TopIcon = styled(ImgixImage).attrs({
  resizeMode: ImgixImage.resizeMode.contain,
})({
  height: 74,
  width: 75,
});

export default function NeedsBackupView() {
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute();
  const { wallets, selectedWallet } = useWallets();
  const walletId = (params as any)?.walletId || selectedWallet.id;

  useEffect(() => {
    if (wallets?.[walletId]?.backedUp) {
      setParams({ type: 'AlreadyBackedUpView' });
    }
  }, [setParams, walletId, wallets]);

  useEffect(() => {
    analytics.track('Needs Backup View', {
      category: 'settings backup',
    });
  }, []);

  const onIcloudBackup = useCallback(() => {
    analytics.track(`Back up to ${cloudPlatform} pressed`, {
      category: 'settings backup',
    });
    navigate(ios ? Routes.BACKUP_SHEET : Routes.BACKUP_SCREEN, {
      nativeScreen: true,
      step: WalletBackupStepTypes.cloud,
      walletId,
    });
  }, [navigate, walletId]);

  const onManualBackup = useCallback(() => {
    analytics.track('Manual Backup pressed', {
      category: 'settings backup',
    });
    navigate(ios ? Routes.BACKUP_SHEET : Routes.BACKUP_SCREEN, {
      nativeScreen: true,
      step: WalletBackupStepTypes.manual,
      walletId,
    });
  }, [navigate, walletId]);

  const { colors, isDarkMode } = useTheme();

  return (
    <Box alignItems="center" height="full" width="full">
      <Box marginTop="-10px">
        <Text
          color={{ custom: colors.orangeLight }}
          size="14px / 19px (Deprecated)"
          weight="medium"
        >
          {lang.t('back_up.needs_backup.not_backed_up')}
        </Text>
      </Box>
      <Box
        alignItems="center"
        height="full"
        justifyContent="center"
        marginTop="-36px"
        width="full"
      >
        <TopIcon source={isDarkMode ? BackupIconDark : BackupIcon} />
        <Stack alignHorizontal="center" space="19px">
          <Text size="20px / 24px (Deprecated)" weight="bold">
            {lang.t('back_up.needs_backup.back_up_your_wallet')}{' '}
          </Text>
          <Box paddingBottom="24px" paddingHorizontal="42px">
            <Text
              align="center"
              color="secondary50"
              size="18px / 27px (Deprecated)"
            >
              {lang.t('back_up.needs_backup.dont_risk')}
            </Text>
          </Box>
          <BackupButton
            label={`􀙶 ${lang.t('modal.back_up.default.button.cloud_platform', {
              cloudPlatformName: cloudPlatform,
            })}`}
            onPress={onIcloudBackup}
          />
          <Box width={{ custom: ios ? 221 : 270 }}>
            <SheetActionButton
              color={colors.white}
              // @ts-ignore
              label={`🤓 ${lang.t('modal.back_up.default.button.manual')}`}
              onPress={onManualBackup}
              textColor={colors.alpha(colors.blueGreyDark, 0.8)}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
