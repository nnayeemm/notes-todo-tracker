import './LoadingIndicator.css'

interface LoadingIndicatorProps {
  label?: string
}

export function LoadingIndicator({
  label = 'Loading data from the backend...',
}: LoadingIndicatorProps) {
  return (
    <div className="loading-indicator surface surface--padded" role="status">
      <span className="loading-indicator__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
