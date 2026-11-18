import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

import { AppIntegration } from '../../app-integration/app-integration';
import { useIsRtl } from '../../direction/DirectionProvider';
import { isIos, isMac } from '../../utils/os';
import classes from './DropHintButton.module.scss';

// A mouse or a trackpad as the main pointer, with which a file can be dragged from the file manager.
const POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeToPointer(onChange: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => {};
  const query = window.matchMedia(POINTER_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function hasFinePointer(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(POINTER_QUERY).matches;
}

/**
 * The button beside Select Photo that says, in a box under it, that a photo can also be selected by dropping its file
 * on the page (DropPhoto.tsx): from the Finder on a Mac, and from File Explorer elsewhere, named as each language's
 * macOS and Windows name them.
 *
 * TL;DR: It is there only in the standalone app, where the main pointer is a mouse or a trackpad.
 * Details: A file is dragged from the file manager with one. A phone or a tablet has none, and Photo Location Map takes
 * no drop.
 *
 * The box is a dialog: Escape, a click outside it or on the button closes it, and gives the keyboard's focus back to
 * the button. A file dragged into the window closes it as well, as a dialog over the page would refuse the drop.
 */
const DropHintButton: React.FC = () => {
  const { t } = useTranslation();
  const isRtl = useIsRtl();
  const isFinePointer = useSyncExternalStore(subscribeToPointer, hasFinePointer, () => false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const popupId = useId();
  const textId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setAnchorEl(null);
    window.addEventListener('dragenter', close, true);
    return () => window.removeEventListener('dragenter', close, true);
  }, [isOpen]);

  if (!AppIntegration.isStandalone || !isFinePointer || isIos()) return null;

  const label = t('dropPhoto.hintButton');
  return (
    <>
      <IconButton
        size='small'
        className={classes.button}
        aria-label={label}
        title={label}
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-controls={isOpen ? popupId : undefined}
        onClick={(event) => setAnchorEl(isOpen ? null : event.currentTarget)}
      >
        <InfoOutlinedIcon fontSize='small' />
      </IconButton>
      <Popover
        id={popupId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        // Under the button, from the edge where its line starts, and inside the window.
        anchorOrigin={{ vertical: 'bottom', horizontal: isRtl ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: isRtl ? 'right' : 'left' }}
        // Gone at once when closed, so that a file dragged into the window is over the page at once.
        transitionDuration={{ enter: 225, exit: 0 }}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-labelledby': textId,
            // As wide as the sentence needs, up to 320 pixels, and never wider than the window, from whose edges MUI
            // keeps the box 16 pixels. In MUI's styles, which would come after a class of this app's.
            sx: {
              marginTop: '4px',
              maxWidth: 'min(320px, calc(100% - 32px))',
              padding: '10px 14px',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              borderRadius: '6px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            },
          },
        }}
      >
        <p id={textId} className={classes.text}>
          {t(isMac() ? 'dropPhoto.hintFinder' : 'dropPhoto.hintFileExplorer')}
        </p>
      </Popover>
    </>
  );
};

export default DropHintButton;
