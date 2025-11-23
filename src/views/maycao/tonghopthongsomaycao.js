import React, { useEffect, useState, useMemo } from 'react'
import { Table, Button, Modal, Popconfirm, message, Space, Select, Input } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, DeleteFilled, FileAddFilled } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { danhmucmaycaoService } from '../../service/maycao/danhmucmaycaoService'
import { thongsomaycaoService } from '../../service/maycao/thongsomaycaoService'
import * as XLSX from 'xlsx'

const { Option } = Select

// Validation schema
const schema = yup.object({
  mayCaoId: yup.number().required('Thiết bị là bắt buộc').typeError('Thiết bị không hợp lệ'),
  noiDung: yup.string().required('Nội dung là bắt buộc'),
  donViTinh: yup.string().required('Đơn vị tính là bắt buộc'),
  thongSo: yup.string().required('Thông số là bắt buộc')
}).required()

const Tonghopthongsomaycao = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [danhmuc, setDanhmuc] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [searchText, setSearchText] = useState('')

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { mayCaoId: null, noiDung: '', donViTinh: '', thongSo: '' }
  })

  useEffect(() => {
    fetchDanhmuc()
    fetchData()
  }, [])

  const fetchDanhmuc = async () => {
    try {
      const res = await danhmucmaycaoService.getDanhmucmaycaos()
      setDanhmuc(res?.data || [])
    } catch (err) {
      console.error(err)
      message.error('Không tải được danh mục thiết bị')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await thongsomaycaoService.getThongsomaycao()
      setData(res?.data || [])
    } catch (err) {
      console.error(err)
      message.error('Không tải được dữ liệu thông số')
    } finally {
      setLoading(false)
    }
  }

  const onAdd = () => {
    setEditing(null)
    reset({ mayCaoId: null, noiDung: '', donViTinh: '', thongSo: '' })
    setModalVisible(true)
  }

  const onEdit = (record) => {
    setEditing(record)
    // prefill form
    reset({ mayCaoId: record.mayCaoId ?? null, noiDung: record.noiDung ?? '', donViTinh: record.donViTinh ?? '', thongSo: record.thongSo ?? 0 })
    setModalVisible(true)
  }

  const onDelete = async (record) => {
    try {
      await thongsomaycaoService.deleteThongsomaycao(record.id)
      message.success('Xóa thành công')
      fetchData()
    } catch (err) {
      console.error(err)
      message.error('Xóa thất bại')
    }
  }

  const onDeleteSelected = async () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('Chưa chọn bản ghi nào để xóa')
      return
    }
    try {

      // backend expects an array of ids (or objects). We send ids array.
      await thongsomaycaoService.deleteSelectThongsomaycao(selectedRows)
      message.success('Xóa nhiều bản ghi thành công')
      // clear selection and refresh
      setSelectedRowKeys([])
      setSelectedRows([])
      fetchData()
    } catch (err) {
      console.error(err)
      message.error('Xóa nhiều bản ghi thất bại')
    }
  }

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        id: editing?.id ?? 0
      }
      if (editing) {
        await thongsomaycaoService.updateThongsomaycao(payload)
        message.success('Cập nhật thành công')
      } else {
        await thongsomaycaoService.addThongsomaycao(payload)
        message.success('Thêm mới thành công')
      }
      setModalVisible(false)
      fetchData()
    } catch (err) {
      console.error(err)
      message.error('Lưu thất bại')
    }
  }

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      key: 'tenThietBi',
      render: (_, record) => {
        // try to show name from joined field or lookup
        if (record.tenThietBi) return record.tenThietBi
        const found = danhmuc.find(d => d.id === record.mayCaoId)
        return found ? found.tenThietBi : ''
      }
    },
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh', key: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo', key: 'thongSo' },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button style={{borderRadius:100}} icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => onDelete(record)} okText="Có" cancelText="Không">
            <Button style={{borderRadius:100}} danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const filteredData = useMemo(() => {
    const q = (searchText || '').trim().toLowerCase()
    if (!q) return data
    return data.filter(rec => {
      const ten = (rec.tenThietBi || '').toString().toLowerCase()
      const noi = (rec.noiDung || '').toString().toLowerCase()
      const don = (rec.donViTinh || '').toString().toLowerCase()
      const thong = (rec.thongSo || '').toString().toLowerCase()
      const found = danhmuc.find(d => d.id === rec.mayCaoId)
      const lookup = (found?.tenThietBi || '').toString().toLowerCase()
      return ten.includes(q) || noi.includes(q) || don.includes(q) || thong.includes(q) || lookup.includes(q)
    })
  }, [data, searchText, danhmuc])

  const exportToExcel = () => {
    try {
      const rowsToExport = (selectedRowKeys && selectedRowKeys.length > 0) ? selectedRows : filteredData
      if (!rowsToExport || rowsToExport.length === 0) {
        message.info('Không có dữ liệu để xuất')
        return
      }
      // map rows to plain objects for excel
      const rows = rowsToExport.map(r => {
        const found = danhmuc.find(d => d.id === r.mayCaoId)
        return {
          'Tên thiết bị': r.tenThietBi || (found ? found.tenThietBi : ''),
          'Nội dung': r.noiDung || '',
          'Đơn vị tính': r.donViTinh || '',
          'Thông số': r.thongSo || ''
        }
      })
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Thongsomaycao')
      const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')
      XLSX.writeFile(wb, `thongsomaycao_export_${ts}.xlsx`)
    } catch (err) {
      console.error(err)
      message.error('Xuất file lỗi')
    }
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<FileAddFilled />} onClick={onAdd}>Thêm</Button>
        <Popconfirm title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bản ghi đã chọn?`} onConfirm={onDeleteSelected} okText="Có" cancelText="Không">
          <Button danger icon={<DeleteFilled/>} disabled={selectedRowKeys.length === 0}>Xóa đã chọn</Button>
        </Popconfirm>
        <Button color="primary" variant="outlined"  icon={<DownloadOutlined />} onClick={() => exportToExcel()}>
          Xuất Excel
        </Button>
        <Input.Search
        color='primary'
        variant="outlined" 
          placeholder="Tìm kiếm theo thiết bị / nội dung / đơn vị / thông số"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 360 }}
          value={searchText}
        />
      </Space>
      
        <Table        
        rowKey="id"
        loading={loading}
        dataSource={filteredData}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys)
            setSelectedRows(rows)
          }
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <Modal className='mt-5' title={editing ? 'Sửa thông số' : 'Thêm thông số'} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} forceRender>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 12 }}>
            <label>Thiết bị</label>
            <Controller
              name="mayCaoId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Chọn thiết bị"
                  style={{ width: '100%' }}
                  allowClear
                  value={field.value}
                  onChange={value => field.onChange(value)}
                >
                  {danhmuc.map(d => (
                    <Option key={d.id} value={d.id}>{d.tenThietBi}</Option>
                  ))}
                </Select>
              )}
            />
            {errors.mayCaoId && <div style={{ color: 'red' }}>{errors.mayCaoId.message}</div>}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Nội dung</label>
            <Controller
              name="noiDung"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.noiDung && <div style={{ color: 'red' }}>{errors.noiDung.message}</div>}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Đơn vị tính</label>
            <Controller
              name="donViTinh"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.donViTinh && <div style={{ color: 'red' }}>{errors.donViTinh.message}</div>}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Thông số</label>
            <Controller
              name="thongSo"
              control={control}
              render={({ field }) => <Input {...field}  />}
            />
            {errors.thongSo && <div style={{ color: 'red' }}>{errors.thongSo.message}</div>}
          </div>

          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>{editing ? 'Lưu' : 'Thêm'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Tonghopthongsomaycao
