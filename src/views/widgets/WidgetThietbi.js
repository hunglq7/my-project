import { memo } from 'react';
import { CButton, CCard, CCardBody, CCardImage, CCardText, CCardTitle, CCol, CContainer, CRow } from '@coreui/react'
import bomnuoc from '../../assets/images/thietbi/Bomnuoc.jpg'
import bangtai from '../../assets/images/thietbi/Bang-tai.jpg'
import bienap from '../../assets/images/thietbi/Bienap.jpg'
import capdien from '../../assets/images/thietbi/capdien.png'
import aptomat from '../../assets/images/thietbi/Ap-to-mat.png'
import maykhoan from '../../assets/images/thietbi/Maykhoan.jpg'
import './WidgetThietbi.css'
const WidgetThietbi = () => {
    return (
        <>
            <CRow xs={{ cols: 1, gutter: 2 }} lg={{ cols: 6, gutter: 3 }}>
                <CCol>
                    <CCard className='hCard' style={{ width: '18rem' }}>
                        <CCardImage style={{ height: 200 }} orientation="top" src={bomnuoc} />
                        <CCardBody>
                            <CCardTitle>Quạt gió</CCardTitle>
                            <CCardText>
                                Cập nhật quạt gió
                            </CCardText>
                            <CButton color="primary" href="#">
                                Go somewhere
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className='hCard' style={{ width: '18rem' }}>
                        <CCardImage style={{ height: 200 }} orientation="top" src={bangtai} />
                        <CCardBody>
                            <CCardTitle>Quạt gió</CCardTitle>
                            <CCardText>
                                Cập nhật quạt gió
                            </CCardText>
                            <CButton color="primary" href="#">
                                Go somewhere
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className='hCard' style={{ width: '18rem' }}>
                        <CCardImage style={{ height: 200 }} orientation="top" src={bienap} />
                        <CCardBody>
                            <CCardTitle>Quạt gió</CCardTitle>
                            <CCardText>
                                Cập nhật quạt gió
                            </CCardText>
                            <CButton color="primary" href="#">
                                Go somewhere
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className='hCard' style={{ width: '18rem' }}>
                        <CCardImage style={{ height: 200 }} orientation="top" src={capdien} />
                        <CCardBody>
                            <CCardTitle>Quạt gió</CCardTitle>
                            <CCardText>
                                Cập nhật quạt gió
                            </CCardText>
                            <CButton color="primary" href="#">
                                Go somewhere
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className='hCard' style={{ width: '18rem' }}>
                        <CCardImage style={{ height: 200 }} orientation="top" src={aptomat} />
                        <CCardBody>
                            <CCardTitle>Quạt gió</CCardTitle>
                            <CCardText>
                                Cập nhật quạt gió
                            </CCardText>
                            <CButton color="primary" href="#">
                                Go somewhere
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className='hCard' style={{ width: '18rem' }}>
                        <CCardImage style={{ height: 200 }} orientation="top" src={maykhoan} />
                        <CCardBody>
                            <CCardTitle>Quạt gió</CCardTitle>
                            <CCardText>
                                Cập nhật quạt gió
                            </CCardText>
                            <CButton color="primary" href="#">
                                Go somewhere
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>

            </CRow>
        </>
    )
}

export default WidgetThietbi