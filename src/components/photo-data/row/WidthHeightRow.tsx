import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import PhotoDimensionsContext from '../../../context/photo-dimensions/photo-dimensions-context';
import { valuesIn } from '../../../i18n/text-values';

const WidthHeightRow: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { dimensions, loadStatus } = useContext(PhotoDimensionsContext);

  if (loadStatus === 'Not Loaded') {
    return <div />; // at app start
  } else if (loadStatus === 'Loading') {
    return <div>{t('photoData.loading')}</div>;
  } else if (loadStatus === 'Load Failed') {
    return <div>{t('photoData.notAvailable')}</div>;
  }

  if (!dimensions) {
    console.assert(
      false,
      "Something went wrong when loadStatus === 'Load Success' and dimensions is falsy."
    );
    return <div />;
  }

  const { width, height } = dimensions;
  // Numbers alone are written from left to right in every language.
  return (
    <div dir='auto'>
      {t(
        'photoData.general.dimensions',
        valuesIn(i18n.language, { width, height }),
      )}
    </div>
  );
};

export default WidthHeightRow;
