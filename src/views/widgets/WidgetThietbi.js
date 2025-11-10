import React from 'react';
import { CCard, CCardBody, CCardImage, CCardTitle, CCol, CBadge, CCardFooter } from '@coreui/react'
import { Button, Flex } from 'antd';
import { Link } from 'react-router-dom';
import './WidgetThietbi.css'
const WidgetThietbi = ({ image, title, desc, sl, url }) => {

    return (
        <>

            <CCol>
                <CCard className='hCard' style={{ width: '18rem' }}>
                    <CCardImage style={{ height: 200 }} orientation="top" src={image} />
                    <CCardBody>


                        <div className='d-flex justify-content-between'>
                            <CCardTitle>{title}</CCardTitle>
                            <Link to={url}>
                                <Button color="primary" variant="solid"  >
                                    Cập nhật
                                </Button>
                            </Link>
                        </div>

                    </CCardBody>
                    <CCardFooter>
                        <div className='d-flex justify-content-between align-content-center'>
                            <p>{desc}</p>
                            <strong >
                                <CBadge color="danger">{sl}</CBadge>
                            </strong>
                        </div>
                    </CCardFooter>
                </CCard>
            </CCol>


        </>
    )
}

export default React.memo(WidgetThietbi) 