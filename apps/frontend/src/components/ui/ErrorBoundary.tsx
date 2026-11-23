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
    console.error('PassForge Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6 text-[#252525]">
          <div className="max-w-lg w-full bg-white border border-[#E9E5DC] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-[#A83232]">
              <div className="p-2.5 rounded-xl bg-[#FDF0F0] border border-[#F5CCCC]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#252525]">Application Render Notice</h2>
                <p className="text-xs text-[#77736C]">A component encountered an unexpected error</p>
              </div>
            </div>

            <div className="bg-[#FDF0F0] border border-[#F5CCCC] rounded-xl p-3 mb-5 font-mono text-xs text-[#A83232] break-words">
              {this.state.error?.message || 'Unknown error'}
            </div>

            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#B86E52] hover:bg-[#A15D43] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}