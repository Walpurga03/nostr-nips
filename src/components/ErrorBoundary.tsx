import React, { Component, ErrorInfo } from 'react';

// Definiere die Props für die ErrorBoundary-Komponente
interface Props {
  children: React.ReactNode;
}

// Definiere den State für die ErrorBoundary-Komponente
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // Initialisiere den State
  state = { hasError: false };

  // Methode, um den State bei einem Fehler zu aktualisieren
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Methode, um Fehler zu loggen
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  // Render-Methode, um entweder die Kinderkomponenten oder eine Fehlermeldung anzuzeigen
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;