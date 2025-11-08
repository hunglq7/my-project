import { memo } from 'react';
import { CButton, CCard, CCardBody, CCardImage, CCardTitle, CCol, CBadge } from '@coreui/react'

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './WidgetThietbi.css'
const WidgetThietbi = ({ image, title, desc, sl, url }) => {

    return (
        <>

            <CCol>
                <CCard className='hCard' style={{ width: '18rem' }}>
                    <CCardImage style={{ height: 200 }} orientation="top" src={image} />
                    <CCardBody>
                        <CCardTitle>{title}</CCardTitle>
                        <div className='d-flex justify-content-between'>
                            <p>{desc}</p>
                            <strong >
                                <CBadge color="danger">{sl}</CBadge>
                            </strong>
                        </div>

                        <Link to={url}>
                            <CButton color="primary" >
                                Cập nhật
                            </CButton>
                        </Link>

                    </CCardBody>
                </CCard>
            </CCol>


        </>
    )
}

export default WidgetThietbi