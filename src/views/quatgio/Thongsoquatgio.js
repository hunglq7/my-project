import React from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { useSelector } from "react-redux";
const Thongsoquatgio = () => {

    const datas = useSelector(state => state.thongsoquatgios.data)
    console.log("thongsoquatgio", datas)
    return (
        <>
            <div className="card">
                <DataTable value={datas} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="noiDung" header="Nội dung"></Column>
                    <Column field="donViTinh" header="Đơn vị tính"></Column>
                    <Column field="thongSo" header="Thông số"></Column>
                </DataTable>
            </div>
        </>
    )

}
export default Thongsoquatgio