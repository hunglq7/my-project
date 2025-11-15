import React, { useEffect, useState, useRef, useCallback } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {
    CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormInput, CFormLabel,
} from '@coreui/react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { DeleteFilled, EditFilled, SaveFilled, UndoOutlined, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { Toast } from 'primereact/toast';
import { thongsotoidienService } from '../../service/toidien/thongsotoidienService';
import { danhmuctoidienService } from '../../service/toidien/danhmuctoidienService';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDanhmuctoidien } from '../../reducer/toidienSlice';
export default function Capnhatthongsotoidien() {

    const emptyThongsotoidien = {
        id: 0,
        danhmuctoitrucId: 0,
        noiDung: "",
        donViTinh: "",
        thongSo: ""
    };

    const [thongsotoidiens, setThongsotoidiens] = useState([]);
    const [thongsotoidien, setThongsotoidien] = useState(emptyThongsotoidien);
    const [danhmuctoidiens, setDanhmuctoidiens] = useState([]);
    const [thongsotoidienId, setThongsotoidienId] = useState(null);
    const [thongsotoidienDialog, setThongsotoidienDialog] = useState(false);
    const [deleteThongsotoidienDialog, setDeleteThongsotoidienDialog] = useState(false);
    const [deleteThongsotoidiensDialog, setDeleteThongsotoidiensDialog] = useState(false);
    const [selectedThongsotoidiens, setSelectedThongsotoidiens] = useState(null);
    const [tenthietbi, setTenthietbi] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const dispatch = useDispatch();
    const danhmuctoidien = useSelector((state) => state.toidiens.dataDanhmuc)

    useEffect(() => {
        dispatch(getAllDanhmuctoidien())
    }, [])

    useEffect(() => {
        fetchData()
    }, [isSave])

    async function fetchData() {
        try {
            await thongsotoidienService.getThongsotoidien().then(response => {
                setThongsotoidiens(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }


    const edit = (items) => {
        const id = items.id;
        const idCanTim = items.danhmuctoidienId;
        let ketQua = null;
        for (let i = 0; i < thongsotoidiens.length; i++) {
            if (thongsotoidiens[i].quatGioId === idCanTim) {
                ketQua = thongsotoidiens[i].tenThietBi;
                break; // dừng vòng lặp khi tìm thấy
            }
        }
        if (ketQua) {
            setTenthietbi(ketQua)
        } else {
            console.log("Không tìm thấy bản ghi có id =", idCanTim);
        }
        getThongsotoidienById(id);
        setSubmitted(true);
        setThongsotoidienDialog(true);
        setIsSave(false);
    };

    const getThongsotoidienById = (id) => {
        thongsotoidienService.getThongsotoidienDetailById(id).then(response => {
            if (response) {
                const _items = response.data;
                setThongsotoidien({ ..._items })
            }
            else {
                console.log("Lỗi lấy dữ liệu chi tiết quạt gió theo id")
            }
        })
    }

    const onDelete = () => {
        let id = thongsotoidien.id;
        thongsotoidienService.deleteThongsotoidien(id).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Xóa thành công bản ghi`, life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteThongsotoidienDialog(false);
        setThongsotoidien(emptyThongsotoidien);
    };

    const deleteSelected = () => {
        let _items = selectedThongsotoidiens;
        thongsotoidienService.deleteSelectThongsotoidien(_items).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Xóa thành công bản ghi được chọn`, life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteThongsotoidiensDialog(false);
        setSelectedThongsotoidiens(null);
    };

    const openNew = () => {
        setThongsotoidienId(0)
        setThongsotoidien(emptyThongsotoidien);
        setSubmitted(false);
        setThongsotoidienDialog(true);
        setIsSave(false);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _items = { ...thongsotoidien };
        _items[`${name}`] = val;
        setThongsotoidien(_items);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const save = () => {
        setSubmitted(true);
        if (thongsotoidien.noiDung.trim()) {
            let _items = { ...thongsotoidien };
            if (thongsotoidien.id == 0) {
                thongsotoidienService.addThongsotoidien(_items).then((response) => {
                    if (response) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: `Thêm bản ghi thành công`, life: 3000 });
                        setIsSave(true);
                    }
                })

            } else {
                thongsotoidienService.updateThongsotoidien(_items).then((response) => {
                    if (response) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: `Cập nhật bản ghi thành công`, life: 3000 });
                        setIsSave(true);
                        setThongsotoidienDialog(false);
                    }
                })
            }
            setIsSave(false);
            setThongsotoidien(emptyThongsotoidien);
            setSelectedThongsotoidiens(false)
        }
    }
    const hideDeleteThongsotoidienDialog = () => {
        setDeleteThongsotoidienDialog(false);
        setSelectedThongsotoidiens(null)
    };
    const hideDeleteThongsotoidiensDialog = () => {
        setDeleteThongsotoidiensDialog(false);
        setSelectedThongsotoidiens(null)
    };
    const hideDialog = () => {
        setSubmitted(false);
        setThongsotoidienDialog(false);
        setSelectedThongsotoidiens(null)
    };
    const confirmDelete = (item) => {
        setThongsotoidien(item);
        setDeleteThongsotoidienDialog(true);
        setSelectedThongsotoidiens(null)
    };

    const confirmDeleteSelected = () => {
        setDeleteThongsotoidiensDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} onClick={() => edit(rowData)} />
                    <Button color="danger" variant="outlined" shape="circle" icon={<DeleteFilled />} onClick={() => confirmDelete(rowData)} />
                </Flex>
            </React.Fragment>
        );
    };
    const leftToolbarTemplate = () => {
        return (
            <Flex wrap gap="small">
                <Button color="primary" label="Thêm" variant="solid" icon={<FileAddFilled />} onClick={() => openNew()} >Thêm</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={confirmDeleteSelected} disabled={!selectedThongsotoidiens || !selectedThongsoquatgios.length}  > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="cyan" variant="solid" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const deleteThongsotoidienDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={hideDeleteThongsotoidienDialog}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={onDelete}>
                Yes
            </Button>
        </Flex>

    );

    const deleteThongsotoidiensDialogFooter = (
        <React.Fragment>
            <Flex wrap gap="small" justify='end'>
                <Button type="primary" icon={<UndoOutlined />} onClick={hideDeleteThongsotoidiensDialog}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelected}>
                    Yes
                </Button>
            </Flex>
        </React.Fragment>
    );

    const thongsotoidienDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button color="primary" variant="outlined" icon={<CloseOutlined />} onClick={hideDialog}>
                Close
            </Button>
            <Button color="primary" variant="solid" icon={<SaveFilled />} onClick={save}>
                Save
            </Button>
        </Flex>
    );

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Thông số quạt gió</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} stripedRows rowHover value={thongsotoidiens} dataKey="id" selection={selectedThongsotoidiens} onSelectionChange={(e) => setSelectedThongsotoidiens(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="tenToiTruc" header="Tên thiết bị" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="noiDung" header="Nội dung" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="thongSo" header="Thông số" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}