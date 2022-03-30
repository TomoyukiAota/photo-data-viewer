import { createContext } from "react";

import { pageTitleDefaultValue } from "./page-title-default-value";

type PageTitleContextType = {
  indexPageTitle: string,
  setIndexPageTitle: (title: string) => void,
};

const PageTitleContext = createContext<PageTitleContextType>({
  indexPageTitle: pageTitleDefaultValue.index,
  setIndexPageTitle: () => { },
});

export default PageTitleContext;
