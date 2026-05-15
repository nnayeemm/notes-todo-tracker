import type { Attachment } from '../../types/api'
import { formatDateTime, formatFileSize, getAttachmentUrl } from '../../utils/format'
import { Button } from '../ui/Button'
import './AttachmentList.css'

interface AttachmentListProps {
  attachments: Attachment[]
  canDelete?: boolean
  deletingAttachmentId: number | null
  onDelete?: (attachment: Attachment) => void
  showOpenLink?: boolean
}

export function AttachmentList({
  attachments,
  canDelete = true,
  deletingAttachmentId,
  onDelete,
  showOpenLink = true,
}: AttachmentListProps) {
  return (
    <div className="attachment-list surface surface--padded">
      <div className="attachment-list__header">
        <div>
          <h2 className="attachment-list__title">Attachments</h2>
          <p className="attachment-list__copy">
            {canDelete
              ? 'Manage the files already linked to this note.'
              : 'Open the files linked to this note.'}
          </p>
        </div>
        <span className="status-chip">{attachments.length} file(s)</span>
      </div>

      <div className="attachment-list__items">
        {attachments.map((attachment) => {
          const extension =
            attachment.original_name.split('.').pop()?.slice(0, 4).toUpperCase() ?? 'FILE'

          return (
            <article key={attachment.id} className="attachment-list__item">
              <div className="attachment-list__file-type">{extension}</div>

              <div className="attachment-list__meta">
                <h3 className="attachment-list__name">{attachment.original_name}</h3>
                <div className="meta-row">
                  <span className="meta-text">{formatFileSize(attachment.file_size)}</span>
                  <span className="meta-text">{attachment.content_type ?? 'Unknown type'}</span>
                  <span className="meta-text">{formatDateTime(attachment.created_at)}</span>
                </div>
              </div>

              <div className="attachment-list__actions">
                {showOpenLink ? (
                  <a
                    className="attachment-list__link"
                    href={getAttachmentUrl(attachment.file_url, attachment.stored_name)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open
                  </a>
                ) : null}
                {canDelete && onDelete ? (
                  <Button
                    isLoading={deletingAttachmentId === attachment.id}
                    size="sm"
                    variant="secondary"
                    onClick={() => onDelete(attachment)}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
