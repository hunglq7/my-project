import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { quatgioService } from '../../service/quatgioService';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Button, Flex } from 'antd';
import { DeleteFilled, FileAddFilled, SaveFilled } from '@ant-design/icons'
import { CToaster } from '@coreui/react'
import AppToasts from '../../components/AppToasts';
ModuleRegistry.registerModules([AllCommunityModule]);

const Capnhatdanhmucquatgio = () => {

    const gridRef = useRef(null);
    const quatgioAddToast = AppToasts({ title: "Thông báo", body: "Thêm bản ghi thành công" })
    const quatgioAddErorToast = AppToasts({ title: "Thông báo", body: "Thêm bản ghi thất bại" })
    const quatgioDeleteErorToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi thất bại" })
    const qutgioDeleteToast = AppToasts({ title: "Thông báo", body: "Xóa bản ghi thành công" })
    const [toast, addToast] = useState()
    const toaster = useRef(null)
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

    const fetchData = useCallback(async () => {
        try {
            await quatgioService.getDanhmucquatgio().then(response => {
                setRowData(response.data)
                console.log("data:", response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

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
                addToast(quatgioAddToast)
                setIsSave(true)
            }
            else {
                addToast(quatgioAddErorToast)
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
                addToast(qutgioDeleteToast)
                setIsSave(true)
            }
            else {
                addToast(quatgioDeleteErorToast)
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
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [5, 10, 20];
    return (
        <>
            <CToaster className="p-3 z-500" placement="top-end" push={toast} ref={toaster} />
            <Flex wrap gap="small" justify='start' className='mb-2'>
                <Button type="primary" icon={<FileAddFilled />} onClick={() => addItems()}>
                    Thêm
                </Button>
                <Button color="primary" label="Thêm" variant="solid" icon={<SaveFilled />} onClick={Save} >Lưu</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteRows}>
                    Xóa
                </Button>
            </Flex>

            <div style={{ height: 600 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                />
            </div>
        </>
    )

}
export default Capnhatdanhmucquatgio