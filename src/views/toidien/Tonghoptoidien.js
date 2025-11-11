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
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { getThongsotoidienById } from '../../reducer/toidienSlice';
import { tonghoptoidienService } from '../../service/toidien/tonghoptoidienService';
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

    const [toidiens, setToidiens] = useState([])
    const [donvis, setDonvis] = useState([]);
    const [danhmuctoidiens, setDanhmuctoidiens] = useState([]);
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

    useEffect(() => {
        fetchData();
    }, [isSave])
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

    const editToidien = (rowData) => {
        dispatch(getThongsotoidienById(rowData.thietBiId))
        const id = rowData.id;
        const idCanTim = rowData.thietBiId;
        let ketQua = null;
        for (let i = 0; i < toidiens.length; i++) {
            if (toidiens[i].thietBiId === idCanTim) {
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
    };
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
                            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} size='normal' stripedRows rowHover value={toidiens} dataKey="id" selection={selectedToidiens} onSelectionChange={(e) => setSelectedToidiens(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
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

        </>
    )
}