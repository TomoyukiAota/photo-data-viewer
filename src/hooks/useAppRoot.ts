import { useEffect } from "react";
import usePageView from "../google-analytics/usePageView";
import { useAppLayoutTracker } from "./useAppLayout";
import { useUserSettingsInitializer, useUserSettingsTracker } from "./useUserSettings";

export const useAppRoot = () => {
  usePageView();

  const { initilizeUserSettingsIfNeeded } = useUserSettingsInitializer();
  initilizeUserSettingsIfNeeded();

  const { trackAppLayout, appLayout } = useAppLayoutTracker();
  useEffect(
    () => trackAppLayout(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appLayout.windowWidth, appLayout.windowHeight]
  );

  const { trackLoadedUserSettings } = useUserSettingsTracker();
  useEffect(
    () => trackLoadedUserSettings(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Run only once when the page is loaded.
  );
}
