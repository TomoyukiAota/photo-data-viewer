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

/**
 * A text of a select, whether shown in the field or in its menu, may take more
 * than one line: it is never cut, however long a language writes it.
 */
const wrappingSelect = {
  '& .MuiSelect-select': { whiteSpace: 'normal', overflowWrap: 'anywhere' },
} as const;
const wrappingChoice = { whiteSpace: 'normal', overflowWrap: 'anywhere' } as const;

/** A field has no width of its own: it is as wide as the box that it is in. */
const asWideAsItsBox = { width: 0, minWidth: '100%' } as const;

/**
 * The box around a field of the date and time, which gives the field its
 * width.
 *
 * TL;DR: A field is as wide as its label and its widest choice need, in any
 * language, and never narrower than it is in English (`minWidth`).
 * Details: MUI draws a field's label on the field's border, on one line, and
 * cuts it with "…" where it is wider than the field, which is as wide as the
 * chosen value. Once the translations named the clock's setting as their
 * languages do ("12- oder 24-Stunden-Format"), the label was cut in 29
 * languages. The box lays out the label and the choices without showing them
 * (see the styles), and the field fills the box. A width set for the longest
 * language would leave the others with room that they do not need; this one
 * follows each language, and is what it was in English and Japanese.
 */
const FieldBox: React.FC<
  React.PropsWithChildren<{
    label: string;
    choices: readonly string[];
    minWidth: number;
  }>
> = (props) => (
  <div
    className={classes['field-box']}
    style={{ minWidth: props.minWidth }}
    data-label={props.label}
    data-choices={props.choices.join('\n')}
  >
    {props.children}
  </div>
);

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
          <FieldBox
            label={t('settings.dateTime.dateFormat')}
            choices={DateTimeFormat.ForUser.DateFormat_List}
            minWidth={150}
          >
            <FormControl sx={asWideAsItsBox}>
              <InputLabel id='date-format'>
                {t('settings.dateTime.dateFormat')}
              </InputLabel>
              <Select
                labelId='date-format'
                value={dateFormat}
                label={t('settings.dateTime.dateFormat')}
                onChange={handleDateFormatChange}
                sx={wrappingSelect}
              >
                {DateTimeFormat.ForUser.DateFormat_List.map((value) => {
                  return (
                    <MenuItem value={value} key={value} sx={wrappingChoice}>
                      {value}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </FieldBox>
          <FieldBox
            label={t('settings.dateTime.clockSystem')}
            choices={DateTimeFormat.ForUser.ClockSystemFormat_List.map(
              (value) => clockSystemFormatLabel[value],
            )}
            minWidth={110}
          >
            <FormControl sx={asWideAsItsBox}>
              <InputLabel id='clock-system-format'>
                {t('settings.dateTime.clockSystem')}
              </InputLabel>
              <Select
                labelId='clock-system-format'
                value={clockSystemFormat}
                label={t('settings.dateTime.clockSystem')}
                onChange={handleClockSystemFormatChange}
                sx={wrappingSelect}
              >
                {DateTimeFormat.ForUser.ClockSystemFormat_List.map((value) => {
                  return (
                    <MenuItem value={value} key={value} sx={wrappingChoice}>
                      {clockSystemFormatLabel[value]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </FieldBox>
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
