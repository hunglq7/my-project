import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { quatgioService } from '../../service/quatgioService';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Button, Flex } from 'antd';
import { DeleteFilled, FileAddFilled, SaveFilled } from '@ant-design/icons'
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
ModuleRegistry.registerModules([AllCommunityModule]);

const Capnhatdanhmucquatgio = () => {
    const toast = useRef(null);
    const gridRef = useRef(null);
    const [isSave, setIsSave] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([
        {
            field: 'id',
            headerName: 'Id',
            hide: true,
        },
        {
            field: 'tenThietBi',
            headerName: 'Thiết bị',
            editable: true,
            cellEditorPopup: true,
        },
        {
            field: 'loaithietbi',
            headerName: 'Loại thiết bị',
            editable: true,
            cellEditorPopup: true,
        },


    ]);
    useEffect(() => {
        fetchData();
    }, [isSave])

    const fetchData = async () => {
        try {
            await quatgioService.getDanhmucquatgio().then(response => {
                setRowData(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    function createNewRowData() {
        const newData = {
            id: 0,
            tenThietBi: "",
            loaithietbi: ""
        };

        return newData;
    }

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            editable: true,
        };
    }, []);

    const addItems = useCallback(() => {
        const newItems = [
            createNewRowData(),
        ];
        const res = gridRef.current.api.applyTransaction({
            add: newItems,
            addIndex: 0,
        });
        console.log("res", res)
    }, []);

    const Save = useCallback(() => {
        let seletcRow = gridRef.current.api.getSelectedRows()
        quatgioService.updateDanhmucquatgios(seletcRow).then(response => {
            if (response) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `Lưu thành công ${response.data} bản ghi`, life: 3000 });
                setIsSave(true)
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lưu bản ghi thất bại', life: 3000 });
            }
        })
        setIsSave(false)
    }, [])

    const deleteRows = useCallback(() => {
        const seletcRow = gridRef.current.api.getSelectedRows()
        quatgioService.deleteDanhmucquatgios(seletcRow).then(response => {
            if (response) {
                gridRef.current.api.applyTransaction({
                    remove: seletcRow,
                });

                toast.current.show({ severity: 'success', summary: 'Success', detail: `Xóa thành công ${response.data} bản ghi`, life: 3000 });
                setIsSave(true)
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Xóa bản ghi thất bại', life: 3000 });
            }

        })

        setIsSave(false)
    }, [])

    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow',
        };
    }, []);
    const pagination = true;
    const paginationPageSize = 5000;
    const paginationPageSizeSelector = [10, 20, 50];
    return (
        <>
            <Toast ref={toast} />
            <Flex wrap gap="small" justify='start' className='mb-2'>
                <Button type="primary" icon={<FileAddFilled />} onClick={() => addItems()}>
                    Thêm
                </Button>
                <Button color="primary" label="Thêm" variant="solid" icon={<SaveFilled />} onClick={Save} >Lưu</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteRows}>
                    Xóa
                </Button>
            </Flex>

            <div style={{ height: 800 }}>
                <AgGridReact className='ag-theme-quartz'
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    animateRows={true}
                />
            </div>
        </>
    )

}
export default Capnhatdanhmucquatgio