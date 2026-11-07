import classes from './PageNotShown.module.scss';

/**
 * What the page shows when rendering it threw (the error boundary in _app.tsx), in
 * place of Next.js' own "Application error" page. It uses no context, as what
 * provides the context may be what failed.
 */
const PageNotShown: React.FC = () => {
  return (
    <div className={classes.container} role='alert'>
      <p>Something went wrong, and this page cannot be shown.</p>
      <button type='button' onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  );
};

export default PageNotShown;
