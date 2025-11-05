import React, { Component, useEffect, useState, useRef } from 'react'
import {
    CCard, CCardBody, CCardHeader, CCol, CRow,
    CButton, CForm, CFormCheck, CFormInput, CFormSelect
} from '@coreui/react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
// import { InputNumber } from 'primereact/inputnumber';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { DeleteFilled, EditFilled, SearchOutlined, SaveFilled, UndoOutlined, OpenAIFilled, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { InputNumber } from 'antd';
import AppToasts from '../../components/AppToasts';
import { CToaster } from '@coreui/react'
import { CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
import { quatgioService } from '../../service/quatgioService';
import Nhatkyquatgio from './Nhatkyquatgio';
import Thongsoquatgio from './Thongsoquatgio';
import { data } from 'react-router-dom';


function Capnhatquatgio() {

    let emptyQuatgio = {
        id: 0,
        tenThietBi: '',
        soLuong: 1,
        trangThai: true
    };
    const quatgioUpdateToast = AppToasts({ title: "Thông báo", body: `Cập nhật bản ghi thành công` })
    const quatgioAddToast = AppToasts({ title: "Thông báo", body: "Thêm bản ghi thành công" })
    const qutgioDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi thành công" })
    const quatgiosDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi được chọn thành công" })
    const [quatgios, setQuatgios] = useState([]);
    const [quatgioDialog, setQuatgioDialog] = useState(false);
    const [deleteQuatgioDialog, setDeleteQuatgioDialog] = useState(false);
    const [deleteQuatgiosDialog, setDeleteQuatgiosDialog] = useState(false);
    const [quatgio, setQuatgio] = useState(emptyQuatgio);
    const [selectedQuatgios, setSelectedQuatgios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [toast, addToast] = useState()
    const toaster = useRef(null)
    const dt = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                await quatgioService.getQuatgio().then(response => {
                    setQuatgios(response.data)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [isSave])


    const leftToolbarTemplate = () => {
        return (
            <Flex wrap gap="small">
                <Button color="primary" label="Thêm" variant="solid" icon={<FileAddFilled />} onClick={() => openNew()} >Thêm</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={confirmDeleteSelected} disabled={!selectedQuatgios || !selectedQuatgios.length}  > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="cyan" variant="solid" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} onClick={() => editQuatgio(rowData)} />
                    <Button color="danger" variant="outlined" shape="circle" icon={<DeleteFilled />} onClick={() => confirmDeleteQuatgio(rowData)} />
                </Flex>
            </React.Fragment>
        );
    };
    const onDeleteQuatgio = () => {
        let id = quatgio.id;
        quatgioService.deleteQuatgio(id).then(response => {
            if (response) {
                addToast(quatgioDeleteToast)
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteQuatgioDialog(false);
        setQuatgio(emptyQuatgio);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _quatgio = { ...quatgio };
        _quatgio[`${name}`] = val;
        setQuatgio(_quatgio);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.target.value || 0;
        console.log(e)
        let _quatgio = { ...quatgio };

        _quatgio[`${name}`] = val;

        setQuatgio(_quatgio);
    };


    const deleteSelectedQuatgios = () => {
        let _quatgios = selectedQuatgios;
        quatgioService.deleteQuatgios(_quatgios).then(response => {
            if (response) {
                addToast(quatgiosDeleteToast)
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteQuatgiosDialog(false);
        setSelectedQuatgios(null);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const deleteQuatgioDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteQuatgioDialog(false)}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={onDeleteQuatgio}>
                Yes
            </Button>
        </Flex>

    );

    const deleteQuatgiosDialogFooter = (
        <React.Fragment>
            <Flex wrap gap="small" justify='end'>
                <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteQuatgiosDialog(false)}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelectedQuatgios}>
                    Yes
                </Button>
            </Flex>
        </React.Fragment>
    );
    const openNew = () => {
        setQuatgio(emptyQuatgio);
        setSubmitted(false);
        setQuatgioDialog(true);
        setIsSave(false);
    };
    const editQuatgio = (quatgio) => {
        let _quatgio = quatgio;
        let myDate = new Date(_quatgio.ngayLap)
        let myDateString =
            myDate.getFullYear() +
            '-' +
            ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + myDate.getDate()).slice(-2);
        _quatgio.ngayLap = myDateString;
        setSubmitted(true)
        setQuatgio({ ..._quatgio });
        setQuatgioDialog(true);
        setIsSave(false);
    };

    const onDuphongChange = (e, name) => {
        let _quatgio = { ...quatgio };
        _quatgio[`${name}`] = e.target.checked;
        setQuatgio(_quatgio);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.duPhong ? "Dự phòng" : "Đang dùng"} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (quatgio) => {
        switch (quatgio.duPhong) {
            case true:
                return 'warning';
            case false:
                return 'success';
            default:
                return null;
        }
    };

    const hideDeleteQuatgioDialog = () => {
        setDeleteQuatgioDialog(false);
    };
    const hideDeleteQuatgiosDialog = () => {
        setDeleteQuatgiosDialog(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setQuatgioDialog(false);
    };
    const confirmDeleteQuatgio = (quatgio) => {
        setQuatgio(quatgio);
        setDeleteQuatgioDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteQuatgiosDialog(true);
    };

    console.log(quatgio)
    return (
        <>

            <CToaster className="p-3 z-500" placement="top-end" push={toast} ref={toaster} />
            <CRow>

                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>quạt gió</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} stripedRows rowHover value={quatgios} dataKey="id" selection={selectedQuatgios} onSelectionChange={(e) => setSelectedQuatgios(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="maQuanLy" header="Mã quản lý" sortable style={{ minWidth: '2rem' }}></Column>
                                <Column field="tenThietBi" header="Thiết bị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenDonVi" header="Đơn vị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="viTriLapDat" header="Vị trí lắp đặt" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="ngayLap" header="Ngày lắp" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="soLuong" header="SL đang dùng" sortable style={{ minWidth: '8rem' }}></Column>
                                <Column field="duPhong" header="Tình trạng TB" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={quatgioDialog} style={{ width: '64rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? `Sửa thiết bị: ${quatgio.tenThietBi}` : `Thêm thiết bị`} modal className="p-fluid" onHide={hideDialog}>
                <div className='mt-2'>
                    <CTabs defaultActiveItemKey={1}>
                        <CTabList variant="underline-border">
                            <CTab aria-controls="Capnhat-tab-pane" itemKey={1}>Cập nhật quạt gió</CTab>
                            <CTab hidden={!submitted} aria-controls="Nhatky-tab-pane" itemKey={2}>Nhật ký quạt gió</CTab>
                            <CTab hidden={!submitted} aria-controls="Thongso-tab-pane" itemKey={3}>Thông số ký thuật</CTab>

                        </CTabList>
                        <CTabContent>
                            <CTabPanel className="py-3 " aria-labelledby="Capnhat-tab-pane" itemKey={1}>
                                <CForm className="row g-3">
                                    <CCol md={6}>
                                        <CFormInput value={quatgio.maQuanLy} onChange={(e) => onInputChange(e, 'maQuanLy')} type="text" id="maQuanLy" label="Mã quản lý:" />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput value={quatgio.tenThietBi} onChange={(e) => onInputChange(e, 'tenThietBi')} type="text" id="tenThietBi" label="Thiết bị:" />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput value={quatgio.tenDonVi} onChange={(e) => onInputChange(e, 'tenDonVi')} type="text" id="tenDonVi" label="Đơn vị:" />
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormInput value={quatgio.viTriLapDat} onChange={(e) => onInputChange(e, 'viTriLapDat')} type="text" id="viTriLapDat" label="Vị trí lắp đặt:" />
                                    </CCol>
                                    <CCol md={12}>
                                        <CFormInput value={quatgio.tinhTrangThietBi} onChange={(e) => onInputChange(e, 'tinhTrangThietBi')} type="text" id="tinhTrangThietBi" label="Tình trạng:" />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput value={quatgio.soLuong} onChange={(e) => onInputNumberChange(e, 'soLuong')} type="number" id="soLuong" label="Số lượng:" />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput value={quatgio.ngayLap} onChange={(e) => onInputNumberChange(e, 'ngayLap')} type="date" id="ngayLap" label="Ngày lắp:" />
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormSelect id="donVi" label="Đơn vị">
                                            <option>Choose...</option>
                                            <option>...</option>
                                        </CFormSelect>
                                    </CCol>

                                    <CCol xs={12}>
                                        <CFormCheck checked={quatgio.duPhong} onChange={(e) => onDuphongChange(e, 'duPhong')} type="checkbox" id="duPhong" label="Dự phòng" />
                                    </CCol>
                                    <CCol xs={12}>
                                        <CButton color="primary" type="submit">
                                            Lưu
                                        </CButton>
                                    </CCol>
                                </CForm>
                            </CTabPanel>
                            <CTabPanel className="py-3 " aria-labelledby="Nhatky-tab-pane" itemKey={2}>

                                <Nhatkyquatgio quatgio={quatgio} />

                            </CTabPanel>
                            <CTabPanel className="py-3" aria-labelledby="Thongso-tab-pane" itemKey={3}>
                                <Thongsoquatgio quatgio={quatgio} />
                            </CTabPanel>

                        </CTabContent>
                    </CTabs>

                </div>
            </Dialog>

            <Dialog visible={deleteQuatgioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteQuatgioDialogFooter} onHide={hideDeleteQuatgioDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {quatgio && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{quatgio.tenThietbi}</b>?
                        </span>
                    )}

                </div>
            </Dialog>

            <Dialog visible={deleteQuatgiosDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteQuatgiosDialogFooter} onHide={hideDeleteQuatgiosDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {quatgio && <span>Bạn có chắc chắn muốn xóa các chức vụ đã chọn không?</span>}
                </div>
            </Dialog>


        </>
    )

}
export default Capnhatquatgio