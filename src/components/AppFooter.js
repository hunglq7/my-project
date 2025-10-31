import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const year = new Date().getFullYear()
  return (
    <CFooter className="px-4">
      <div>
        <strong>Copyright</strong>
        <span className="ms-1">&copy; {year} Lê Quang Hùng</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          CoreUI React Admin &amp; Dashboard Template
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
