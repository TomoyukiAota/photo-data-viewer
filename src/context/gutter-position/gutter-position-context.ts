import { createContext } from "react";
import { UserSettingDefaultValue } from '../../utils/user-settings';

type GutterPositionContextType = {
  wideLayout: {
    photoDataPaneFlex: number;
    photoImagePaneFlex: number;
    setPhotoDataPaneFlex: (value?: number | null) => void;
    setPhotoImagePaneFlex: (value?: number | null) => void;
  },
};

const GutterPositionContext = createContext<GutterPositionContextType>({
  wideLayout: {
    photoDataPaneFlex: UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex,
    photoImagePaneFlex: UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex,
    setPhotoDataPaneFlex: () => { },
    setPhotoImagePaneFlex: () => { },
  },
});

export default GutterPositionContext;
