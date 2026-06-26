import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-sentinel-surface border border-sentinel-critical/30 rounded-xl m-6 text-center">
          <div className="p-3 bg-sentinel-critical/20 rounded-full border border-sentinel-critical mb-4">
            <AlertTriangle className="w-8 h-8 text-sentinel-critical" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Command Panel Telemetry Interruption</h3>
          <p className="text-sm text-sentinel-muted max-w-md mb-6 font-mono">
            An unexpected client render anomaly occurred: {this.state.error?.message || 'Component Crash'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-sentinel-accent hover:bg-sentinel-accent/80 text-white font-semibold text-xs uppercase rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Command Center</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
