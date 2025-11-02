import React, { Component, useEffect, useState, useRef } from 'react'
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
import { DeleteFilled, EditFilled, SearchOutlined, SaveFilled, UndoOutlined, OpenAIFilled, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import AppToasts from '../../components/AppToasts';
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import { CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
import { maycaoService } from '../../service/maycaoService';
import FormCapnhatMaycao from './FormCapnhatMaycao';
function Capnhatmaycao() {

    let emptyMaycao = {
        id: 0,
        tenChucVu: '',
        trangThai: true
    };
    const maycaoUpdateToast = AppToasts({ title: "Thông báo", body: `Cập nhật bản ghi thành công` })
    const maycaoAddToast = AppToasts({ title: "Thông báo", body: "Thêm bản ghi thành công" })
    const maycaoDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi thành công" })
    const maycaosDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi được chọn thành công" })
    const [maycaos, setMaycaos] = useState([]);
    const [maycaoDialog, setMaycaoDialog] = useState(false);
    const [deleteMaycaoDialog, setDeleteMaycaoDialog] = useState(false);
    const [deleteMaycaosDialog, setDeleteMaycaosDialog] = useState(false);
    const [maycao, setMaycao] = useState(emptyMaycao);
    const [selectedMaycaos, setSelectedMaycaos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [toast, addToast] = useState()
    const toaster = useRef(null)
    const dt = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                await maycaoService.getMaycao().then(response => {
                    setMaycaos(response.data)
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
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={confirmDeleteSelected} disabled={!selectedMaycaos || !selectedMaycaos.length}  > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="cyan" variant="solid" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };

    const onDeleteMaycao = () => {
        let id = maycao.id;
        maycaoService.deletemaycao(id).then(response => {
            if (response) {
                addToast(maycaoDeleteToast)
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteMaycaoDialog(false);
        setMaycao(emptyMaycao);
    };

    const deleteSelectedMaycaos = () => {
        let _maycaos = selectedMaycaos;
        chucvuService.deleteMaycaos(_maycaos).then(response => {
            if (response) {
                addToast(maycaossDeleteToast)
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteMaycaosDialog(false);
        setSelectedMaycaos(null);
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
    const deleteMaycaoDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteMaycaoDialog(false)}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={onDeleteMaycao}>
                Yes
            </Button>
        </Flex>

    );

    const deleteMaycaosDialogFooter = (
        <React.Fragment>
            <Flex wrap gap="small" justify='end'>
                <Button type="primary" icon={<UndoOutlined />} onClick={() => setDeleteMaycaosDialog(false)}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelectedMaycaos}>
                    Yes
                </Button>
            </Flex>
        </React.Fragment>
    );
    const openNew = () => {
        setMaycao(emptyMaycao);
        setSubmitted(false);
        setMaycaoDialog(true);
        setIsSave(false);
    };
    const editMaycao = (maycao) => {
        setSubmitted(true)
        setMaycao({ ...maycao });
        setMaycaoDialog(true);
        setIsSave(false);
    };


    const hideDeleteMaycaoDialog = () => {
        setDeleteMaycaoDialog(false);
    };
    const hideDeleteMaycaosDialog = () => {
        setDeleteMaycaosDialog(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setMaycaoDialog(false);
    };
    const confirmDeleteMaycao = (maycao) => {
        setMaycao(maycao);
        setDeleteMaycaoDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteMaycaosDialog(true);
    };

    return (
        <>

            <CToaster className="p-3 z-500" placement="top-end" push={toast} ref={toaster} />
            <CRow>

                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Chức vụ</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} stripedRows rowHover value={maycaos} dataKey="id" selection={selectedMaycaos} onSelectionChange={(e) => setSelectedMaycaos(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="maQuanLy" header="Mã quản lý" sortable style={{ minWidth: '2rem' }}></Column>
                                <Column field="tenDonvi" header="Đơn vị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="viTriLapDat" header="Vị trí lắp đặt" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="ngayLap" header="Ngày lắp" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenThietBi" header="Tên thiết bị" sortable style={{ minWidth: '16rem' }}></Column>
                                {/* <Column field="trangThai" header="Trạng thái" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> */}
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={maycaoDialog} style={{ width: '64rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? "Sửa chức vụ" : "Cập nhật may cào"} modal className="p-fluid" onHide={hideDialog}>
                <CForm className='mt-2'>
                    <CTabs defaultActiveItemKey={1}>
                        <CTabList variant="tabs" layout="fill">
                            <CTab aria-controls="home-tab-pane" itemKey={1}>Cập nhật máy cào</CTab>
                            <CTab aria-controls="profile-tab-pane" itemKey={2}>Nhật ký máy cào</CTab>
                            <CTab aria-controls="contact-tab-pane" itemKey={3}>Thông số ký thuật</CTab>

                        </CTabList>
                        <CTabContent>
                            <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                                <FormCapnhatMaycao />
                            </CTabPanel>
                            <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                                Nhật ký máy cào
                            </CTabPanel>
                            <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                                Thông số kỹ thuật
                            </CTabPanel>

                        </CTabContent>
                    </CTabs>

                </CForm>
            </Dialog>

            <Dialog visible={deleteMaycaoDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteMaycaoDialogFooter} onHide={hideDeleteMaycaoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {maycao && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{maycao.tenThietbi}</b>?
                        </span>
                    )}

                </div>
            </Dialog>

            <Dialog visible={deleteMaycaosDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteMaycaosDialogFooter} onHide={hideDeleteMaycaosDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {maycao && <span>Bạn có chắc chắn muốn xóa các chức vụ đã chọn không?</span>}
                </div>
            </Dialog>


        </>
    )

}
export default Capnhatmaycao