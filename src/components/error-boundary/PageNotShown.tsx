import i18n from '../../i18n/i18n';
import classes from './PageNotShown.module.scss';

/**
 * What the page shows when rendering it threw (the error boundary in _app.tsx), in
 * place of Next.js' own "Application error" page. It uses no context, as what
 * provides the context may be what failed; the texts come straight from the
 * translation instance.
 */
const PageNotShown: React.FC = () => {
  return (
    <div className={classes.container} role='alert'>
      <p>{i18n.t('pageNotShown.message')}</p>
      <button type='button' onClick={() => window.location.reload()}>
        {i18n.t('pageNotShown.reload')}
      </button>
    </div>
  );
};

export default PageNotShown;
