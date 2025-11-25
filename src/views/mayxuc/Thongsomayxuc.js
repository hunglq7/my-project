import React, { useEffect, useState } from 'react'
import { Table, message } from 'antd'
import { thongsomayxucService } from '../../service/mayxuc/thongsomayxucService'

const Thongsomayxuc = ({ thongsomayxuc }) => {
  const thongsomayxucsData = thongsomayxuc
  const [datas, setDatas] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await thongsomayxucService.getThongsomayxucDetailById(thongsomayxucsData?.mayXucId)
        setDatas(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        message.error('Lấy thông số thiết bị thất bại')
      }
    }
    if (thongsomayxucsData && thongsomayxucsData.mayXucId) fetchData()
  }, [thongsomayxucsData])

  const columns = [
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh', key: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo', key: 'thongSo' },
  ]

  return <Table dataSource={datas} columns={columns} pagination={false} rowKey="id" />
}

export default Thongsomayxuc
