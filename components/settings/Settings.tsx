import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import { useState } from 'react';

import { DateTimeFormat } from '../../utils/date-time-format';
import classes from './Settings.module.scss';

type DateFormatType = DateTimeFormat.ForUser.DateFormatType;
type ClockSystemFormatType = DateTimeFormat.ForUser.ClockSystemFormatType;

const Settings: React.FC = () => {
  const [dateFormat, setDateFormat] = useState<DateFormatType>(
    DateTimeFormat.ForUser.DateFormat_Default
  );

  const handleDateFormatChange = (event: SelectChangeEvent<string>) => {
    setDateFormat(event.target.value as DateFormatType);
  };

  const [clockSystemFormat, setClockSystemFormat] =
    useState<ClockSystemFormatType>(
      DateTimeFormat.ForUser.ClockSystemFormat_Default
    );

  const handleClockSystemFormatChange = (event: SelectChangeEvent<string>) => {
    setClockSystemFormat(event.target.value as ClockSystemFormatType);
  };

  const formatStr = DateTimeFormat.ForUser.getDayjsFormatString(
    dateFormat,
    clockSystemFormat
  );
  const dateTimeExample = dayjs('2019-11-25T14:53:29.396Z').format(formatStr);

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>Settings</div>
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
    </div>
  );
};

export default Settings;
