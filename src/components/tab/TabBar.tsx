import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * A row of tabs with a line under it, and what comes after the tabs at the
 * end of the row: the button Layout, in Photo Location Map (LayoutButton).
 *
 * TL;DR: Scrollable, for a language whose labels are wider than a phone's
 * window: the tabs are swiped along, and choosing one brings it into view.
 * Without MUI's scroll buttons.
 * Details: MUI shows them when a tab is less than 99% in view, and the tabs'
 * bar is a pixel lower than its tabs while the table under it is tall, so
 * they would appear with nothing to scroll. With nothing after them, the tabs
 * are the row themselves, as they were before the button, and the standalone
 * app shows them as it did.
 */
const TabBar: React.FC<{
  value: string;
  onChange: (event: React.SyntheticEvent, value: string) => void;
  /** What comes after the tabs, at the end of their row. */
  end?: React.ReactNode;
  children: React.ReactNode;
}> = (props) => {
  const tabs = (sx: SxProps<Theme>) => (
    <Tabs
      value={props.value}
      onChange={props.onChange}
      variant='scrollable'
      scrollButtons={false}
      sx={sx}
    >
      {props.children}
    </Tabs>
  );

  if (!props.end) {
    return tabs({ borderBottom: 1, borderColor: 'divider', padding: '0 10px' });
  }
  // The tabs take the room that what comes after them leaves, and scroll in it.
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        paddingInline: '10px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {tabs({ flex: '1 1 auto', minWidth: 0 })}
      {props.end}
    </Box>
  );
};

export default TabBar;
