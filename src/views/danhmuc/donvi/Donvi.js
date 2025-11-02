import React, { useEffect, useState, useRef } from 'react'
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
} from '@coreui/react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { DeleteFilled, EditFilled, SaveFilled, UndoOutlined, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { donviService } from '../../../service/donviService'
import AppToasts from '../../../components/AppToasts';
import { CToaster } from '@coreui/react'

function Donvi() {
    let emptyDonvi = {
        id: 0,
        tenPhong: '',
        trangThai: true
    };

    const donviUpdateToast = AppToasts({ title: "Thông báo", body: `Cập nhật bản ghi thành công` })
    const donviAddToast = AppToasts({ title: "Thông báo", body: "Thêm bản ghi thành công" })
    const donviDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi thành công" })
    const donvisDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi được chọn thành công" })
    const [donvis, setDonvis] = useState([]);
    const [donviDialog, setDonviDialog] = useState(false);
    const [deleteDonviDialog, setDeleteDonviDialog] = useState(false);
    const [deleteDonvisDialog, setDeleteDonvisDialog] = useState(false);
    const [donvi, setDonvi] = useState(emptyDonvi);
    const [selectedDonvis, setSelectedDonvis] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [toast, addToast] = useState()
    const toaster = useRef(null)
    const dt = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                await donviService.getDonvi().then(response => {
                    setDonvis(response.data)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [isSave])
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} onClick={() => editDonvi(rowData)} />
                    <Button color="danger" variant="outlined" shape="circle" icon={<DeleteFilled />} onClick={() => confirmDeleteDonvi(rowData)} />
                </Flex>
            </React.Fragment>
        );
    };
    const leftToolbarTemplate = () => {
        return (
            <Flex wrap gap="small">
                <Button color="primary" label="Thêm" variant="solid" icon={<FileAddFilled />} onClick={() => openNew()} >Thêm</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={confirmDeleteSelected} disabled={!selectedDonvis || !selectedDonvis.length}  > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="cyan" variant="solid" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };
    const editDonvi = (donvi) => {
        setSubmitted(true)
        setDonvi({ ...donvi });
        setDonviDialog(true);
        setIsSave(false);
    };

    const onDeleteDonvi = () => {
        let id = donvi.id;
        donviService.deleteDonvi(id).then(response => {
            if (response) {
                addToast(donviDeleteToast)
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteDonviDialog(false);
        setDonvi(emptyDonvi);
        addToast(donviDeleteToast)
    };

    const deleteSelectedDonvis = () => {
        let _donvis = selectedDonvis;
        donviService.deleteDonvis(_donvis).then(response => {
            if (response) {
                addToast(donvisDeleteToast)
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteDonvisDialog(false);
        setSelectedDonvis(null);
    };

    const openNew = () => {
        setDonvi(emptyDonvi);
        setSubmitted(false);
        setDonviDialog(true);
        setIsSave(false);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _donvi = { ...donvi };
        _donvi[`${name}`] = val;
        setDonvi(_donvi);
    };

    const onTrangthaiChange = (e) => {
        let _donvi = { ...donvi };
        _donvi['trangThai'] = e.target.checked;
        setDonvi(_donvi);
    };


    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const saveDonvi = () => {
        setSubmitted(true);
        if (donvi.tenPhong.trim()) {
            let _donvi = { ...donvi };
            if (donvi.id == 0) {
                donviService.addDonvi(_donvi).then((response) => {
                    if (response) {
                        addToast(donviAddToast)
                        setIsSave(true);
                    }
                })

            } else {
                donviService.updateDonvi(_donvi).then((response) => {
                    if (response) {
                        addToast(donviUpdateToast)
                        setIsSave(true);
                        setDonviDialog(false);
                    }
                })
            }
            setIsSave(false);
            setDonvi(emptyDonvi);

        }
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const deleteDonviDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteDonviDialog(false)}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={onDeleteDonvi}>
                Yes
            </Button>
        </Flex>

    );

    const deleteDonvisDialogFooter = (
        <React.Fragment>
            <Flex wrap gap="small" justify='end'>
                <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteDonvisDialog(false)}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelectedDonvis}>
                    Yes
                </Button>
            </Flex>
        </React.Fragment>
    );

    const donviDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button color="primary" variant="outlined" icon={<CloseOutlined />} onClick={() => setDonviDialog(false)}>
                Close
            </Button>
            <Button color="primary" variant="solid" icon={<SaveFilled />} onClick={saveDonvi}>
                Save
            </Button>
        </Flex>
    );

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.trangThai ? "Đang dùng" : "Niêm cất"} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (donvi) => {
        switch (donvi.trangThai) {
            case true:
                return 'success';
            case false:
                return 'warning';
            default:
                return null;
        }
    };

    const hideDeleteDonviDialog = () => {
        setDeleteDonviDialog(false);
    };
    const hideDeleteDonvisDialog = () => {
        setDeleteDonvisDialog(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setDonviDialog(false);
    };
    const confirmDeleteDonvi = (donvi) => {
        setDonvi(donvi);
        setDeleteDonviDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteDonvisDialog(true);
    };

    return (
        <>
            <CRow>

                <CToaster className="p-3 z-500" placement="top-end" push={toast} ref={toaster} />
                <CCol xs={12}>

                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Đơn vị</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} stripedRows rowHover value={donvis} dataKey="id" selection={selectedDonvis} onSelectionChange={(e) => setSelectedDonvis(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenPhong" header="Tên đơn vị" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="trangThai" header="Trạng thái" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={donviDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? "Sửa đơn vị" : "Thêm đơn vị"} modal className="p-fluid" footer={donviDialogFooter} onHide={hideDialog}>
                <CForm className='mt-2'>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="id" className="col-sm-3 col-form-label">
                            Id
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={donvi.id} type="text" id="id" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="tenPhong" className="col-sm-3 col-form-label">
                            Đơn vị
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={donvi.tenPhong} onChange={(e) => onInputChange(e, 'tenPhong')} type="text" id="tenPhong" />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <div className="col-sm-9 offset-sm-3">
                            <CFormCheck checked={donvi.trangThai} onChange={onTrangthaiChange} type="checkbox" id="trangThai" label="Dự phòng" />
                        </div>
                    </CRow>

                </CForm>
            </Dialog>




            <Dialog visible={deleteDonviDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteDonviDialogFooter} onHide={hideDeleteDonviDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {donvi && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{donvi.tenPhong}</b>?
                        </span>
                    )}

                </div>
            </Dialog>

            <Dialog visible={deleteDonvisDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteDonvisDialogFooter} onHide={hideDeleteDonvisDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {donvi && <span>Bạn có chắc chắn muốn xóa các chức vụ đã chọn không?</span>}
                </div>
            </Dialog>
        </>
    )
}

export default Donvi
