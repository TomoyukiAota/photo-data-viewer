import Tab from '@mui/material/Tab';
import { styled } from '@mui/system';

const StyledTab = styled((props: any) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
  })
);

export default StyledTab;
