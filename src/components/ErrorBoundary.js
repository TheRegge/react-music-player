import React, { Component } from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))
    
    // You could also log to an error reporting service here
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state
      const isApiError = error?.message?.toLowerCase().includes('api') || 
                        error?.message?.toLowerCase().includes('fetch')
      
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <div className="error-boundary__icon">
              {isApiError ? '🌐' : '⚠️'}
            </div>
            
            <h1 className="error-boundary__title">
              {isApiError ? 'Connection Problem' : 'Something went wrong'}
            </h1>
            
            <p className="error-boundary__message">
              {isApiError 
                ? "We're having trouble connecting to the music service. This might be temporary."
                : "The application encountered an unexpected error."}
            </p>
            
            {errorCount > 2 && (
              <p className="error-boundary__warning">
                Multiple errors detected. The application might be experiencing issues.
              </p>
            )}
            
            <div className="error-boundary__actions">
              <button 
                className="error-boundary__button error-boundary__button--primary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              
              <button 
                className="error-boundary__button error-boundary__button--secondary"
                onClick={this.handleReload}
              >
                Reload Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && error && (
              <details className="error-boundary__details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary__stack">
                  <strong>{error.toString()}</strong>
                  {errorInfo && errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary