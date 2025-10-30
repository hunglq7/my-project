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
import { DeleteFilled, EditFilled, SearchOutlined, SaveFilled, UndoOutlined, OpenAIFilled, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import { chucvuService } from '../../../service/chucvuService'
import AppToasts from '../../../components/AppToasts';
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'

function Chucvu() {
    let emptyChucvu = {
        id: 0,
        tenChucVu: '',
        trangThai: true
    };

    const chucvuUpdateToast = AppToasts({ title: "Thông báo", body: "Cập nhật bản ghi thành công" })
    const chucvuAddToast = AppToasts({ title: "Thông báo", body: "Thêm bản ghi thành công" })
    const chucvuDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi thành công" })
    const [visible, setVisible] = useState(false);
    const [chucvus, setChucvus] = useState([]);
    const [chucvuDialog, setChucvuDialog] = useState(false);
    const [deleteChucvuDialog, setDeleteChucvuDialog] = useState(false);
    // const [deleteChucvusDialog, setDeleteChucvuDialog] = useState(false);
    const [chucvu, setChucvu] = useState(emptyChucvu);
    const [selectedChucvus, setSelectedChucvus] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    // const [globalFilter, setGlobalFilter] = useState(null);
    const [toast, addToast] = useState()
    const toaster = useRef(null)
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
    }, [chucvu])



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

    const deleteChucvu = () => {
        let id = chucvu.id;
        chucvuService.deleteChucvu(id).then(response => {
            if (response) {
                addToast(chucvuDeleteToast)
            }
        })
        setDeleteChucvuDialog(false);
        setChucvu(emptyChucvu);
        addToast(chucvuDeleteToast)
    };



    const openNew = () => {
        setChucvu(emptyChucvu);
        setSubmitted(false);
        setChucvuDialog(true);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _chucvu = { ...chucvu };

        _chucvu[`${name}`] = val;

        setChucvu(_chucvu);
    };

    const onTrangthaiChange = (e) => {
        let _chucvu = { ...chucvu };
        _chucvu['trangThai'] = e.target.checked;
        setChucvu(_chucvu);
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
                chucvuService.addChucvu(_chucvu).then((response) => {
                    if (response) {
                        addToast(chucvuAddToast)
                    }
                })
            } else {
                chucvuService.updateChucvu(_chucvu).then((response) => {
                    if (response) {
                        addToast(chucvuUpdateToast)
                    }
                })

            }
            setChucvuDialog(false);
            setChucvu(emptyChucvu);

        }
    }
    const deleteChucvuDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteChucvuDialog(false)}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteChucvu}>
                Yes
            </Button>
        </Flex>

    );
    const chucvuDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button color="primary" variant="outlined" icon={<CloseOutlined />} onClick={() => setChucvuDialog(false)}>
                Close
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
    return (
        <>
            <CRow>

                <CToaster className="p-3 z-500" placement="top-end" push={toast} ref={toaster} />
                <CCol xs={12}>
                    {/* <DocsComponents href="components/table/" /> */}

                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Chức vụ</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} table stripedRows rowHover value={chucvus} dataKey="id" onSelectionChange={(e) => setSelectedChucvus(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi"  >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenChucVu" header="Tên chức vụ" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="trangThai" header="Trạng thái" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
//Dialog thêm mới, sửa bản ghi
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
                            <CFormInput value={chucvu.tenChucVu} onChange={(e) => onInputChange(e, 'tenChucVu')} type="text" id="tenChucVu" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <div className="col-sm-9 offset-sm-3">
                            <CFormCheck checked={chucvu.trangThai} onChange={onTrangthaiChange} type="checkbox" id="trangThai" label="Dự phòng" />
                        </div>
                    </CRow>

                </CForm>
            </Dialog>



//Dialog xóa 1 bản ghi
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
