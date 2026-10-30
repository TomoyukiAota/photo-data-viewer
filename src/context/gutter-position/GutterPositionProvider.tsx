import isNumber from 'is-number';
import { useState } from 'react';
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

const GutterPositionProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [photoDataPaneFlex, setPhotoDataPaneFlex] = useState<number>(
    () => typeof window === 'undefined'
      ? UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex
      : readUserSettingAsNumber(UserSettingKey.WideLayoutPhotoDataPaneFlex, UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex)
  );
  const [photoImagePaneFlex, setPhotoImagePaneFlex] = useState<number>(
    () => typeof window === 'undefined'
      ? UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex
      : readUserSettingAsNumber(UserSettingKey.WideLayoutPhotoImagePaneFlex, UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex)
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
