import React, { Component, useEffect, useState, useRef } from 'react'
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
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { DeleteFilled, EditFilled, SearchOutlined, SaveFilled, UndoOutlined, OpenAIFilled, FileAddFilled, DownloadOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Form, Input, Checkbox } from 'antd';

import { chucvuService } from '../../../service/chucvuService'
import { Alert } from '@coreui/coreui';

function Chucvu() {
    let emptyChucvu = {
        id: 0,
        tenChucVu: '',
        trangThai: true
    };

    const [visible, setVisible] = useState(false);
    const [chucvus, setChucvus] = useState([]);
    const [chucvuDialog, setChucvuDialog] = useState(false);
    const [deleteChucvuDialog, setDeleteChucvuDialog] = useState(false);
    // const [deleteChucvusDialog, setDeleteChucvuDialog] = useState(false);
    const [chucvu, setChucvu] = useState(emptyChucvu);
    // const [selectedChucvus, setSelectedChucvus] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    // const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        async function fetchData() {
            try {
                await chucvuService.getChucvu().then(response => {
                    setChucvus(response.data)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Tooltip title="Sửa" >
                        <Button type='primary' shape="circle" icon={<EditFilled />} onClick={() => editChucvu(rowData)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button color="danger" variant="solid" shape="circle" icon={<DeleteFilled />} onClick={() => confirmDeleteChucvu(rowData)} />
                    </Tooltip>
                </Flex>
            </React.Fragment>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <Flex wrap gap="small">
                <Button color="primary" label="Thêm" variant="solid" icon={<FileAddFilled />} onClick={() => openNew()} >Thêm</Button>

                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={() => confirmDeleteChucvu(rowData)} > Xóa</Button>

            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="cyan" variant="solid" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };
    const editChucvu = (chucvu) => {
        setSubmitted(true)
        setChucvu({ ...chucvu });
        setChucvuDialog(true);
    };

    const openNew = () => {
        setChucvu(emptyChucvu);
        setSubmitted(false);
        setChucvuDialog(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const saveChucvu = () => {
        setSubmitted(true);
        if (chucvu.tenChucVu.trim()) {
            let _chucvus = [...chucvus];
            let _chucvu = { ...chucvu };
            if (chucvu.id == 0) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 3000 });
            } else {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 3000 });
            }
            setChucvus(_chucvus);
            setChucvuDialog(false);
            setChucvu(emptyChucvu);

        }
    }
    const deleteChucvuDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteChucvuDialog(false)}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />}>
                Yes
            </Button>
        </Flex>

    );
    const chucvuDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button color="primary" variant="outlined" icon={<SearchOutlined />} onClick={() => setChucvuDialog(false)}>
                Cancel
            </Button>
            <Button color="primary" variant="solid" icon={<SaveFilled />} onClick={saveChucvu}>
                Save
            </Button>
        </Flex>
    );

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.trangThai ? "Đang dùng" : "Niêm cất"} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (chucvu) => {
        switch (chucvu.trangThai) {
            case true:
                return 'success';
            case false:
                return 'warning';
            default:
                return null;
        }
    };

    const hideDeleteChucvuDialog = () => {
        setDeleteChucvuDialog(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setChucvuDialog(false);
    };
    const confirmDeleteChucvu = (chucvu) => {
        setChucvu(chucvu);
        setDeleteChucvuDialog(true);
    };
    console.log(chucvu)
    return (
        <>
            <CRow>
                <Toast ref={toast} />
                <CCol xs={12}>
                    {/* <DocsComponents href="components/table/" /> */}

                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Chức vụ</small>

                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} table stripedRows rowHover value={chucvus} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" >
                                <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenChucVu" header="Tên chức vụ" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="trangThai" header="Trạng thái" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>



            <Dialog visible={chucvuDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? "Sửa chức vụ" : "Thêm chức vụ"} modal className="p-fluid" footer={chucvuDialogFooter} onHide={hideDialog}>
                <CForm className='mt-2'>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="id" className="col-sm-3 col-form-label">
                            Id
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={chucvu.id} type="text" id="id" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="tenChucVu" className="col-sm-3 col-form-label">
                            Chức vụ
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={chucvu.tenChucVu} type="text" id="tenChucVu" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <div className="col-sm-9 offset-sm-3">
                            <CFormCheck checked={chucvu.trangThai} type="checkbox" id="trangThai" label="Dự phòng" />
                        </div>
                    </CRow>

                </CForm>
            </Dialog>




            <Dialog visible={deleteChucvuDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteChucvuDialogFooter} onHide={hideDeleteChucvuDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {chucvu && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{chucvu.tenChucVu}</b>?
                        </span>
                    )}

                </div>
            </Dialog>
        </>
    )
}

export default Chucvu
