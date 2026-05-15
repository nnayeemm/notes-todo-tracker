import type { ReactNode, SVGProps } from 'react'

type IconName =
  | 'add'
  | 'arrowBack'
  | 'checkCircle'
  | 'close'
  | 'delete'
  | 'edit'
  | 'error'
  | 'link'
  | 'note'
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
