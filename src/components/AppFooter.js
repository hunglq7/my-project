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
        <span className="me-1">Version 1</span>

      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
