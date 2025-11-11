import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Table, Button, Flex } from 'antd';
import { DeleteFilled, EditFilled, SaveFilled, UndoOutlined, FileAddFilled, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { danhmuctoidienService } from "../../service/toidien/danhmuctoidienService";
export default function Thongsotoidien() {
    const [rowData, setRowData] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const dt = useRef(null);
    useEffect(() => {
        fetchData();
    }, [isSave])

    const fetchData = async () => {
        try {
            await danhmuctoidienService.getDanhmuctoidien().then(response => {
                console.log(response.data)
                setRowData(response.data)
            })

        } catch (error) {
            console.log(error)
        }
    }
    const handClick = () => {
        console.log(dt.current)
    }

    const handleAdd = () => {
        const newData = {
            id: 0,
            tenThietBi: "",
            namSanXuat: '',
            hangSanXuat: '',
            ghiChu: '',
        };
        setRowData([...rowData, newData]);
    };


    const columns = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
        // { title: 'Loại thiết bị', dataIndex: 'loaiThietBi', key: 'loaiThietBi' },
        { title: 'Năm sản xuất', dataIndex: 'namSanXuat', key: 'namSanXuat' },
        { title: 'Hãng sản xuất', dataIndex: 'hangSanXuat', key: 'hangSanXuat' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: () => <Flex wrap gap="small">
                <Button color="primary" label="Thêm" variant="outlined" shape="circle" icon={<EditOutlined />} onClick={handleAdd}></Button>
                <Button color="danger" label="Thêm" variant="outlined" shape="circle" icon={<DeleteFilled />} onClick={() => alert("Delete")}></Button>
            </Flex>,
        },
    ];


    return (
        <>
            <Table dataSource={rowData}
                ref={dt}
                size="small"
                expandable={{
                    expandedRowRender: (record) => <>
                        <p style={{ margin: 0 }} className='mb-2'> Loại thiết bị: {record.loaiThietBi}</p>
                        <p style={{ margin: 0 }}> Ghi chú: {record.ghiChu}</p>
                    </>,
                    rowExpandable: (record) => record.tenThietBi !== 'Not Expandable',
                }}
                columns={columns}>

            </Table>
        </>
    )
}
