import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useContext, useEffect, useEffectEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppIntegration } from '../../app-integration/app-integration';
import DialogContext from '../../context/dialog/dialog-context';
import { droppedFiles, isFileDrag, isOverPage } from './drop-photo';
import classes from './DropPhoto.module.scss';

/**
 * Takes a photo dropped on any page of the standalone app. While a file is dragged over the page, a veil says that
 * the app takes it; once it is dropped, the dialog of a dropped photo (DropPhotoDialog) asks before it is selected.
 * Of several files, the first is asked about; folders are passed over.
 *
 * TL;DR: Without this, the browser opens a dropped file itself, and the app is left.
 * Details: The browser is kept from it wherever a file is dropped. Over a dialog or the menu, which lie over the page
 * until they are closed, the file is refused instead, and the pointer shows it. Text and links that are dragged, and
 * a drag that starts in the page itself, such as the photo dragged by the mouse, are left to the browser.
 *
 * In Photo Location Map, nothing is listened for: its window does with a dropped file what it did before.
 */
const DropPhoto: React.FC = () => {
  const { t } = useTranslation();
  const dialogCtx = useContext(DialogContext);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const askAbout = useEffectEvent((files: File[]) => dialogCtx.dropPhoto.open(files[0], files.length));

  useEffect(() => {
    if (!AppIntegration.isStandalone) return;

    let isDragFromPage = false;
    // The elements that the file is dragged over, by their dragenter and dragleave: the veil stays while there is
    // one. A drag that moves to another element enters it before it leaves the one before.
    const entered = new Set<EventTarget>();
    let isShown = false;

    const show = (value: boolean) => {
      if (value === isShown) return;
      isShown = value;
      setIsDraggedOver(value);
    };
    const hide = () => {
      entered.clear();
      show(false);
    };
    const isFileDragFromOutside = (event: DragEvent) => !isDragFromPage && isFileDrag(event.dataTransfer);

    // The page takes the file, and a dialog or the menu over it does not, as the pointer shows. Either way, the
    // browser does not open the file.
    const takeOrRefuse = (event: DragEvent) => {
      event.preventDefault();
      const isOver = isOverPage(event.target);
      if (event.dataTransfer) event.dataTransfer.dropEffect = isOver ? 'copy' : 'none';
      show(isOver);
    };

    const handleDragStart = () => {
      isDragFromPage = true;
    };
    const handleDragEnd = () => {
      isDragFromPage = false;
    };
    const handleDragEnter = (event: DragEvent) => {
      if (!isFileDragFromOutside(event)) return;
      if (event.target) entered.add(event.target);
      takeOrRefuse(event);
    };
    const handleDragOver = (event: DragEvent) => {
      if (!isFileDragFromOutside(event)) return;
      takeOrRefuse(event);
    };
    const handleDragLeave = (event: DragEvent) => {
      if (!isFileDragFromOutside(event)) return;
      if (event.target) entered.delete(event.target);
      // An element taken out of the page while the file was over it has no dragleave.
      for (const target of entered) {
        if (!(target instanceof Node) || !target.isConnected) entered.delete(target);
      }
      if (entered.size === 0) show(false);
    };
    const handleDrop = (event: DragEvent) => {
      if (isDragFromPage) {
        isDragFromPage = false;
        return;
      }
      if (!isFileDrag(event.dataTransfer)) return;
      event.preventDefault();
      hide();
      if (!isOverPage(event.target)) return;
      const files = droppedFiles(event.dataTransfer);
      if (files.length > 0) askAbout(files);
    };
    // No mouse event comes while a file is dragged over the page, so one that comes means that none is, whatever
    // event was missed.
    const handleMouseMove = () => {
      if (isShown) hide();
    };

    const listeners: [string, (event: DragEvent) => void][] = [
      ['dragstart', handleDragStart],
      ['dragend', handleDragEnd],
      ['dragenter', handleDragEnter],
      ['dragover', handleDragOver],
      ['dragleave', handleDragLeave],
      ['drop', handleDrop],
      ['mousemove', handleMouseMove],
    ];
    // On the window, before the elements of the page, so that none of them can keep the browser from being stopped.
    for (const [type, listener] of listeners) {
      window.addEventListener(type, listener as EventListener, true);
    }
    return () => {
      for (const [type, listener] of listeners) {
        window.removeEventListener(type, listener as EventListener, true);
      }
    };
  }, []);

  if (!isDraggedOver) return null;
  return (
    <div className={classes.veil}>
      <div className={classes.message}>
        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 48 }} />
        {t('dropPhoto.dropHere')}
      </div>
    </div>
  );
};

export default DropPhoto;
