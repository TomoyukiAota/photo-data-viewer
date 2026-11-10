import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import PhotoContext from '../../context/photo/photo-context';
import { useUserSettings } from '../../hooks/useUserSettings';
import { DateTimeFormat } from '../../utils/date-time-format';
import { UserSettingKey } from '../../utils/user-settings';
import classes from './UserSettings.module.scss';

const UserSettings: React.FC = () => {
  const { t } = useTranslation();
  const { userSettings, setUserSetting } = useUserSettings();
  const photoCtx = useContext(PhotoContext);

  const dateFormat = userSettings.dateFormat;
  const handleDateFormatChange = (event: SelectChangeEvent<string>) => {
    setUserSetting(UserSettingKey.DateFormat, event.target.value);
    photoCtx.reloadPhoto();
  };

  const clockSystemFormat = userSettings.clockSystemFormat;
  const handleClockSystemFormatChange = (event: SelectChangeEvent<string>) => {
    setUserSetting(UserSettingKey.ClockSystemFormat, event.target.value);
    photoCtx.reloadPhoto();
  };
  // The stored values stay as they are; what the select shows is translated.
  const clockSystemFormatLabel: Record<
    DateTimeFormat.ForUser.ClockSystemFormatType,
    string
  > = {
    [DateTimeFormat.ForUser.ClockSystemFormat_12h]: t('settings.dateTime.clock12'),
    [DateTimeFormat.ForUser.ClockSystemFormat_24h]: t('settings.dateTime.clock24'),
  };

  const handleSendUsageDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserSetting(UserSettingKey.SendUsageData, event.target.checked);
  };

  const formatStr = DateTimeFormat.ForUser.getDayjsFormatString(
    dateFormat,
    clockSystemFormat,
    t('dateTime.weekdayPattern')
  );
  const dateTimeExample = dayjs('2019-11-25T14:53:29.396Z').format(formatStr);

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>{t('settings.title')}</div>
      <div className={classes['page-description']}>
        <div>{t('settings.savedInBrowser')}</div>
      </div>
      <div className={classes['date-time-settings']}>
        <div className={classes['date-time-settings-title']}>
          {t('settings.dateTime.title')}
        </div>
        <div className={classes['date-time-settings-select']}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id='date-format'>
              {t('settings.dateTime.dateFormat')}
            </InputLabel>
            <Select
              labelId='date-format'
              value={dateFormat}
              label={t('settings.dateTime.dateFormat')}
              onChange={handleDateFormatChange}
            >
              {DateTimeFormat.ForUser.DateFormat_List.map((value) => {
                return (
                  <MenuItem value={value} key={value}>
                    {value}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <InputLabel id='clock-system-format'>
              {t('settings.dateTime.clockSystem')}
            </InputLabel>
            <Select
              labelId='clock-system-format'
              value={clockSystemFormat}
              label={t('settings.dateTime.clockSystem')}
              onChange={handleClockSystemFormatChange}
            >
              {DateTimeFormat.ForUser.ClockSystemFormat_List.map((value) => {
                return (
                  <MenuItem value={value} key={value}>
                    {clockSystemFormatLabel[value]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes['date-time-settings-example']}>
          <div>{t('settings.dateTime.example')}</div>
          <div>{dateTimeExample}</div>
        </div>
      </div>
      <div className={classes['usage-data-settings']}>
        <div className={classes['usage-data-settings-title']}>
          {t('settings.usageData.title')}
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={userSettings.sendUsageData}
              onChange={handleSendUsageDataChange}
            />
          }
          label={t('settings.usageData.send')}
        />
        <div className={classes['usage-data-settings-note']}>
          {t('settings.usageData.note')}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
