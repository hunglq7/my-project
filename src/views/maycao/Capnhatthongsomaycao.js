import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import React from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody } from "@coreui/react"
import { Toolbar } from "primereact/toolbar"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputText } from "primereact/inputtext"
import { InputIcon } from "primereact/inputicon"
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Button, Checkbox, Form, Input, Flex, Select, Row, Col } from 'antd';
import { useEffect, useRef, useState } from "react"
import { thongsomaycaoService } from "../../service/maycao/thongsomaycaoService"
import { danhmucmaycaoService } from "../../service/maycao/danhmucmaycaoService"
import { FileAddFilled, DeleteFilled, DownOutlined, CloseOutlined, SaveFilled, EditFilled } from '@ant-design/icons'
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
const Capnhatthongsomaycao = () => {
    let emptyThongsomaycao = {
        id: 0,
        mayCaoId: 0,
        noiDung: "",
        donViTinh: "",
        thongSo: ""
    };

    const [selectedCity, setSelectedCity] = useState(null);
    const [thongsomaycaos, setThongsomaycaos] = useState([]);
    const [thongsomaycao, setThongsomaycao] = useState(emptyThongsomaycao);
    const [thongsomaycaoId, setThongsomaycaoId] = useState(null);
    const [danhmucmaycaos, setDanhmucmaycaos] = useState([]);
    const [selectedThongsomaycaos, setSelectedThongsomaycaos] = useState(null);
    const [thongsomaycaoDialog, setThongsomaycaoDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [themmoi, setThemmoi] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        fetchData();
    }, [isSave])

    useEffect(() => {
        danhmucmaycaoService.getDanhmucmaycaos().then(response => {
            setDanhmucmaycaos(response.data)
        })
    }, [])

    async function fetchData() {
        try {
            await thongsomaycaoService.getThongsomaycao().then((response) => {
                setThongsomaycaos(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }



    const openNew = () => {
        setThemmoi(true);
        setThongsomaycaoId(0);
        setThongsomaycao(emptyThongsomaycao);
        setSubmitted(false);
        setThongsomaycaoDialog(true);
        setIsSave(false);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _items = { ...thongsomaycao };
        _items[`${name}`] = val;
        setThongsomaycao(_items);
    };

    const onSelectChange = (e, name) => {
        let _items = { ...thongsomaycao };
        _items[name] = e.value.id;
        setThongsomaycao(_items);
    };


    const save = () => {
        setSubmitted(true);
        if (themmoi) {
            thongsomaycaoService.addThongsomaycao(thongsomaycao).then((response) => {
                if (response) {
                    setIsSave(true);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: `Thêm bản ghi thành công`, life: 3000 });
                }
            })
        }
        setThongsomaycao(emptyThongsomaycao);

    }

    const onDelete = () => {
        let id = thongsomaycao;
        thongsomaycaoService.deleteThongsomaycao(id).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Xóa thành công bản ghi`, life: 3000 });
                setIsSave(true);
            }
        })
        setIsSave(false);
        setDeleteThongsomaycaoDialog(false);
        setThongsomaycao(emptyThongsoquatgio);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setThongsomaycaoDialog(false);
        setSelectedThongsomaycaos(null)
    };

    const leftToolbarTemplate = () => {
        return (
            <Flex wrap gap="small">
                <Button color="primary" label="Thêm" variant="solid" icon={<FileAddFilled />} onClick={() => openNew()} >Thêm</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} > Xóa</Button>
            </Flex>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button color="danger" variant="outlined" icon={<DownOutlined />} >Export</Button>
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );

    const actionBodyTemplate = () => {
        return (
            <React.Fragment>
                <Flex wrap gap="small">
                    <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} />
                    <Button color="danger" variant="outlined" shape="circle" icon={<DeleteFilled />} />
                </Flex>
            </React.Fragment>
        )
    }

    const thongsomaycaoDialogFooter = (
        <Flex wrap gap="small" justify='end'>
            <Button color="primary" variant="outlined" icon={<CloseOutlined />} onClick={hideDialog}>
                Close
            </Button>
            <Button color="primary" htmlType='submit' variant="solid" icon={<SaveFilled />} onClick={save} >
                Save
            </Button>
        </Flex>
    );
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
                            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                            <DataTable ref={dt} stripedRows rowHover value={thongsomaycaos} dataKey="id" selection={selectedThongsomaycaos} onSelectionChange={(e) => setSelectedThongsomaycaos(e.value)} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} bản ghi" globalFilter={globalFilter} header={header} >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column field="tenThietBi" header="Tên thiết bị" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="noiDung" header="Nội dung" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field="thongSo" header="Thông số" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column field='hanhDong' header="Hành động" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                            </DataTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <Dialog visible={thongsomaycaoDialog} style={{ width: '36rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={submitted ? `Sửa bản ghi` : "Thêm thông số"} modal className="p-fluid" footer={thongsomaycaoDialogFooter} onHide={hideDialog}>
                {/* <Form
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Thiết bị"
                        name="mayCaoId"
                        rules={[{ required: true, message: 'Thiết bị phải nhập' }]}
                    >
                        <Dropdown style={{ height: '36px' }} value={thongsomaycao.mayCaoId || null} onChange={(e) => {
                            onSelectChange(e, 'mayCaoId')

                        }} options={danhmucmaycaos} optionLabel="tenThietBi"
                            placeholder="Chọn thiết bị" className="w-full md:w-14rem" />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="noiDung"
                        rules={[{ required: true, message: 'Nội dung phải nhập!' }]}
                    >
                        <InputText style={{ height: '36px' }} value={thongsomaycao.noiDung ?? ''}
                            onChange={(e) => {

                                onInputChange(e, "noiDung");
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Đơn vị tính"
                        name="donViTinh"
                        rules={[{ required: true, message: 'Đơn vị tính phải nhập!' }]}
                    >
                        <InputText style={{ height: '36px' }} value={thongsomaycao.donViTinh ?? ''}
                            onChange={(e) => {

                                onInputChange(e, "donViTinh");
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Thông số"
                        name="thongSo"
                        rules={[{ required: true, message: 'Thông số phải nhập!' }]}
                    >
                        <InputText style={{ height: '36px' }} value={thongsomaycao.thongSo ?? ''}
                            onChange={(e) => {
                                onInputChange(e, "thongSo");
                            }}
                        />
                    </Form.Item>



                </Form> */}
                <Row className='flex align-items-center justify-content-center mb-3'>
                    <Col span={6}>
                        <label htmlFor="mayCaoId" className="font-bold ">
                            Thiết bị
                        </label>
                    </Col>
                    <Col span={16}>
                        <Dropdown style={{ height: 36 }} value={thongsomaycao.mayCaoId || null} onChange={(e) => {
                            onSelectChange(e, 'mayCaoId')

                        }} options={danhmucmaycaos} optionLabel="tenThietBi"
                            placeholder="Chọn thiết bị" className="w-full md:w-14rem" />
                    </Col>
                </Row>
                <Row className='flex align-items-center justify-content-center mb-3'>
                    <Col span={6}>
                        <label htmlFor="noiDung" className="font-bold ">
                            Nội dung
                        </label>
                    </Col>
                    <Col span={16}>
                        <InputText style={{ height: 36 }} id="noiDung" value={thongsomaycao.noiDung ?? ''} onChange={(e) => onInputChange(e, 'noiDung')} required autoFocus className={classNames({ 'p-invalid': submitted && !thongsomaycao.noiDung })} />
                        {submitted && !thongsomaycao.noiDung && <small className="p-error">Nội dung phải nhập.</small>}
                    </Col>
                </Row>
                <Row className='flex align-items-center justify-content-center mb-3'>
                    <Col span={6}>
                        <label htmlFor="donViTinh" className="font-bold">
                            Đơn vị tính
                        </label>
                    </Col>
                    <Col span={16}>
                        <InputText style={{ height: 36 }} id="donViTinh" value={thongsomaycao.donViTinh ?? ''} onChange={(e) => onInputChange(e, 'donViTinh')} required autoFocus className={classNames({ 'p-invalid': submitted && !thongsomaycao.donViTinh })} />
                        {submitted && !thongsomaycao.donViTinh && <small className="p-error">Đơn vị tính phải nhập.</small>}
                    </Col>
                </Row>
                <Row className='flex align-items-center justify-content-center mb-3'>
                    <Col span={6}>
                        <label htmlFor="thongSo" className="font-bold">
                            Thông số
                        </label>
                    </Col>
                    <Col span={16}>
                        <InputText style={{ height: 36 }} id="thongSo" value={thongsomaycao.thongSo ?? ''} onChange={(e) => onInputChange(e, 'thongSo')} required autoFocus className={classNames({ 'p-invalid': submitted && !thongsomaycao.thongSo })} />
                        {submitted && !thongsomaycao.thongSo && <small className="p-error">Đơn vị tính phải nhập.</small>}
                    </Col>
                </Row>

            </Dialog>

        </>
    )
}

export default Capnhatthongsomaycao