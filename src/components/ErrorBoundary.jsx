import React from 'react';
import { RefreshCcw, WifiOff, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Best guess if it's an offline issue
      const isNetworkError = !navigator.onLine || 
        this.state.error?.message?.toLowerCase().includes('network') || 
        this.state.error?.message?.toLowerCase().includes('fetch');

      return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-center font-sans">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl max-w-lg w-full border border-gray-100">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              {isNetworkError ? (
                <WifiOff className="w-12 h-12 text-[#F5A623]" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-[#F5A623]" />
              )}
            </div>
            
            <h1 className="text-3xl font-black text-[#1C2F5E] mb-4">
              {isNetworkError ? "No Internet" : "Oops! Something broke."}
            </h1>
            
            <p className="text-gray-500 mb-8 font-medium">
              {isNetworkError 
                ? "It looks like you're offline. Please check your internet connection and try refreshing." 
                : "We hit a little snag while rendering this page! Don't worry, just refresh the app."}
            </p>

            <button 
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-[#F5A623] text-white py-4 rounded-xl font-bold hover:brightness-95 transition shadow-lg active:scale-95"
            >
              <RefreshCcw className="w-5 h-5" />
              <span>Refresh Page</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full mt-4 py-3 text-gray-400 font-bold hover:text-[#1C2F5E] transition"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
