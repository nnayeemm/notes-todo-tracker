import type { ReactNode, SVGProps } from 'react'

type IconName =
  | 'add'
  | 'arrowBack'
  | 'calendar'
  | 'checkCircle'
  | 'checkmark'
  | 'close'
  | 'delete'
  | 'edit'
  | 'error'
  | 'externalLink'
  | 'link'
  | 'note'
  | 'paperclip'
  | 'pin'
  | 'search'
  | 'success'
  | 'todo'
  | 'unpin'
  | 'undo'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

const iconMap: Record<IconName, ReactNode> = {
  add: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  arrowBack: (
    <>
      <path d="M15 18l-6-6 6-6" />
      <path d="M9 12h10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </>
  ),
  checkmark: <path d="M4 12.5 9 17.5 20 6.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.8 12.2 11 14.4l4.4-4.8" />
    </>
  ),
  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  delete: (
    <>
      <path d="M5 7.5h14" />
      <path d="M9 4.5h6" />
      <path d="M8 7.5v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-11" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20 8.7 19l8.5-8.5-3.7-3.7L5 15.3 4 20Z" />
      <path d="M12.9 7.2 16.6 11" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </>
  ),
  externalLink: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </>
  ),
  link: (
    <>
      <path d="m10 14 4-4" />
      <path d="m7.5 14.5-2.1 2.1a3 3 0 1 0 4.2 4.2l2.1-2.1" />
      <path d="m16.5 9.5 2.1-2.1a3 3 0 1 0-4.2-4.2l-2.1 2.1" />
    </>
  ),
  note: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 8.5h6" />
      <path d="M9 12h6" />
      <path d="M9 15.5h4.5" />
    </>
  ),
  paperclip: (
    <path d="M21.44 11.05 12.25 20.24a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L9.41 17.41a1.5 1.5 0 0 1-2.12-2.12l8.49-8.48" />
  ),
  pin: <path d="M7 4.75h10a1 1 0 0 1 1 1v13.5L12 16l-6 3.25V5.75a1 1 0 0 1 1-1Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.75" />
      <path d="m16 16 4 4" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.8 12.2 11 14.4l4.4-4.8" />
    </>
  ),
  todo: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.8 12.2 11 14.4l4.4-4.8" />
    </>
  ),
  unpin: (
    <>
      <path d="M7 4.75h10a1 1 0 0 1 1 1v13.5L12 16l-6 3.25V5.75a1 1 0 0 1 1-1Z" />
      <path d="M5.5 5.5 18.5 18.5" />
    </>
  ),
  undo: (
    <>
      <path d="M9 10H4V5" />
      <path d="M4 10a8 8 0 1 1 2.3 5.7" />
    </>
  ),
}

export function Icon({ className = '', name, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={['icon', className].filter(Boolean).join(' ')}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...rest}
    >
      {iconMap[name]}
    </svg>
  )
}
