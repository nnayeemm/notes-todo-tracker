import type { Attachment } from '../../types/api'
import { formatDateTime, formatFileSize, getAttachmentUrl } from '../../utils/format'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
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
        <div className="attachment-list__header-title-row">
          <h2 className="attachment-list__title">Attachments</h2>
          <span className="attachment-list__count">
            {attachments.length} {attachments.length === 1 ? 'File' : 'Files'}
          </span>
        </div>
        <p className="attachment-list__copy">
          {canDelete
            ? 'Manage the files already linked to this note.'
            : 'Open the files linked to this note.'}
        </p>
      </div>

      <div className="attachment-list__items">
        {attachments.map((attachment) => {
          const extension =
            attachment.original_name.split('.').pop()?.slice(0, 4).toUpperCase() ?? 'FILE'

          return (
            <article key={attachment.id} className="attachment-list__item">
              <div className="attachment-list__item-top">
                <div className="attachment-list__file-type">{extension}</div>
                <h3 className="attachment-list__name">{attachment.original_name}</h3>
                <div className="attachment-list__actions">
                  {showOpenLink ? (
                    <a
                      aria-label="Open attachment"
                      className="attachment-list__open-btn"
                      href={getAttachmentUrl(attachment.file_url, attachment.stored_name)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Icon className="attachment-list__open-icon" name="externalLink" />
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
              </div>
              <div className="attachment-list__item-meta" aria-label="Attachment metadata">
                <span className="meta-text meta-text--size">{formatFileSize(attachment.file_size)}</span>
                <span className="meta-separator" aria-hidden="true">
                  •
                </span>
                <span className="meta-text meta-text--date">{formatDateTime(attachment.created_at)}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
