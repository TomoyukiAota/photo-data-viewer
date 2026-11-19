import { Check } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { useLayoutMode } from '../../hooks/useLayoutMode';
import {
  LayoutMode,
  LayoutModeType,
  layoutModes,
} from '../../utils/user-settings';

/** The keys of each mode's texts in src/locales. */
const modeTexts: Record<
  LayoutModeType,
  {
    nameKey:
      'home.layout.auto' | 'home.layout.splitPanes' | 'home.layout.singlePane';
    descriptionKey?: 'home.layout.autoDescription';
  }
> = {
  [LayoutMode.Auto]: {
    nameKey: 'home.layout.auto',
    descriptionKey: 'home.layout.autoDescription',
  },
  [LayoutMode.SplitPanes]: { nameKey: 'home.layout.splitPanes' },
  [LayoutMode.SinglePane]: { nameKey: 'home.layout.singlePane' },
};

/**
 * The layout modes, as the items of a menu that chooses one: the submenu of
 * the menu's entry Layout (LayoutSubmenu), and the menu of the button Layout
 * in Photo Location Map (LayoutButton). `onChosen` gets the mode that is
 * chosen, which may be the one in use.
 *
 * TL;DR: The modes are radio items, with the check mark at the chosen one, as
 * the menu has it at the page shown, and without icons.
 * Details: A screen reader says which mode is chosen. The chosen one is
 * selected, so that a menu opens with the keyboard's focus on it. These are
 * the items themselves, not a component that renders them: a menu finds its
 * selected item among its own children.
 */
export function useLayoutModeItems(
  onChosen: (mode: LayoutModeType) => void,
): React.JSX.Element[] {
  const { t } = useTranslation();
  const layoutMode = useLayoutMode();
  const id = useId();

  return layoutModes.map((mode) => {
    const isChosen = mode === layoutMode;
    const { nameKey, descriptionKey } = modeTexts[mode];
    // The entry is named by its name alone, and its description, under
    // the name, is read after it.
    const nameId = `${id}${mode}-name`;
    const descriptionId = `${id}${mode}-description`;
    return (
      <MenuItem
        key={mode}
        role='menuitemradio'
        aria-checked={isChosen}
        aria-labelledby={descriptionKey ? nameId : undefined}
        aria-describedby={descriptionKey ? descriptionId : undefined}
        // The menu opens with the focus on the chosen mode.
        selected={isChosen}
        onClick={() => onChosen(mode)}
        // A text wider than the window continues on the next line.
        sx={{ whiteSpace: 'normal' }}
      >
        <ListItemIcon>
          <Check style={{ visibility: isChosen ? 'visible' : 'hidden' }} />
        </ListItemIcon>
        <ListItemText
          primary={t(nameKey)}
          secondary={descriptionKey && t(descriptionKey)}
          slotProps={{
            primary: { id: nameId },
            secondary: { id: descriptionId },
          }}
        />
      </MenuItem>
    );
  });
}
