import FormControlLabel from '@mui/material/FormControlLabel';
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

/**
 * A text of a select, whether shown in the field or in its menu, may take more
 * than one line: it is never cut, however long a language writes it.
 */
const wrappingSelect = {
  '& .MuiSelect-select': { whiteSpace: 'normal', overflowWrap: 'anywhere' },
} as const;
const wrappingChoice = { whiteSpace: 'normal', overflowWrap: 'anywhere' } as const;

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
        {/*
          TL;DR: Each field has its name above it, and is as wide as its name
          and its choices need, in every language.
          Details: The name was drawn on the field's border, on one line, and
          was cut where a language's name was wider than the field ("12- oder
          24-Stunden-Format"). Above the field it takes as many lines as it
          needs, and the field is as wide as the name. The two fields are side
          by side while the window has room for both, and one under the other
          on a phone.
        */}
        <div className={classes['date-time-settings-select']}>
          <div className={classes.field}>
            <div id='date-format' className={classes['field-name']}>
              {t('settings.dateTime.dateFormat')}
            </div>
            <Select
              labelId='date-format'
              value={dateFormat}
              onChange={handleDateFormatChange}
              size='small'
              sx={{ minWidth: 150, ...wrappingSelect }}
            >
              {DateTimeFormat.ForUser.DateFormat_List.map((value) => {
                return (
                  <MenuItem value={value} key={value} sx={wrappingChoice}>
                    {value}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div className={classes.field}>
            <div id='clock-system-format' className={classes['field-name']}>
              {t('settings.dateTime.clockSystem')}
            </div>
            <Select
              labelId='clock-system-format'
              value={clockSystemFormat}
              onChange={handleClockSystemFormatChange}
              size='small'
              sx={{ minWidth: 110, ...wrappingSelect }}
            >
              {DateTimeFormat.ForUser.ClockSystemFormat_List.map((value) => {
                return (
                  <MenuItem value={value} key={value} sx={wrappingChoice}>
                    {clockSystemFormatLabel[value]}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </div>
        <div className={classes['date-time-settings-example']}>
          <div className={classes['field-name']}>
            {t('settings.dateTime.example')}
          </div>
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
