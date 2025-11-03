import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

import React, { Component, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Alert, Button, Flex, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, SearchOutlined, SaveFilled, UndoOutlined, OpenAIFilled, FileAddFilled, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
ModuleRegistry.registerModules([AllCommunityModule]);

function Nhatkyquatgio() {

    const gridRef = useRef(null);
    const CustomButtonComponent = (props) => {
        return (
            <>
                <Flex wrap gap="small">
                    <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} onClick={() => addNewRow} />
                    <Button color="danger" variant="outlined" shape="circle" icon={<DeleteFilled />} onClick={() => alert("Xóa")} />
                </Flex>
            </>
        )
    };
    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
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
            field: "make", cellEditor: "agTextCellEditor",
            cellEditorParams: {
                maxLength: 20
            },
        },
        { field: "model" },
        { field: "price" },
        { field: "electric" },
        { field: "button", cellRenderer: CustomButtonComponent },


    ]);

    const addNewRow = useCallback(() => {
        const { api } = gridRef.current || {};
        if (!api) {
            return;
        }
        api.setGridOption("pinnedTopRowData", [
            { make: null, model: null, price: 0, electric: true },
        ]);
        setTimeout(() => {
            api.startEditingCell({
                rowIndex: 0,
                rowPinned: "bottom",
                colKey: "symbol",
            });
        });
    }, []);

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
                <Button type="primary" icon={<UndoOutlined />} onClick={addNewRow}>
                    Add New
                </Button>
                <Button color="danger" variant="solid" icon={<DeleteFilled />} onClick={() => alert("Xóa")}>
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