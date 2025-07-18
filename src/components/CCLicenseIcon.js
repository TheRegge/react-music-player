import React from 'react'

const CCLicenseIcon = ({ 
  size = 16, 
  color = '#999', 
  className = '',
  onClick,
  title = 'Creative Commons License'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={`cc-license-icon ${className}`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        verticalAlign: 'middle',
        marginLeft: '8px'
      }}
      title={title}
    >
      {/* Creative Commons CC symbol */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M9.5 8.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.48 0 .92-.14 1.31-.37l-.69-1.31c-.16.08-.33.18-.62.18-.55 0-1-.45-1-1s.45-1 1-1c.29 0 .46.1.62.18l.69-1.31c-.39-.23-.83-.37-1.31-.37z"/>
      <path d="M16.5 8.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.48 0 .92-.14 1.31-.37l-.69-1.31c-.16.08-.33.18-.62.18-.55 0-1-.45-1-1s.45-1 1-1c.29 0 .46.1.62.18l.69-1.31c-.39-.23-.83-.37-1.31-.37z"/>
    </svg>
  )
}

export default CCLicenseIcon