import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
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
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { getAllDanhmuctoidien, getThongsotoidienById } from '../../reducer/toidienSlice';
import { tonghoptoidienService } from '../../service/toidien/tonghoptoidienService';
import { getAllDonvi } from '../../reducer/donviSlice';
import Thongsotoidien from './Thongsotoidien';
export default function Tonghoptoidien() {

    let emptyToidien = {
        id: 0,
        maQuanLy: '',
        thietBiId: '',
        donViSuDungId: 0,
        viTriLapDat: '',
        ngayLap: "",
        mucDichSuDung: "",
        soLuong: 1,
        tinhTrangThietBi: '',
        duPhong: false,
        ghiChu: ''
    };
    const donvis = useSelector((state) => state.donvis.data)
    const danhmuctoidiens = useSelector((state) => state.toidiens.dataDanhmuc)
    const [toidiens, setToidiens] = useState([])
    const [toidienDialog, setToidienDialog] = useState(false);
    const [deleteToidienDialog, setDeleteToidienDialog] = useState(false);
    const [deleteToidiensDialog, setDeleteToidiensDialog] = useState(false);
    const [toidien, setToidien] = useState(emptyToidien);
    const [toidienId, setToidienId] = useState(null);
    const [tenthietbi, setTenthietbi] = useState(null);
    const [selectedToidiens, setSelectedToidiens] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [themmoi, setThemmoi] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        fetchData();
    }, [isSave])

    useEffect(() => {
        dispatch(getAllDonvi())
        dispatch(getAllDanhmuctoidien())
    }, [])
    const fetchData = async () => {
        try {
            await tonghoptoidienService.getTonghoptoidien().then(response => {
                setToidiens(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _toidien = { ...toidien };
        _toidien[`${name}`] = val;
        setToidien(_toidien);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.target.value || 0;
        let _toidien = { ...toidien };
        _toidien[`${name}`] = val;
        setToidien(_toidien);
    };

    const onCheckedChange = (e, name) => {
        const val = e.target.checked;
        let _toidien = { ...toidien };
        _toidien[`${name}`] = val;
        setToidien(_toidien);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.duPhong ? "Dự phòng" : "Đang dùng"} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (toidien) => {
        switch (toidien.duPhong) {
            case true:
                return 'warning';
            case false:
                return 'success';
            default:
                return null;
        }
    };

    const ngaylapBodyTemplate = (rowData) => {
        return formatDate(rowData.ngayLap);
    };

    const formatDate = (value) => {
        const date = moment(value).format("DD/MM/YYYY");
        return date
    };

    const hideDeleteToidienDialog = () => {
        setDeleteToidienDialog(false);
        setSelectedToidiens(null)
    };
    const hideDeleteToidiensDialog = () => {
        setDeleteToidiensDialog(false);
        setSelectedToidiens(null)
    };
    const hideDialog = () => {
        setSubmitted(false);
        setToidienDialog(false);
        setSelectedToidiens(null);
    };
    const confirmDeleteToidien = (toidien) => {
        setToidien(toidien);
        setDeleteToidienDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteToidiensDialog(true);
    };

    const openNew = () => {
        setToidienId(0);
        setToidien(emptyToidien);
        setSubmitted(false);
        setToidienDialog(true);
        setThemmoi(true)
        setIsSave(false)
    };

    const editToidien = useCallback( (rowData) => {    
        dispatch(getThongsotoidienById(rowData.thietbiId))
        const id = rowData.id;
        const idCanTim = rowData.thietbiId;
        let ketQua = null;
        for (let i = 0; i < toidiens.length; i++) {
            if (toidiens[i].thietbiId === idCanTim) {
                ketQua = toidiens[i].tenThietBi;
                break; // dừng vòng lặp khi tìm thấy
            }
        }
        if (ketQua) {
            setTenthietbi(ketQua)
        } else {
            console.log("Không tìm thấy bản ghi có id =", idCanTim);
        }

        getToidienById(id);
        setToidienId(id);
        setSubmitted(true);
        setToidienDialog(true);
        setThemmoi(false)
        setIsSave(false)
    },[]);
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const getToidienById = (id) => {
        tonghoptoidienService.getTonghoptoidienById(id).then(response => {
            if (response) {
                const _toidien = response.data;
                const _ngayLap = _toidien.ngayLap;
                const date = moment(_ngayLap).format("YYYY-MM-DD");
                _toidien.ngayLap = date;
                setToidien({ ..._toidien })
            }
            else {
                console.log("Lỗi lấy dữ liệu chi tiết quạt gió theo id")
            }
        })
    }

    const onDeleteToidien = () => {
        let id = toidien.id;
        tonghoptoidienService.deleteTonghoptoidien(id).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa bản ghi thành công', life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteToidienDialog(false);
        setToidien(emptyToidien);
    };

    const deleteSelectedToidiens = () => {
        let _toidiens = selectedToidiens;
        tonghoptoidienService.deleteTonghoptoidiens(_toidiens).then(response => {
            if (response) {
                setDeleteToidiensDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa bản ghi thành công', life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setSelectedToidiens(null);
    };

    const onSave = () => {

        const _toidien = toidien;
        if (!themmoi) {
            //Update
            tonghoptoidienService.updateTonghoptoidien(_toidien).then(response => {
                if (response) {
                    setToidienDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cập nhật thành công', life: 3000 });
                    setIsSave(true)
                }
            })

        }
        else {
            //Thêm mới
            try {
                tonghoptoidienService.addTonghoptoidien(_toidien).then(response => {
                    if (response) {
                        setToidien(emptyToidien)
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
        setSelectedToidiens(null)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} onClick={() => editToidien(rowData)} />
                    <Button color="danger" variant="outlined" shape="circle" icon={<DeleteFilled />} onClick={() => confirmDeleteToidien(rowData)} />
                </Flex>
            </React.Fragment>
        );
    };


    const leftToolbarTemplate = () => {
        return (
            <Flex wrap gap="small">
                <Button color="cyan" variant="outlined" icon={<FileAddFilled />} onClick={() => openNew()} >Thêm</Button>
                <Button color="danger" variant="outlined" icon={<DeleteFilled />} onClick={confirmDeleteSelected} disabled={!selectedToidiens || !selectedToidiens.length}  > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="primary" variant="outlined" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const deleteToidienDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={hideDeleteToidienDialog}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={onDeleteToidien}>
                Yes
            </Button>
        </Flex>

    );

    const deleteToidiensDialogFooter = (
        <React.Fragment>
            <Flex wrap gap="small" justify='end'>
                <Button type="primary" icon={<UndoOutlined />} onClick={hideDeleteToidiensDialog}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelectedToidiens}>
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
                            <Toolbar className="mb-2" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} size='normal' stripedRows rowHover value={toidiens} dataKey="id" selection={selectedToidiens} onSelectionChange={(e) => setSelectedToidiens(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="maQuanLy" header="Mã quản lý" sortable style={{ minWidth: '2rem' }}></Column>
                                <Column field="tenThietBi" header="Thiết bị" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="phongBan" header="Đơn vị" sortable style={{ minWidth: '6rem' }}></Column>
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

            <Dialog visible={toidienDialog} style={{ width: '64rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? `Sửa thiết bị: ${tenthietbi}` : `Thêm thiết bị`} modal className="p-fluid" onHide={hideDialog}>

                <CRow className='px-4'>
                    <CCol>
                        <CTabs defaultActiveItemKey={1}>
                            <CTabList variant="underline-border">
                                <CTab aria-controls="Capnhat-tab-pane" itemKey={1}>Cập nhật tời điện</CTab>
                                <CTab hidden={!submitted} aria-controls="Nhatky-tab-pane" itemKey={2}>Nhật ký tơi điện</CTab>
                                <CTab hidden={!submitted} aria-controls="Thongso-tab-pane" itemKey={3}>Thông số ký thuật</CTab>

                            </CTabList>
                            <CTabContent>
                                <CTabPanel className="py-3 " aria-labelledby="Capnhat-tab-pane" itemKey={1}>
                                    <CForm className="row g-3 ">
                                        <CCol md={6}>
                                            <CFormInput disabled={true} value={toidien.id} onChange={(e) => onInputChange(e, 'id')} type="text" id="id" label="id:" />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormInput value={toidien.maQuanLy} onChange={(e) => onInputChange(e, 'maQuanLy')} type="text" id="maQuanLy" label="Mã quản lý:" className={classNames({ 'p-invalid': submitted && !toidien.maQuanLy })} />
                                            {submitted && !toidien.maQuanLy && <small className="p-error">Mã quản lý phải nhập</small>}
                                        </CCol>
                                        <CCol md={6}>
                                            <div >
                                                <label className="form-label">Đơn vị:</label>
                                                <select className='form-select' id="donViId" value={toidien.donViSuDungId} onChange={(e) => onInputChange(e, 'donViSuDungId')} label="Đơn vị">
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
                                                <select className='form-select' id="thietBiId" value={toidien.thietbiId} onChange={(e) => onInputChange(e, 'thietBiId')} >
                                                    <option value="">--Chọn thiết bị--</option> {/* Optional placeholder */}
                                                    {danhmuctoidiens.map((option) => (
                                                        < option key={option.id} value={option.id} >
                                                            {option.tenThietBi}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </CCol>


                                        <CCol md={12}>
                                            <CFormInput value={toidien.viTriLapDat} onChange={(e) => onInputChange(e, 'viTriLapDat')} type="text" id="viTriLapDat" label="Vị trí lắp đặt:" />
                                        </CCol>
                                        <CCol md={12}>
                                            <CFormInput value={toidien.tinhTrangThietBi} onChange={(e) => onInputChange(e, 'tinhTrangThietBi')} type="text" id="tinhTrangThietBi" label="Tình trạng:" />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormInput value={toidien.soLuong} onChange={(e) => onInputNumberChange(e, 'soLuong')} type="number" id="soLuong" label="Số lượng:" />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormInput value={toidien.ngayLap} onChange={(e) => onInputNumberChange(e, 'ngayLap')} type="date" id="ngayLap" label="Ngày lắp:" />
                                        </CCol>
                                        <CCol md={12}>
                                            <CFormInput value={toidien.mucDichSuDung} onChange={(e) => onInputChange(e, 'mucDichSuDung')} type="text" id="mucDichSuDung" label="Mục đích sử dụng:" />
                                        </CCol>
                                        <CCol md={12}>
                                            <CFormCheck checked={toidien.duPhong} onChange={(e) => onCheckedChange(e, 'duPhong')} type="checkbox" id="duPhong" label="Dự phòng" />
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

                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="Thongso-tab-pane" itemKey={3}>
                                    <Thongsotoidien />
                                </CTabPanel>

                            </CTabContent>
                        </CTabs>
                    </CCol>
                </CRow>
            </Dialog >

            <Dialog visible={deleteToidienDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteToidienDialogFooter} onHide={hideDeleteToidienDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {toidien && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{toidien.maQuanLy}</b>?
                        </span>
                    )}

                </div>
            </Dialog>

            <Dialog visible={deleteToidiensDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteToidiensDialogFooter} onHide={hideDeleteToidiensDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {toidien && <span>Bạn có chắc chắn muốn xóa các chức vụ đã chọn không?</span>}
                </div>
            </Dialog>

        </>
    )
}