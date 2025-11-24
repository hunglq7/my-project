import React,{useEffect,useState} from "react"
import { Table } from "antd";
import { thongsomaycaoService } from "../../service/maycao/thongsomaycaoService";

const Thongsomaycao = ({thongsomaycaos}) => {
    const thongsomaycaosData = thongsomaycaos;
   const [datas, setDatas] = useState([]);
    useEffect(() => { 
        const fetchData = async () => {
            try {
                const response = await thongsomaycaoService.getThongsomaycaoDetailById(thongsomaycaosData.mayCaoId); 
             
                setDatas(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [thongsomaycaosData]);   

     const columns = [
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh', key: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo', key: 'thongSo' },   
     
  ]
    return(       
       <Table dataSource={datas} columns={columns} pagination={false} rowKey="id" />    
    )
}

  export default Thongsomaycao