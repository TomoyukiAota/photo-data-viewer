import { useEffect } from "react";
import { loadPlmSettings } from "../app-integration/plm-settings";
import usePageView from "../analytics/usePageView";
import { useAppLayoutTracker } from "./useAppLayout";
import { useLanguagePageTracker } from "./useLanguagePageTracker";
import { usePageHiddenTracker } from "./usePageHiddenTracker";
import { useUserSettingsInitializer, useUserSettingsTracker } from "./useUserSettings";

export const useAppRoot = () => {
  usePageView();
  usePageHiddenTracker();
  useLanguagePageTracker();

  loadPlmSettings();

  useUserSettingsInitializer();

  // Recorded when the window's size changes, and when the layout shown does,
  // which the user's choice of the layout mode changes too.
  const { trackAppLayout, appLayout } = useAppLayoutTracker();
  useEffect(
    () => trackAppLayout(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appLayout.windowWidth, appLayout.windowHeight, appLayout.isWideLayout]
  );

  const { trackLoadedUserSettings } = useUserSettingsTracker();
  useEffect(
    () => trackLoadedUserSettings(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Run only once when the page is loaded.
  );
}
