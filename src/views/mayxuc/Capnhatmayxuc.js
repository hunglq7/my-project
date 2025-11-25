import React, { useEffect, useMemo, useState } from 'react'
import { Table, Button, Modal, Popconfirm, Space, Input, Select, Checkbox, message, Tag, Tabs } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, FileAddFilled } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { capnhatmayxucService } from '../../service/mayxuc/capnhatmayxucService'
import { danhmucmayxucService } from '../../service/mayxuc/danhmucmayxucService'
import { phongbanService } from '../../service/phongbanService'
import { loaithietbiService } from '../../service/loaithietbi/loaithietbiService'
import Nhatkymayxuc from './Nhatkymayxuc'
import Thongsomayxuc from './Thongsomayxuc'

const { Option } = Select
const { TabPane } = Tabs

const schema = yup
  .object({
    mayxucId: yup.number().required('Thiết bị là bắt buộc'),
    phongBanId: yup.number().required('Phòng/Đơn vị là bắt buộc'),
    loaiThietBiId: yup.number().nullable(),
    maQuanLy: yup.string().required('Mã quản lý là bắt buộc'),
    viTriLapDat: yup.string().required('Vị trí lắp đặt là bắt buộc'),
    ngayLap: yup.string().required('Ngày lắp là bắt buộc'),
    soLuong: yup.number().required('Số lượng là bắt buộc').typeError('Số lượng phải là số'),
  })
  .required()

const Capnhatmayxuc = () => {
  const [rows, setRows] = useState([])
  const [devices, setDevices] = useState([])
  const [donvis, setDonvis] = useState([])
  const [loais, setLoais] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [searchText, setSearchText] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mayxucId: null,
      phongBanId: null,
      loaiThietBiId: null,
      maQuanLy: '',
      viTriLapDat: '',
      ngayLap: '',
      soLuong: 1,
      tinhTrang: '',
      duPhong: false,
      ghiChu: '',
    },
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [rRows,rDonvis,rDanhmuc,rLoai] = await Promise.all([
        capnhatmayxucService.getMayxuc ? capnhatmayxucService.getMayxuc() : capnhatmayxucService.getAll?.(),
        phongbanService.getPhongban ? phongbanService.getPhongban() : phongbanService.getAll?.(),
        danhmucmayxucService.getDanhmucmayxucs ? danhmucmayxucService.getDanhmucmayxucs() : danhmucmayxucService.getAll?.(),
        loaithietbiService.getLoaithietbi ? loaithietbiService.getLoaithietbi() : loaithietbiService.getAll?.(),
      ])
      setRows(rRows?.data || [])      
      setDonvis(rDonvis?.data || [])
      setDevices(rDanhmuc?.data || [])
      setLoais(rLoai?.data || [])      
    } catch (err) {
      console.error(err)
      message.error('Lấy dữ liệu thất bại') 
    } finally {
      setLoading(false)
    }
  }


  const openNew = () => {
    setActiveTab('1')
    setEditing(null)
    reset({mayxucId: null, phongBanId: null, loaiThietBiId: null, maQuanLy: '', viTriLapDat: '', ngayLap: '', soLuong: 1, tinhTrang: '', duPhong: false, ghiChu: ''})
    setOpen(true)
  }

  const onEdit = (record) => {
    setActiveTab('1')
    setEditing(record)
    reset({
      mayxucId: record.mayxucId ?? record.id ?? null,
      phongBanId: record.phongBanId ?? record.donViId ?? null,
      loaiThietBiId: record.loaiThietBiId ?? record.loaiThietBi?.id ?? null,
      maQuanLy: record.maQuanLy || '',
      viTriLapDat: record.viTriLapDat || '',
      ngayLap: record.ngayLap ? record.ngayLap.split('T')[0] : '',
      soLuong: record.soLuong ?? 1,
      tinhTrang: record.tinhTrang || '',
      duPhong: !!record.duPhong,
      ghiChu: record.ghiChu || '',
    })
    setOpen(true)
  }

  const onDelete = async (record) => {
    try {
      await capnhatmayxucService.deleteMayxuc(record.id)
      message.success('Xóa thành công')
      fetchAll()
    } catch (err) {
      console.error(err)
      message.error('Xóa thất bại')
    }
  }

  const onDeleteSelected = async () => {
    if (!selectedRowKeys.length) {
      message.warning('Chưa chọn bản ghi nào')
      return
    }
    try {
      await capnhatmayxucService.deleteMayxucs(selectedRowKeys)
      message.success('Xóa nhiều bản ghi thành công')
      setSelectedRowKeys([])
      fetchAll()
    } catch (err) {
      console.error(err)
      message.error('Xóa nhiều thất bại')
    }
  }

  const onSubmit = async (values) => {
    try {
      const payload = { ...values }
      if (editing && editing.id) {
        payload.id = editing.id
        await capnhatmayxucService.updateTonghopmayxuc(payload)
        message.success('Cập nhật thành công')
        setOpen(false)
      } else {
        await capnhatmayxucService.addTonghopmayxuc(payload)
        message.success('Thêm mới thành công')
        reset({mayxucId: null, phongBanId: null, loaiThietBiId: null, maQuanLy: '', viTriLapDat: '', ngayLap: '', soLuong: 1, tinhTrang: '', duPhong: false, ghiChu: ''})
      }
      
      fetchAll()
    } catch (err) {
      console.error(err)
      message.error('Lưu thất bại')
    }
  }

  const filtered = useMemo(() => {
    const q = (searchText || '').trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const keys = [r.maQuanLy, r.viTriLapDat, r.tinhTrang, r.ghiChu, r.tenThietBi, r.tenDonVi]
      return keys.some((k) => (k || '').toString().toLowerCase().includes(q))
    })
  }, [rows, searchText])

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy', fixed: 'left', width: 140 },
    { title: 'Thiết bị', dataIndex: 'tenMayXuc', key: 'tenMayXuc' },
    { title: 'Đơn vị/Phòng', dataIndex: 'tenPhongBan', key: 'tenPhongBan' },
    { title: 'Vị trí', dataIndex: 'viTriLapDat', key: 'viTriLapDat' },
    {
      title: 'Ngày lắp',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      render: (text) => (text ? (text.split ? text.split('T')[0] : text) : ''),
    },
    { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      key: 'tinhTrang',
    },
    {
      title: 'Dự phòng',
      dataIndex: 'duPhong',
      key: 'duPhong',
      render: (val) => <Tag color={val ? 'red' : 'green'}>{val ? 'Dự phòng' : 'Đang dùng'}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button style={{ borderRadius: 100 }} icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => onDelete(record)} okText="Có" cancelText="Không">
            <Button style={{ borderRadius: 100 }} danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button type="primary" icon={<FileAddFilled />} onClick={openNew}>
              Thêm
            </Button>
            <Popconfirm
              title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bản ghi?`}
              onConfirm={onDeleteSelected}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} disabled={!selectedRowKeys.length}>
                Xóa đã chọn
              </Button>
            </Popconfirm>
            <Input.Search placeholder="Tìm kiếm..." allowClear onChange={(e) => setSearchText(e.target.value)} style={{ width: 320 }} value={searchText} />
          </Space>

          <Space>
            <Button icon={<PlusOutlined />} onClick={fetchAll}>
              Tải lại
            </Button>
          </Space>
        </div>
      </div>

      <Table
        rowKey="id"
        dataSource={filtered}
        loading={loading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 1400 }}
      />

      <Modal
        style={{ marginTop: 12 }}
        width={900}  
        title={editing ? 'Sửa thiết bị' : 'Thêm thiết bị'}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        forceRender
        maskClosable={false}       
        zIndex={2000}
       
      >
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="CẬP NHẬT MÁY XÚC" key="1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Phòng ban / Đơn vị</label>
                  <Controller
                    name="phongBanId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Chọn phòng/đơn vị" style={{ width: '100%' }} allowClear>
                        {donvis.map((d) => (
                          <Option key={d.id} value={d.id}>
                            {d.tenPhong || d.tenDonVi}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.phongBanId && <div style={{ color: 'red' }}>{errors.phongBanId.message}</div>}
                </div>

                <div>
                  <label>Thiết bị</label>
                  <Controller
                    name="mayxucId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Chọn thiết bị" style={{ width: '100%' }} allowClear>
                        {devices.map((d) => (
                          <Option key={d.id} value={d.id}>
                            {d.tenThietBi || d.tenMayXuc}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.mayxucId && <div style={{ color: 'red' }}>{errors.mayxucId.message}</div>}
                </div>

                <div>
                  <label>Loại thiết bị</label>
                  <Controller
                    name="loaiThietBiId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="Chọn loại thiết bị" style={{ width: '100%' }} allowClear>
                        {loais.map((t) => (
                          <Option key={t.id} value={t.id}>
                            {t.tenLoai || t.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <label>Mã quản lý</label>
                  <Controller name="maQuanLy" control={control} render={({ field }) => <Input {...field} />} />
                  {errors.maQuanLy && <div style={{ color: 'red' }}>{errors.maQuanLy.message}</div>}
                </div>

                <div>
                  <label>Vị trí lắp đặt</label>
                  <Controller name="viTriLapDat" control={control} render={({ field }) => <Input {...field} />} />
                  {errors.viTriLapDat && <div style={{ color: 'red' }}>{errors.viTriLapDat.message}</div>}
                </div>

                <div>
                  <label>Ngày lắp</label>
                  <Controller name="ngayLap" control={control} render={({ field }) => <Input type="date" {...field} />} />
                  {errors.ngayLap && <div style={{ color: 'red' }}>{errors.ngayLap.message}</div>}
                </div>

                <div>
                  <label>Số lượng</label>
                  <Controller name="soLuong" control={control} render={({ field }) => <Input type="number" {...field} />} />
                  {errors.soLuong && <div style={{ color: 'red' }}>{errors.soLuong.message}</div>}
                </div>

                <div>
                  <label>Tình trạng</label>
                  <Controller name="tinhTrang" control={control} render={({ field }) => <Input {...field} />} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Ghi chú</label>
                  <Controller name="ghiChu" control={control} render={({ field }) => <Input.TextArea rows={2} {...field} />} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Controller
                    name="duPhong"
                    control={control}
                    render={({ field }) => <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  />
                  <label>Dự phòng</label>
                </div>

                
              </div>

              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Button style={{ marginRight: 8 }} onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  {editing ? 'Lưu' : 'Thêm'}
                </Button>
              </div>
            </form>
          </TabPane>

          <TabPane tab="NHẬT KÝ THIẾT BỊ" key="2" disabled={!editing}>
            {editing ? <Nhatkymayxuc nhatkymayxuc={editing} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>}
          </TabPane>

          <TabPane tab="THÔNG SỐ KỸ THUẬT" key="3" disabled={!editing}>
            {editing ? <Thongsomayxuc thongsomayxuc={editing} /> : <div>Chọn bản ghi để xem thông số kỹ thuật</div>}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

export default Capnhatmayxuc