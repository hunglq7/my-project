import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { nhatkyquatgioService as quatgioService } from '../../service/quatgio/nhatkyquatgioService';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Button, Flex } from 'antd';
import { DeleteFilled, FileAddFilled, SaveFilled } from '@ant-design/icons'
ModuleRegistry.registerModules([AllCommunityModule]);
function Nhatkyquatgio({ quatgio }) {
    const gridRef = useRef(null);
    const id = quatgio
    const [isSave, setIsSave] = useState(false);
    useEffect(() => {
        async function fetchData() {
            try {
                await quatgioService.getNhatkyById(id).then(response => {
                    setRowData(response.data)
                    console.log("data:", response.data)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [isSave])
    const [rowData, setRowData] = useState([
    ]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            editable: true,
        };
    }, []);


    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        {
            field: 'id',
            headerName: 'Id',
            hide: true,
        },
        {
            field: 'tonghopquatgioId',
            hide: true,
        },
        {
            field: 'ngaythang',
            headerName: 'Ngày sử dụng',
            editable: true,
            cellEditorPopup: true,
        },
        {
            field: 'donVi',
            headerName: 'Đơn vị',
            editable: true,
            cellEditorPopup: true,
        },

        {
            field: 'viTri',
            headerName: 'Vị trí',
            editable: true,
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
            cellEditorParams: {
                maxLength: 20
            }
        },
        {
            field: 'trangThai',
            headerName: 'Tình trạng',
            editable: true,
            cellEditorPopup: true,
        },
        { field: 'ghiChu', headerName: 'Ghi chú' },


    ]);


    function createNewRowData() {
        const newData = {
            id: 0,
            tonghopquatgioId: id,
            ngaythang: "",
            donVi: "",
            viTri: "",
            trangThai: "",
            ghiChu: ""
        };

        return newData;
    }


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
        quatgioService.addNhatkyquatgios(seletcRow).then(response => {
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
        quatgioService.deleteNhatkyQuatgios(seletcRow).then(response => {
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
            <Flex wrap gap="small" justify='start' className='mb-2'>
                <Button type="primary" icon={<FileAddFilled />} onClick={() => addItems()}>
                    Thêm
                </Button>
                <Button color="primary" label="Thêm" variant="solid" icon={<SaveFilled />} onClick={Save} >Lưu</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteRows}>
                    Xóa
                </Button>
            </Flex>

            <div style={{ height: 500 }}>
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
export default Nhatkyquatgio