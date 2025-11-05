import React, { useState, useEffect } from "react"
import { quatgioService } from "../../service/quatgioService"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Thongsoquatgio = ({ quatgio }) => {
    const id = 1
    const [thongsoquatgio, setThongsoquatgio] = useState(null)
    useEffect(() => {
        async function fetchData() {
            try {
                await quatgioService.getThongsoquatgioById(1).then((data) => setThongsoquatgio(data.data));
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, []);
    console.log(thongsoquatgio)
    return (
        <>
            <div className="container-fluid">
                <DataTable stripedRows showGridlines value={thongsoquatgio} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Hiện {first} to {last} of {totalRecords} Thông số kỹ thuật" >
                    <Column field="noiDung" header="Nội dung" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="donViTinh" header="Đơn vị tính" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="thongSo" header="Thông số" sortable style={{ minWidth: '16rem' }}></Column>
                </DataTable>
            </div>
        </>
    )

}
export default Thongsoquatgio