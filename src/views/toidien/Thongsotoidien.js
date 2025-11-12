
import React from "react";
import { useSelector } from "react-redux"
import { Space, Table, Tag } from 'antd';

const Thongsotoidien = () => {
    console.log("Render Thongsotoidien")
    const data = useSelector((state) => state.toidiens.dataThongso)
    const columns = [
        {
            title: 'Nội dung',
            dataIndex: 'noiDung',
            key: 'noiDung',
        },
        {
            title: 'Đơn vị',
            dataIndex: 'donViTinh',
            key: 'donViTinh',
        },
        {
            title: 'Thông số',
            dataIndex: 'thongSo',
            key: 'thongSo',
        },
    ]
    return (
        <Table bordered columns={columns} dataSource={data} rowKey="id" />
    )

}
export default React.memo(Thongsotoidien)