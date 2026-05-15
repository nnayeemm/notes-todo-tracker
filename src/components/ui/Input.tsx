import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import './Input.css'

interface BaseInputProps {
  label: string
  error?: string
  hint?: string
  textarea?: boolean
  wrapperClassName?: string
}

type Props = BaseInputProps &
  InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>

export function Input({
  error,
  hint,
  label,
  textarea = false,
  wrapperClassName = '',
  ...rest
}: Props) {
  return (
    <label className={`field ${wrapperClassName}`.trim()}>
      <span className="field__label">{label}</span>
      {textarea ? (
        <textarea className="field__control field__control--textarea" {...rest} />
      ) : (
        <input className="field__control" {...rest} />
      )}
      {hint ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
