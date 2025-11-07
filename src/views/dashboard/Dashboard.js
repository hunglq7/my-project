import React from 'react'
import { CRow, CContainer } from '@coreui/react'
import { myData } from '../widgets/data'
import WidgetThietbi from '../widgets/WidgetThietbi'

const Dashboard = () => {

  return (
    <>
      <CContainer fluid>
        <CRow xs={{ cols: 1, gutter: 2 }} lg={{ cols: 6, gutter: 4 }}>
          {myData.map((item) => (
            <WidgetThietbi key={item.title} {...item} />
          ))}
        </CRow>
      </CContainer>

    </>
  )
}

export default Dashboard
