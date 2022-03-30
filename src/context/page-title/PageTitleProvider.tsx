import { useState } from 'react';

import PageTitleContext from './page-title-context';
import { pageTitleDefaultValue } from './page-title-default-value';

const PageTitleProvider: React.FC = (props) => {
  const [indexPageTitle, setIndexPageTitle] = useState(
    pageTitleDefaultValue.index
  );

  return (
    <PageTitleContext.Provider
      value={{
        indexPageTitle,
        setIndexPageTitle,
      }}
    >
      {props.children}
    </PageTitleContext.Provider>
  );
};

export default PageTitleProvider;
