import React, { Component, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DocsComponents } from 'src/components'

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';

import { chucvuService } from '../../../service/chucvuService'
import { Alert } from '@coreui/coreui';

function Chucvu() {
    const customVars = {
        '--cui-btn-padding-y': '.35rem',
        '--cui-btn-padding-x': '.25rem',
        '--cui-btn-font-size': '.75rem',
    }

    const initChucvu = {
        id: 0,
        tenChucVu: "Test 1",
        trangThai: true
    }

    const [visible, setVisible] = useState(false)
    // const data = useSelector((state) => state.chucvus.data)
    const [chucvus, setChucvu] = useState([])
    // const [chucvu,setChucvu]=useState({id:0,tenChucVu:"Test 1",trangThai:true})
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            try {
                await chucvuService.getChucvu().then(response => {
                    setChucvu(response.data)
                })
                // const response = await chucvuService.getChucvu()
                // dispatch(readAllChucvu())
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [dispatch])

    const actionBodyTemplate = () => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Tooltip title="Sửa" >
                        <Button type='primary' shape="circle" icon={<EditFilled />} onClick={() => alert("Sửa bản ghi")} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button color="danger" variant="solid" shape="circle" icon={<DeleteFilled />} onClick={() => alert("Xóa bản ghi")} />
                    </Tooltip>
                </Flex>

                {/* <Button icon="pi pi-pencil" rounded outlined className="mr-2 " onClick={() => editDonvitinh(rowData)}/>
                <Button  icon="pi pi-trash" rounded outlined severity="danger" onClick={confirmDeleteDonvitinh(rowData)} /> */}
            </React.Fragment>
        );
    };


    return (
        <>
            <CRow>
                <CCol xs={12}>
                    {/* <DocsComponents href="components/table/" /> */}

                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Chức vụ</small>

                        </CCardHeader>
                        <CCardBody>
                            <DataTable table stripedRows rowHover value={chucvus} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" >
                                <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenChucVu" header="Tên chức vụ" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="trangThai" header="Trạng thái" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>





            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Danh mục chức vụ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3">
                        <CCol md={6}>
                            <CFormLabel htmlFor="inputEmail4">Email</CFormLabel>
                            <CFormInput type="email" id="inputEmail4" />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel htmlFor="inputPassword4">Password</CFormLabel>
                            <CFormInput type="password" id="inputPassword4" />
                        </CCol>
                        <CCol xs={12}>
                            <CFormLabel htmlFor="inputAddress">Address</CFormLabel>
                            <CFormInput id="inputAddress" placeholder="1234 Main St" />
                        </CCol>
                        <CCol xs={12}>
                            <CFormLabel htmlFor="inputAddress2">Address 2</CFormLabel>
                            <CFormInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel htmlFor="inputCity">City</CFormLabel>
                            <CFormInput id="inputCity" />
                        </CCol>
                        <CCol md={4}>
                            <CFormLabel htmlFor="inputState">State</CFormLabel>
                            <CFormSelect id="inputState">
                                <option>Choose...</option>
                                <option>...</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={2}>
                            <CFormLabel htmlFor="inputZip">Zip</CFormLabel>
                            <CFormInput id="inputZip" />
                        </CCol>
                        <CCol xs={12}>
                            <CFormCheck type="checkbox" id="gridCheck" label="Check me out" />
                        </CCol>
                        <CCol xs={12}>
                            <CButton color="primary" type="submit">
                                Sign in
                            </CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary">Save changes</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default Chucvu
