import React, { Component, useEffect, useState, useRef } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
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
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import { CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react'
import { quatgioService } from '../../service/quatgioService';
import Nhatkyquatgio from './Nhatkyquatgio';


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
        const val = e.value || 0;
        console.log(val)
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
        setSubmitted(true)
        setQuatgio({ ...quatgio });
        setQuatgioDialog(true);
        setIsSave(false);
    };

    const onDuphongChange = (e) => {
        let _quatgio = { ...quatgio };
        _quatgio['duPhong'] = e.target.checked;
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

    const soluongBodyTemplate = (quatgio) => {
        return (
            <InputNumber inputId="integeronly" value={quatgio.soLuong} onValueChange={(e) => setChucvu(e.value)} />
        )
    }

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
                            <strong>Cập nhật bảng</strong> <small>Chức vụ</small>
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
                                <Column field="tinhTrangThietBi" header="Tình trạng thiết bị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="soLuong" header="SL đang dùng" sortable style={{ minWidth: '8rem' }}></Column>
                                <Column field="duPhong" header="Tình trạng TB" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={quatgioDialog} style={{ width: '64rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? "Sửa quạt gió" : "Cập nhật quạt gió"} modal className="p-fluid" onHide={hideDialog}>
                <div className='mt-2'>
                    <CTabs defaultActiveItemKey={1}>
                        <CTabList variant="tabs" layout="fill">
                            <CTab aria-controls="home-tab-pane" itemKey={1}>Cập nhật quạt gió</CTab>
                            <CTab aria-controls="profile-tab-pane" itemKey={2}>Nhật ký quạt gió</CTab>
                            <CTab aria-controls="contact-tab-pane" itemKey={3}>Thông số ký thuật</CTab>

                        </CTabList>
                        <CTabContent>
                            <CTabPanel className="py-3 " aria-labelledby="home-tab-pane" itemKey={1}>
                                <Form
                                    name="basic"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    style={{ maxWidth: 600 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"

                                >
                                    <Form.Item
                                        label="Thiết bị"
                                        name="tenThietBi"
                                        rules={[{ required: true, message: 'Tên thiết bị phải nhập!' }]}
                                    >
                                        <Input value={quatgio.tenThietbi} onChange={(e) => onInputChange(e, 'tenThietBi')} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item name="soLuong" label="Số lượng" rules={[{ type: 'number', min: 0, max: 99 }]}>
                                        <InputNumber min={1} max={10} value={quatgio.soLuong} onChange={(e) => onInputNumberChange(e, 'soLuong')} />
                                    </Form.Item>

                                    <Form.Item name="remember" valuePropName="checked" label={null}>
                                        <Checkbox>Dự phòng</Checkbox>
                                    </Form.Item>

                                    <Form.Item label={null}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </CTabPanel>
                            <CTabPanel className="py-3 " aria-labelledby="profile-tab-pane" itemKey={2}>
                                <Nhatkyquatgio />
                            </CTabPanel>
                            <CTabPanel className="py-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                                Thông số kỹ thuật
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