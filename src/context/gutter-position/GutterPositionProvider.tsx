import isNumber from 'is-number';
import { useEffect, useState } from 'react';
import {
  readUserSettingAsNumber,
  UserSettingDefaultValue,
  UserSettingKey,
} from '../../utils/user-settings';
import GutterPositionContext from './gutter-position-context';

function saveGutterPositionToLocalStorage(position: {
  photoDataPaneFlex: number;
  photoImagePaneFlex: number;
}) {
  localStorage.setItem(
    UserSettingKey.WideLayoutPhotoDataPaneFlex,
    position.photoDataPaneFlex.toString()
  );
  localStorage.setItem(
    UserSettingKey.WideLayoutPhotoImagePaneFlex,
    position.photoImagePaneFlex.toString()
  );
}

const GutterPositionProvider: React.FC = (props) => {
  const [photoDataPaneFlex, setPhotoDataPaneFlex] = useState<number>(
    UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex
  );
  const [photoImagePaneFlex, setPhotoImagePaneFlex] = useState<number>(
    UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex
  );

  const handleSetPhotoDataPaneFlex = (value?: number | null) => {
    if (!isNumber(value)) {
      value = UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex;
    }
    const valueNumber = value as number;
    setPhotoDataPaneFlex(valueNumber);
    saveGutterPositionToLocalStorage({
      photoDataPaneFlex: valueNumber,
      photoImagePaneFlex, // Save all gutter positions when a gutter is moved.
    });
  };
  const handleSetPhotoImagePaneFlex = (value?: number | null) => {
    if (!isNumber(value)) {
      value = UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex;
    }
    const valueNumber = value as number;
    setPhotoImagePaneFlex(valueNumber);
    saveGutterPositionToLocalStorage({
      photoDataPaneFlex, // Save all gutter positions when a gutter is moved.
      photoImagePaneFlex: valueNumber,
    });
  };

  useEffect(
    () => {
      const photoDataPaneFlex = readUserSettingAsNumber(
        UserSettingKey.WideLayoutPhotoDataPaneFlex,
        UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex
      );
      setPhotoDataPaneFlex(photoDataPaneFlex);
      const photoImagePaneFlex = readUserSettingAsNumber(
        UserSettingKey.WideLayoutPhotoImagePaneFlex,
        UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex
      );
      setPhotoImagePaneFlex(photoImagePaneFlex);
    },
    [] // Load gutter position from local storage when the app starts.
  );

  return (
    <GutterPositionContext.Provider
      value={{
        wideLayout: {
          photoDataPaneFlex: photoDataPaneFlex,
          photoImagePaneFlex: photoImagePaneFlex,
          setPhotoDataPaneFlex: handleSetPhotoDataPaneFlex,
          setPhotoImagePaneFlex: handleSetPhotoImagePaneFlex,
        },
      }}
    >
      {props.children}
    </GutterPositionContext.Provider>
  );
};

export default GutterPositionProvider;
