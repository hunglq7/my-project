import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { quatgioService } from '../../service/quatgioService';
import React, { Component, useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react'
import { Alert, Button, Flex, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, SearchOutlined, SaveFilled, UndoOutlined, OpenAIFilled, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';

ModuleRegistry.registerModules([AllCommunityModule]);

function Nhatkyquatgio({ quatgio }) {
    const gridRef = useRef(null);
    const id = quatgio.id
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
    }, [])
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
            cellEditorPopup: true,
        },
        {
            field: 'trangThai',
            headerName: 'Tình trạng',
            editable: true,
            cellEditor: 'agLargeTextCellEditor',
            cellEditorParams: { maxLength: 10000 },
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
            trangThai: true,
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
        const seletcRow = gridRef.current.api.getSelectedRows()
        console.log("Dữ liệu khi save", seletcRow)
        quatgioService.addNhatkyquatgio(seletcRow).then(response => {
            if (response) {
                alert("Lưu thành công")
            }
            else {
                alert("Lưu thất bại")
            }
        })

    }, [])

    const deleteRow = useCallback(() => {
        const seletcRow = gridRef.current.api.getSelectedRows()
        alert(JSON.stringify(seletcRow))
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
                <Button type="primary" icon={<UndoOutlined />} onClick={() => addItems()}>
                    Add New
                </Button>
                <Button color="primary" label="Thêm" variant="solid" icon={<FileAddFilled />} onClick={Save} >Save</Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={deleteRow}>
                    Delete
                </Button>
            </Flex>
            {/* <Button type="primary" icon={<UndoOutlined />} onClick={addNewRow}>
                    Add New
                </Button> */}


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