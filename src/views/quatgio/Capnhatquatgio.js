import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {
    CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormCheck, CFormInput
} from '@coreui/react'
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
// import { InputNumber } from 'primereact/inputnumber';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { classNames } from 'primereact/utils';

import { DeleteFilled, EditFilled, SaveFilled, UndoOutlined, FileAddFilled, DownloadOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { CTab, CTabContent, CTabList, CTabPanel, CTabs, CPopover } from '@coreui/react'
import { donviService } from '../../service/donviService';
import Nhatkyquatgio from './Nhatkyquatgio';
import Thongsoquatgio from './Thongsoquatgio';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { tonghopquatgioService as quatgioService } from '../../service/quatgio/tonghopquatgioService';
import { danhmucquatgioService } from '../../service/quatgio/danhmucquatgioService';
import { getThongsoquatgioById } from '../../reducer/thongsoquatgioSlice';
import { Toast } from 'primereact/toast';
function Capnhatquatgio() {
    const currentDate = new Date();
    const newDate = (date) => {
        const newDate = moment(date).format("yyyy-mm-dd");
        return newDate
    }
    const myDate = newDate(currentDate);
    let emptyQuatgio = {
        id: 0,
        maQuanLy: '',
        quatGioId: '',
        donViId: 0,
        viTriLapDat: '',
        ngayLap: { myDate },
        soLuong: 1,
        tinhTrangThietBi: '',
        duPhong: false,
        ghiChu: ''
    };

    const [quatgios, setQuatgios] = useState([])
    const [donvis, setDonvis] = useState([]);
    const [danhmucquatgios, setDanhmucquatgios] = useState([]);
    const [quatgioDialog, setQuatgioDialog] = useState(false);
    const [deleteQuatgioDialog, setDeleteQuatgioDialog] = useState(false);
    const [deleteQuatgiosDialog, setDeleteQuatgiosDialog] = useState(false);
    const [quatgio, setQuatgio] = useState(emptyQuatgio);
    const [quatgioId, setQuatgioId] = useState(null);
    const [tenthietbi, setTenthietbi] = useState(null);
    const [selectedQuatgios, setSelectedQuatgios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [themmoi, setThemmoi] = useState(false);

    const dt = useRef(null);
    const dispatch = useDispatch();
    const toast = useRef(null);
    useEffect(() => {
        fetchData();
        getDonvis();
        getDanhmucquatgios()
    }, [isSave])
    const fetchData = async () => {
        try {
            quatgioService.getQuatgio().then(response => {
                setQuatgios(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getDonvis = async () => {
        try {
            await donviService.getDonvi().then(response => {
                setDonvis(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getDanhmucquatgios = async () => {
        try {
            await danhmucquatgioService.getDanhmucquatgio().then(response => {
                setDanhmucquatgios(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const openNew = () => {
        setQuatgioId(0);
        setQuatgio(emptyQuatgio);
        setSubmitted(false);
        setQuatgioDialog(true);
        setThemmoi(true)
        setIsSave(false)
    };

    const editQuatgio = (rowData) => {
        dispatch(getThongsoquatgioById(rowData.quatGioId))
        const id = rowData.id;
        const idCanTim = rowData.quatGioId;
        let ketQua = null;
        for (let i = 0; i < quatgios.length; i++) {
            if (quatgios[i].quatGioId === idCanTim) {
                ketQua = quatgios[i].tenThietBi;
                break; // dừng vòng lặp khi tìm thấy
            }
        }
        if (ketQua) {
            setTenthietbi(ketQua)
        } else {
            console.log("Không tìm thấy bản ghi có id =", idCanTim);
        }

        getQuatgioById(id);
        setQuatgioId(id);
        setSubmitted(true);
        setQuatgioDialog(true);
        setThemmoi(false)
        setIsSave(false)
    };

    const getQuatgioById = (id) => {
        quatgioService.getQuatgioById(id).then(response => {
            if (response) {
                const _quatgio = response.data;
                const _ngayLap = _quatgio.ngayLap;
                const date = moment(_ngayLap).format("YYYY-MM-DD");
                _quatgio.ngayLap = date;
                setQuatgio({ ..._quatgio })
            }
            else {
                console.log("Lỗi lấy dữ liệu chi tiết quạt gió theo id")
            }
        })
    }

    const onDeleteQuatgio = () => {
        let id = quatgio.id;
        quatgioService.deleteQuatgio(id).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa bản ghi thành công', life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteQuatgioDialog(false);
        setQuatgio(emptyQuatgio);
    };

    const onSave = () => {

        const _quatgio = quatgio;
        if (!themmoi) {
            //Update
            quatgioService.updateTonghopquatgio(_quatgio).then(response => {
                if (response) {
                    setQuatgioDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cập nhật thành công', life: 3000 });
                    setIsSave(true)
                }
            })

        }
        else {
            //Thêm mới
            try {
                quatgioService.addTonghopquatgio(_quatgio).then(response => {
                    if (response) {
                        setQuatgio(emptyQuatgio)
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm mới thành công', life: 3000 });
                        setIsSave(true)
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Thêm mới thất bại', life: 3000 });
                    }
                })
            }
            catch (error) {
                console.log("Tổng hợp quạt gió- Thêm mới", error)
            }

        }
        setIsSave(false)
        setSelectedQuatgios(null)
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _quatgio = { ...quatgio };
        _quatgio[`${name}`] = val;
        setQuatgio(_quatgio);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.target.value || 0;
        let _quatgio = { ...quatgio };
        _quatgio[`${name}`] = val;
        setQuatgio(_quatgio);
    };
    const ngaylapBodyTemplate = (rowData) => {
        return formatDate(rowData.ngayLap);
    };

    const formatDate = (value) => {
        const date = moment(value).format("DD/MM/YYYY");
        return date
    };

    const deleteSelectedQuatgios = () => {
        let _quatgios = selectedQuatgios;
        quatgioService.deleteQuatgios(_quatgios).then(response => {
            if (response) {
                setDeleteQuatgiosDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa bản ghi thành công', life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setSelectedQuatgios(null);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const onCheckedChange = (e, name) => {
        const val = e.target.checked;
        let _quatgio = { ...quatgio };
        _quatgio[`${name}`] = val;
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
        setSelectedQuatgios(null)
    };
    const hideDeleteQuatgiosDialog = () => {
        setDeleteQuatgiosDialog(false);
        setSelectedQuatgios(null)
    };
    const hideDialog = () => {
        setSubmitted(false);
        setQuatgioDialog(false);
        setSelectedQuatgios(null);
    };
    const confirmDeleteQuatgio = (quatgio) => {
        setQuatgio(quatgio);
        setDeleteQuatgioDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteQuatgiosDialog(true);
    };

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
            <Button type="primary" icon={<UndoOutlined />} onClick={hideDeleteQuatgioDialog}>
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
                <Button type="primary" icon={<UndoOutlined />} onClick={hideDeleteQuatgiosDialog}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelectedQuatgios}>
                    Yes
                </Button>
            </Flex>
        </React.Fragment>
    );


    return (
        <>
            <Toast ref={toast} />

            <CRow>

                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>quạt gió</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} size='normal' stripedRows rowHover value={quatgios} dataKey="id" selection={selectedQuatgios} onSelectionChange={(e) => setSelectedQuatgios(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="maQuanLy" header="Mã quản lý" sortable style={{ minWidth: '2rem' }}></Column>
                                <Column field="tenThietBi" header="Thiết bị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenDonVi" header="Đơn vị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="viTriLapDat" header="Vị trí lắp đặt" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="ngayLap" header="Ngày lắp" body={ngaylapBodyTemplate} sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="soLuong" header="SL đang dùng" sortable style={{ minWidth: '8rem' }}></Column>
                                <Column field="duPhong" header="Tình trạng TB" body={statusBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={quatgioDialog} style={{ width: '64rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? `Sửa thiết bị: ${tenthietbi}` : `Thêm thiết bị`} modal className="p-fluid" onHide={hideDialog}>

                <CRow className='px-4'>
                    <CCol>
                        <CTabs defaultActiveItemKey={1}>
                            <CTabList variant="underline-border">
                                <CTab aria-controls="Capnhat-tab-pane" itemKey={1}>Cập nhật quạt gió</CTab>
                                <CTab hidden={!submitted} aria-controls="Nhatky-tab-pane" itemKey={2}>Nhật ký quạt gió</CTab>
                                <CTab hidden={!submitted} aria-controls="Thongso-tab-pane" itemKey={3}>Thông số ký thuật</CTab>

                            </CTabList>
                            <CTabContent>
                                <CTabPanel className="py-3 " aria-labelledby="Capnhat-tab-pane" itemKey={1}>
                                    <CForm className="row g-3 ">
                                        <CCol md={6}>
                                            <CFormInput disabled={true} value={quatgio.id} onChange={(e) => onInputChange(e, 'id')} type="text" id="maQuanLy" label="id:" />
                                        </CCol>
                                        <CCol md={6}>

                                            <CFormInput value={quatgio.maQuanLy} onChange={(e) => onInputChange(e, 'maQuanLy')} type="text" id="maQuanLy" label="Mã quản lý:" className={classNames({ 'p-invalid': submitted && !quatgio.maQuanLy })} />
                                            {submitted && !quatgio.maQuanLy && <small className="p-error">Mã quản lý phải nhập</small>}
                                        </CCol>
                                        <CCol md={6}>
                                            <div >
                                                <label className="form-label">Đơn vị:</label>
                                                <select className='form-select' id="donViId" value={quatgio.donViId} onChange={(e) => onInputChange(e, 'donViId')} label="Đơn vị">
                                                    <option value="">--Chọn đơn vị--</option> {/* Optional placeholder */}
                                                    {donvis.map((option) => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.tenPhong}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </CCol>
                                        <CCol md={6}>
                                            <div >
                                                <label className="form-label">Thiết bị:</label>
                                                <select className='form-select' id="quatGioId" value={quatgio.quatGioId} onChange={(e) => onInputChange(e, 'quatGioId')} >
                                                    <option value="">--Chọn thiết bị--</option> {/* Optional placeholder */}
                                                    {danhmucquatgios.map((option) => (
                                                        < option key={option.id} value={option.id} >
                                                            {option.tenThietBi}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

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
                                        <CCol md={12}>
                                            <CFormCheck checked={quatgio.duPhong} onChange={(e) => onCheckedChange(e, 'duPhong')} type="checkbox" id="duPhong" label="Dự phòng" />
                                        </CCol>
                                        <CCol xs={12}>

                                            <Flex wrap gap="small" justify='start' className='mt-3'>
                                                <Button type="primary" icon={<SaveFilled />} onClick={onSave}>
                                                    Lưu
                                                </Button>
                                                <Button color="danger" variant="outlined" icon={<UndoOutlined />} onClick={hideDialog}>
                                                    Không
                                                </Button>
                                            </Flex>
                                        </CCol>
                                    </CForm>
                                </CTabPanel>
                                <CTabPanel className="py-3 " aria-labelledby="Nhatky-tab-pane" itemKey={2}>
                                    <Nhatkyquatgio quatgio={quatgioId} />
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="Thongso-tab-pane" itemKey={3}>
                                    <Thongsoquatgio />
                                </CTabPanel>

                            </CTabContent>
                        </CTabs>



                    </CCol>
                </CRow>



            </Dialog >

            <Dialog visible={deleteQuatgioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteQuatgioDialogFooter} onHide={hideDeleteQuatgioDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {quatgio && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{quatgio.maQuanLy}</b>?
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