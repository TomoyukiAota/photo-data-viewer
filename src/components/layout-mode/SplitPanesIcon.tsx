import { createSvgIcon } from '@mui/material/SvgIcon';

/**
 * Two panes stacked beside a tall one, as the split panes are: the photo and
 * the map on the left, and the data on the right, in a language written from
 * right to left too. It is MUI's SpaceDashboard icon, mirrored.
 *
 * The icon of the layouts, whichever is chosen: of the menu's entry Layout
 * (LayoutSubmenu), and of the button Layout in Photo Location Map
 * (LayoutButton).
 */
const SplitPanesIcon = createSvgIcon(
  <path d='M13 21h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-6zm-2 0H5c-1.1 0-2-.9-2-2v-7h8zM3 10V5c0-1.1.9-2 2-2h6v7z' />,
  'SplitPanes',
);

export default SplitPanesIcon;
