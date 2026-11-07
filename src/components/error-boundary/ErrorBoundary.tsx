import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
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
// Client Errors" in Next.js' Pages Router documentation. React itself logs the error.
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
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
