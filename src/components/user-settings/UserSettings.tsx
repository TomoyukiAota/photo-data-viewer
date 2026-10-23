import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import dayjs from 'dayjs';
import { useContext } from 'react';

import PhotoContext from '../../context/photo/photo-context';
import { useUserSettings } from '../../hooks/useUserSettings';
import { DateTimeFormat } from '../../utils/date-time-format';
import { UserSettingKey } from '../../utils/user-settings';
import classes from './UserSettings.module.scss';

const UserSettings: React.FC = () => {
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

  const handleSendUsageDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserSetting(UserSettingKey.SendUsageData, event.target.checked);
  };

  const formatStr = DateTimeFormat.ForUser.getDayjsFormatString(
    dateFormat,
    clockSystemFormat
  );
  const dateTimeExample = dayjs('2019-11-25T14:53:29.396Z').format(formatStr);

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>Settings</div>
      <div className={classes['page-description']}>
        <div>Settings are saved in your browser.</div>
      </div>
      <div className={classes['date-time-settings']}>
        <div className={classes['date-time-settings-title']}>
          Date & Time Format
        </div>
        <div className={classes['date-time-settings-select']}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id='date-format'>Date Format</InputLabel>
            <Select
              labelId='date-format'
              value={dateFormat}
              label='Date Format'
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
            <InputLabel id='clock-system-format'>12- or 24-hour</InputLabel>
            <Select
              labelId='clock-system-format'
              value={clockSystemFormat}
              label='12- or 24-hour'
              onChange={handleClockSystemFormatChange}
            >
              {DateTimeFormat.ForUser.ClockSystemFormat_List.map((value) => {
                return (
                  <MenuItem value={value} key={value}>
                    {value}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes['date-time-settings-example']}>
          <div>Example</div>
          <div>{dateTimeExample}</div>
        </div>
      </div>
      <div className={classes['usage-data-settings']}>
        <div className={classes['usage-data-settings-title']}>Usage Data</div>
        <FormControlLabel
          control={
            <Switch
              checked={userSettings.sendUsageData}
              onChange={handleSendUsageDataChange}
            />
          }
          label='Send usage data to improve this application'
        />
        <div className={classes['usage-data-settings-note']}>
          What is sent is described on the About page. This setting applies to
          this browser only.
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
