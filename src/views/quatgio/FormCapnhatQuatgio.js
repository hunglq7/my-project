import React from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
} from '@coreui/react'
function FormCapnhatQuatgio() {
    return (
        <>
            <CForm className='mt-6  '></CForm>
            <CRow className="mb-3">
                <CFormLabel htmlFor="id" className="col-sm-3 col-form-label">
                    Id
                </CFormLabel>
                <CCol sm={9}>
                    <CFormInput type="text" id="id" />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="tenChucVu" className="col-sm-3 col-form-label">
                    Chức vụ
                </CFormLabel>
                <CCol sm={9}>
                    <CFormInput type="text" id="tenChucVu" />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <div className="col-sm-9 offset-sm-3">
                    <CFormCheck type="checkbox" id="trangThai" label="Dự phòng" />
                </div>
            </CRow>
            <CForm />

        </>
    )
}
export default FormCapnhatQuatgio