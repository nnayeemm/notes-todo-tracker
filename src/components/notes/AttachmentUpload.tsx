import { useState } from 'react'
import { Button } from '../ui/Button'
import './AttachmentUpload.css'

interface AttachmentUploadProps {
  isUploading: boolean
  onUpload: (file: File) => Promise<void>
}

export function AttachmentUpload({
  isUploading,
  onUpload,
}: AttachmentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedFile) {
      setError('Choose a file before uploading.')
      return
    }

    setError('')
    await onUpload(selectedFile)
    setSelectedFile(null)
    const input = event.currentTarget.elements.namedItem('attachment') as HTMLInputElement | null
    if (input) {
      input.value = ''
    }
  }

  return (
    <form className="attachment-upload surface surface--padded" onSubmit={handleSubmit}>
      <div>
        <h2 className="attachment-upload__title">Upload attachment</h2>
        
      </div>

      <label className="attachment-upload__picker">
        <span className="attachment-upload__label">Choose file</span>
        <input
          name="attachment"
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] ?? null)
            setError('')
          }}
          type="file"
        />
        <span className="attachment-upload__filename">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
      </label>

      {error ? <p className="attachment-upload__error">{error}</p> : null}

      <Button isLoading={isUploading} type="submit">
        Upload file
      </Button>
    </form>
  )
}
