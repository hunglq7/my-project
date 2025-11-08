import React, { useEffect, useState, useRef, useCallback } from 'react'
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
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { DeleteFilled, EditFilled, SaveFilled, UndoOutlined, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { Toast } from 'primereact/toast';
import { thongsoquatgioService as quatgioService } from '../../service/quatgio/thongsoquatgioService';
import { danhmucquatgioService as danhmucService } from '../../service/quatgio/danhmucquatgioService';
const Capnhatthongsoquatgio = () => {
    let emptyThongsoquatgio = {
        id: 0,
        quatgioId: 0,
        noiDung: "",
        donViTinh: "",
        thongSo: ""
    };
    const [thongsoquatgios, setThongsoquatgios] = useState([]);
    const [thongsoquatgio, setThongsoquatgio] = useState(emptyThongsoquatgio);
    const [danhmucquatgios, setDanhmucquatgios] = useState([]);
    const [thongsoquatgioDialog, setThongsoquatgioDialog] = useState(false);
    const [deleteThongsoquatgioDialog, setDeleteThongsoquatgioDialog] = useState(false);
    const [deleteThongsoquatgiosDialog, setDeleteThongsoquatgiosDialog] = useState(false);
    const [selectedThongsoquatgios, setSelectedThongsoquatgios] = useState(null);
    const [tenthietbi, setTenthietbi] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        fetchData();
        getDanhmucquatgios()
    }, [])

    async function fetchData() {
        try {
            await quatgioService.getThongsoquatgio().then(response => {
                setThongsoquatgios(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getDanhmucquatgios = useCallback(async () => {
        try {
            await danhmucService.getDanhmucquatgio().then(response => {
                setDanhmucquatgios(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

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
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={confirmDeleteSelected} disabled={!selectedThongsoquatgios || !selectedThongsoquatgios.length}  > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="cyan" variant="solid" icon={<DownloadOutlined />} onClick={exportCSV} >Export</Button>;
    };

    const edit = (items) => {
        const id = items.id;
        const idCanTim = items.quatGioId;
        let ketQua = null;
        for (let i = 0; i < thongsoquatgios.length; i++) {
            if (thongsoquatgios[i].quatGioId === idCanTim) {
                ketQua = thongsoquatgios[i].tenThietBi;
                break; // dừng vòng lặp khi tìm thấy
            }
        }
        if (ketQua) {
            setTenthietbi(ketQua)
        } else {
            console.log("Không tìm thấy bản ghi có id =", idCanTim);
        }
        getThongsoquatgioById(id);
        setSubmitted(true);
        setThongsoquatgioDialog(true);
        setIsSave(false);
    };

    const getThongsoquatgioById = useCallback((id) => {
        quatgioService.getThongsoquatgioById(id).then(response => {
            if (response) {
                const _items = response.data;
                setThongsoquatgio({ ..._items })
            }
            else {
                console.log("Lỗi lấy dữ liệu chi tiết quạt gió theo id")
            }
        })
    }, [])

    const onDelete = () => {
        let id = thongsoquatgio.id;
        quatgioService.deleteThongsoquatgio(id).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Xóa thành công bản ghi`, life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteThongsoquatgioDialog(false);
        setThongsoquatgio(emptyThongsoquatgio);
    };

    const deleteSelected = () => {
        let _items = selectedThongsoquatgios;
        quatgioService.deleteSelectThongsoquatgio(_items).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Xóa thành công bản ghi được chọn`, life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteThongsoquatgiosDialog(false);
        setSelectedThongsoquatgios(null);
    };

    const openNew = () => {
        setThongsoquatgioId(0)
        setThongsoquatgio(emptyThongsoquatgio);
        setSubmitted(false);
        setThongsoquatgioDialog(true);
        setIsSave(false);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _items = { ...thongsoquatgio };
        _items[`${name}`] = val;
        setThongsoquatgio(_items);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const save = () => {
        setSubmitted(true);
        if (thongsoquatgio.id.trim()) {
            let _items = { ...thongsoquatgio };
            if (thongsoquatgio.id == 0) {
                quatgioService.addThongsoquatgio(_items).then((response) => {
                    if (response) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: `Thêm bản ghi thành công`, life: 3000 });
                        setIsSave(true);
                    }
                })

            } else {
                quatgioService.updateThongsoquatgio(_items).then((response) => {
                    if (response) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: `Cập nhật bản ghi thành công`, life: 3000 });
                        setIsSave(true);
                        setThongsoquatgioDialog(false);
                    }
                })
            }
            setIsSave(false);
            setThongsoquatgio(emptyThongsoquatgio);
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
    const deleteThongsoquatgioDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button type="primary" icon={<UndoOutlined />} onClick={setDeleteThongsoquatgioDialog(false)}>
                No
            </Button>
            <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={onDelete}>
                Yes
            </Button>
        </Flex>

    );

    const deleteThongsoquatgiosDialogFooter = (
        <React.Fragment>
            <Flex wrap gap="small" justify='end'>
                <Button type="primary" icon={<UndoOutlined />} onClick={setDeleteThongsoquatgiosDialog(false)}>
                    No
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteSelected}>
                    Yes
                </Button>
            </Flex>
        </React.Fragment>
    );

    const thongsoquatgioDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button color="primary" variant="outlined" icon={<CloseOutlined />} onClick={setDeleteThongsoquatgioDialog(false)}>
                Close
            </Button>
            <Button color="primary" variant="solid" icon={<SaveFilled />} onClick={save}>
                Save
            </Button>
        </Flex>
    );

    const hideDeleteThongsoquatgioDialog = () => {
        setDeleteThongsoquatgioDialog(false);
    };
    const hideDeleteThongsoquatgiosDialog = () => {
        setDeleteThongsoquatgiosDialog(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setThongsoquatgioDialog(false);
    };
    const confirmDelete = (item) => {
        setThongsoquatgio(item);
        setDeleteThongsoquatgioDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteThongsoquatgiosDialog(true);
    };
    return (
        <>
            <Toast ref={toast} />
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Cập nhật bảng</strong> <small>Thông số quạt gió</small>
                        </CCardHeader>
                        <CCardBody>
                            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} stripedRows rowHover value={thongsoquatgios} dataKey="id" selection={selectedThongsoquatgios} onSelectionChange={(e) => setSelectedThongsoquatgios(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                                <Column field="tenThietBi" header="Tên thiết bị" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="noiDung" header="Nội dung" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="thongSo" header="Thông số" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={thongsoquatgioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? "Sửa chức vụ" : "Thêm chức vụ"} modal className="p-fluid" footer={thongsoquatgioDialogFooter} onHide={hideDialog}>
                <CForm className='mt-2'>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="id" className="col-sm-3 col-form-label">
                            Id
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={thongsoquatgio.id} type="text" id="id" />
                        </CCol>
                    </CRow>
                    <CCol md={6}>
                        <div >
                            <label className="form-label">Thiết bị:</label>
                            <select className='form-select' id="quatgioId" value={thongsoquatgio.quatgioId} onChange={(e) => onInputChange(e, 'quatgioId')} >
                                <option value="">--Chọn thiết bị--</option> {/* Optional placeholder */}
                                {danhmucquatgios.map((option) => (
                                    < option key={option.id} value={option.id} >
                                        {option.tenThietBi}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </CCol>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="noiDung" className="col-sm-3 col-form-label">
                            Nội dung
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={thongsoquatgio.noiDung} onChange={(e) => onInputChange(e, 'noiDung')} type="text" id="noiDung" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="donViTinh" className="col-sm-3 col-form-label">
                            Đơn vị tính
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={thongsoquatgio.donViTinh} onChange={(e) => onInputChange(e, 'donViTinh')} type="text" id="donViTinh" />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="thongSo" className="col-sm-3 col-form-label">
                            Thông số
                        </CFormLabel>
                        <CCol sm={9}>
                            <CFormInput value={thongsoquatgio.thongSo} onChange={(e) => onInputChange(e, 'thongSo')} type="text" id="thongSo" />
                        </CCol>
                    </CRow>
                </CForm>
            </Dialog>




            <Dialog visible={deleteThongsoquatgioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteThongsoquatgioDialogFooter} onHide={hideDeleteThongsoquatgioDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {thongsoquatgio && (
                        <span>
                            Bạn có chắc chắn muốn xóa ${tenthietbi} ?
                        </span>
                    )}

                </div>
            </Dialog>

            <Dialog visible={deleteThongsoquatgiosDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteThongsoquatgiosDialogFooter} onHide={hideDeleteThongsoquatgiosDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {thongsoquatgio && <span>Bạn có chắc chắn muốn xóa các chức vụ đã chọn không?</span>}
                </div>
            </Dialog>
        </>
    )
}

export default Capnhatthongsoquatgio