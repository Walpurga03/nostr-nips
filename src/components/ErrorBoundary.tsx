import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Hier könnte man den Fehler an einen Error-Tracking-Service senden
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <AlertTriangle className="error-icon" size={48} />
            <h1>Oops, etwas ist schiefgelaufen</h1>
            <p>Es tut uns leid, aber es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu.</p>
            <button
              onClick={() => window.location.reload()}
              className="refresh-button"
            >
              Seite neu laden
            </button>
            {this.state.error && (
              <details className="error-details">
                <summary>Technische Details</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;