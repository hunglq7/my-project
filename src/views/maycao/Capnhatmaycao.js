import React, { useEffect, useMemo, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Space,
  Input,
  Select,
  Checkbox,
  message,
  Tag,
  Row,
  Col,
  Tabs,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { tonghopquatgioService } from '../../service/maycao/tonghopmaycaoService'
import { danhmucmaycaoService } from '../../service/maycao/danhmucmaycaoService'
import { phongbanService } from '../../service/phongbanService'
import Thongsomaycao from './Thongsomaycao'
import * as XLSX from 'xlsx'
import { DownloadOutlined } from '@ant-design/icons'
import Nhatkymaycao from './Nhatkymaycao'
import { useDispatch } from 'react-redux'


const { Option } = Select
const { TabPane } = Tabs
const schema = yup
  .object({
    mayCaoId: yup.number().required('Thiết bị là bắt buộc'),
    donViId: yup.number().required('Đơn vị là bắt buộc'),
    maQuanLy: yup.string().required('Mã quản lý là bắt buộc'),
    viTriLapDat: yup.string().required('Vị trí lắp đặt là bắt buộc'),
    ngayLap: yup.string().required('Ngày lắp là bắt buộc'),
    soLuong: yup.number().required('Số lượng là bắt buộc').typeError('Số lượng phải là số'),
  })
  .required()

const Capnhatmaycao = () => {
  const [rows, setRows] = useState([])
  const [maycao, setMaycao] = useState([])
  const [loading, setLoading] = useState(false)
  const [devices, setDevices] = useState([])
  const [donvis, setDonvis] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [searchText, setSearchText] = useState('')
  const [isNarrow, setIsNarrow] = useState(false)
  const dispatch = useDispatch()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mayCaoId: null,
      donViId: null,
      maQuanLy: '',
      viTriLapDat: '',
      ngayLap: '',
      soLuong: 1,
      chieuDaiMay: '',
      soLuongXich: '',
      soLuongCauMang: '',
      tinhTrangThietBi: '',
      duPhong: false,
      ghiChu: '',
    },
  })

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [r1, r2, r3] = await Promise.all([
        tonghopquatgioService.getMaycao(),
        danhmucmaycaoService.getDanhmucmaycaos(),
        phongbanService.getPhongban(),
      ])
      setRows(r1?.data || [])
      setDevices(r2?.data || [])
      setDonvis(r3?.data || [])
    } catch (err) {
      console.error(err)
      message.error('Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setActiveTab('1')
    setEditing(null)
    reset()
    setOpen(true)
  }

  const onEdit = (record) => {
    // dispatch(getThongsomaycaoById(record.mayCaoId))
    setActiveTab('1')
    setMaycao(record)
    setEditing(record)
    // prefill form values
    reset({
      mayCaoId: record.mayCaoId || null,
      donViId: record.donViId || null,
      maQuanLy: record.maQuanLy || '',
      viTriLapDat: record.viTriLapDat || '',
      ngayLap: record.ngayLap ? record.ngayLap.split('T')[0] : '',
      soLuong: record.soLuong ?? 1,
      chieuDaiMay: record.chieuDaiMay || '',
      soLuongXich: record.soLuongXich || '',
      soLuongCauMang: record.soLuongCauMang || '',
      tinhTrangThietBi: record.tinhTrangThietBi || '',
      duPhong: !!record.duPhong,
      ghiChu: record.ghiChu || '',
    })
    setOpen(true)
  }

  const onDelete = async (record) => {
    try {      
      await tonghopquatgioService.deleteMaycao(record.id)
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
      await tonghopquatgioService.deleteMaycaos(selectedRowKeys)
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
        await tonghopquatgioService.updateTonghopmaycao(payload)
        message.success('Cập nhật thành công')
      } else {
        await tonghopquatgioService.addTonghopmaycao(payload)
        message.success('Thêm mới thành công')
      }
      setOpen(false)
      fetchAll()
    } catch (err) {
      console.error(err)
      message.error('Lưu thất bại')
    }
  }

  const exportToExcel = () => {
    try {
      const rowsToExport = (selectedRowKeys && selectedRowKeys.length > 0)
        ? rows.filter((r) => selectedRowKeys.includes(r.id))
        : filtered

      if (!rowsToExport || rowsToExport.length === 0) {
        message.info('Không có dữ liệu để xuất')
        return
      }

      const mapped = rowsToExport.map((r) => ({
        'Mã quản lý': r.maQuanLy || '',
        'Thiết bị': r.tenThietBi || '',
        'Đơn vị': r.tenDonVi || '',
        'Vị trí': r.viTriLapDat || '',
        'Ngày lắp': formatDate(r.ngayLap) || '',
        'Số lượng': r.soLuong ?? '',
        'Tình trạng': r.tinhTrangThietBi || '',
        'Dự phòng': r.duPhong ? 'Có' : 'Không',
        'Ghi chú': r.ghiChu || '',
      }))

      const ws = XLSX.utils.json_to_sheet(mapped)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'MayCao')
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      XLSX.writeFile(wb, `maycao_export_${ts}.xlsx`)
    } catch (err) {
      console.error(err)
      message.error('Xuất file lỗi')
    }
  }

  const filtered = useMemo(() => {
    const q = (searchText || '').trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const keys = [
        r.maQuanLy,
        r.viTriLapDat,
        r.tinhTrangThietBi,
        r.ghiChu,
        r.tenThietBi,
        r.tenDonVi,
      ]
      return keys.some((k) => (k || '').toString().toLowerCase().includes(q))
    })
  }, [rows, searchText])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    }
    const s = (dateStr || '').split('T')[0]
    const parts = s.split('-')
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
    return dateStr
  }

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy', fixed: 'left', width: 120 },
    { title: 'Thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
    { title: 'Đơn vị', dataIndex: 'tenDonVi', key: 'tenDonVi' },   
    { title: 'Vị trí', dataIndex: 'viTriLapDat', key: 'viTriLapDat' },
    {
      title: 'Ngày lắp',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      render: (text) => formatDate(text),
    },
    { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
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
          <Button
            style={{ borderRadius: 100 }}
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button style={{ borderRadius: 100 }} danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        {!isNarrow ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
                  Thêm
                </Button>
                <Popconfirm
                  title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bản ghi?`}
                  onConfirm={onDeleteSelected}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button danger disabled={!selectedRowKeys.length}>
                    Xóa đã chọn
                  </Button>
                </Popconfirm>
                 <Input.Search
                placeholder="Tìm kiếm..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 320 }}
                value={searchText}
              />
              </Space>

              <Space>
                <Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
                  Xuất Excel
                </Button>
              </Space>
            </div>
           
          </>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <Input.Search
                placeholder="Tìm kiếm..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
                value={searchText}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
                  Thêm
                </Button>
                <Popconfirm
                  title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bản ghi?`}
                  onConfirm={onDeleteSelected}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button danger disabled={!selectedRowKeys.length}>
                    Xóa đã chọn
                  </Button>
                </Popconfirm>
              </Space>

              <Space>
                <Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
                  Xuất Excel
                </Button>
              </Space>
            </div>
          </>
        )}
      </div>

      <Table
        rowKey="id"
        dataSource={filtered}
        loading={loading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 1500 }}
      />

      <Modal
        style={{ marginTop: 24 }}
        width={900}
        title={editing ? 'Sửa thiết bị' : 'Thêm thiết bị'}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        forceRender
      >
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Cập nhật thông tin máy cào" key="1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Đơn vị</label>
                  <Controller
                    name="donViId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Chọn đơn vị"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        {donvis.map((d) => (
                          <Option key={d.id} value={d.id}>
                            {d.tenPhong || d.tenDonVi}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.donViId && <div style={{ color: 'red' }}>{errors.donViId.message}</div>}
                </div>

                <div>
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
                      >
                        {devices.map((d) => (
                          <Option key={d.id} value={d.id}>
                            {d.tenThietBi}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.mayCaoId && <div style={{ color: 'red' }}>{errors.mayCaoId.message}</div>}
                </div>
                <div>
                  <label>Mã quản lý</label>
                  <Controller
                    name="maQuanLy"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.maQuanLy && <div style={{ color: 'red' }}>{errors.maQuanLy.message}</div>}
                </div>
                <div>
                  <label>Vị trí lắp đặt</label>
                  <Controller
                    name="viTriLapDat"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.viTriLapDat && (
                    <div style={{ color: 'red' }}>{errors.viTriLapDat.message}</div>
                  )}
                </div>
                <div>
                  <label>Ngày lắp</label>
                  <Controller
                    name="ngayLap"
                    control={control}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                  {errors.ngayLap && <div style={{ color: 'red' }}>{errors.ngayLap.message}</div>}
                </div>
                <div>
                  <label>Số lượng</label>
                  <Controller
                    name="soLuong"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} />}
                  />
                  {errors.soLuong && <div style={{ color: 'red' }}>{errors.soLuong.message}</div>}
                </div>
                <div>
                  <label>Chiều dài máy</label>
                  <Controller
                    name="chieuDaiMay"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <label>Số lượng xích</label>
                  <Controller
                    name="soLuongXich"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} />}
                  />
                </div>
                <div>
                  <label>Số lượng cẩu mạng</label>
                  <Controller
                    name="soLuongCauMang"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} />}
                  />
                </div>
                <div>
                  <label>Tình trạng thiết bị</label>
                  <Controller
                    name="tinhTrangThietBi"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Controller
                    name="duPhong"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <label>Dự phòng</label>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Ghi chú</label>
                  <Controller
                    name="ghiChu"
                    control={control}
                    render={({ field }) => <Input.TextArea rows={3} {...field} />}
                  />
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
          <TabPane tab="Nhật ký thiết bị" key="2" disabled={!editing}>
            {editing ? (
              <Nhatkymaycao nhatkymaycao={maycao} />
            ) : (
              <div>Chọn bản ghi để xem nhật ký thiết bị</div>
            )}
          </TabPane>
          <TabPane tab="Thông số kỹ thuật" key="3" disabled={!editing}>
            {editing ? (
              <Thongsomaycao thongsomaycaos={maycao} />
            ) : (
              <div>Chọn bản ghi để xem thông số kỹ thuật</div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
      
    </div>
  )
}

export default Capnhatmaycao
