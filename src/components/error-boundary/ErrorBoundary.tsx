import { Component, ErrorInfo, ReactNode } from 'react';

import { recordError } from '../../analytics/record-error';

interface ErrorBoundaryProps {
  /** Which part of the page this is, recorded with the error: 'page' or 'map'. */
  name: string;
  /** Shown instead of the children once rendering them threw. */
  fallback: ReactNode;
  /** The children are rendered again when this changes, such as when another photo is loaded. */
  resetKey?: unknown;
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Keeps an error thrown while rendering a part of the page to that part: the part
// shows the fallback, and the rest of the page stays. Without one, Next.js replaces
// the whole page. A class component, as React has no hook for this; see "Handling
// Client Errors" in Next.js' Pages Router documentation. React itself logs the
// error; this records it, as such an error never reaches the window.
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    recordError(error, 'render', {
      boundary: this.props.name,
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  public componentDidUpdate(previousProps: ErrorBoundaryProps): void {
    if (
      this.state.hasError &&
      !Object.is(previousProps.resetKey, this.props.resetKey)
    ) {
      this.setState({ hasError: false });
    }
  }

  public render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
