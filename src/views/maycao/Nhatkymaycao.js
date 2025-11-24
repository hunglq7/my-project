import React, { useEffect, useState } from 'react'
import { Table, Button, Popconfirm, Form, Input, Space, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { nhatkymaycaoService } from '../../service/maycao/nhatkymaycaoService'

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode = <Input />
  if (inputType === 'date') inputNode = <DatePicker style={{ width: '100%' }} />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: false,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const Nhatkymaycao = ({ nhatkymaycao }) => {
  const id = nhatkymaycao?.id ?? nhatkymaycao?.mayCaoId ?? null
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await nhatkymaycaoService.getNhatkyById(id)
      const items = (res?.data || []).map((r) => ({
        ...r,
        ngayThang: r.ngayThang ? dayjs(r.ngayThang) : null,
      }))
      setData(items)
    } catch (err) {
      console.error(err)
      message.error('Lấy nhật ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const isEditing = (record) => record.key === editingKey

  const edit = (record) => {
    form.setFieldsValue({
      tongHopMayCaoId: record.tongHopMayCaoId || null,
      ngayThang: record.ngayThang || null,
      donVi: record.donVi || '',
      viTri: record.viTri || '',
      trangThai: record.trangThai || '',
      ghiChu: record.ghiChu || '',
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = () => {
    // if new unsaved row, remove it
    if ((editingKey + '').startsWith('new_')) {
      setData((prev) => prev.filter((r) => r.key !== editingKey))
    }
    setEditingKey('')
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const record = data.find((d) => d.key === key)
      const payload = {
        ...record,
        ...row,
        ngayThang: row.ngayThang ? row.ngayThang.format('YYYY-MM-DD') : null,
      }
      const items={
        id: 0,
        tongHopMayCaoId: payload.tongHopMayCaoId,
        ngayThang: payload.ngayThang,
        donVi: payload.donVi,
        viTri: payload.viTri,
        trangThai: payload.trangThai,
        ghiChu: payload.ghiChu,
      }
      setLoading(true)
      if ((key + '').startsWith('new_')) {
        // create
        console.log('payload', items)
        const res = await nhatkymaycaoService.addNhatkymaycao(items)
        message.success('Thêm nhật ký thành công')
        await fetch()
      } else {
        // update
        await nhatkymaycaoService.updateNhatkymaycao(items)
        message.success('Cập nhật nhật ký thành công')
        setData((prev) =>
          prev.map((item) =>
            item.key === key ? { ...item, ...payload, ngayThang: row.ngayThang } : item,
          ),
        )
      }
      setEditingKey('')
    } catch (err) {
      console.error(err)
      message.error('Lưu thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (record) => {  
    try {
      setLoading(true)
      if ((record.key + '').startsWith('new_')) {
        setData((prev) => prev.filter((r) => r.key !== record.key))
        message.success('Đã hủy bản ghi mới')
      } else {
        await nhatkymaycaoService.deleteNhatkymaycao(record.id)
        message.success('Xóa nhật ký thành công')
        setData((prev) => prev.filter((r) => r.key !== record.key))
      }
    } catch (err) {
      console.error(err)
      message.error('Xóa thất bại')
    } finally {
      setLoading(false)
    }
  }

  const addNew = () => {
    const key = `new_${Date.now()}`
    const newRow = {
      key,
      id: null,
      tongHopMayCaoId: id,
      ngayThang: dayjs(),
      donVi: '',
      viTri: '',
      trangThai: '',
      ghiChu: '',
    }
    setData((prev) => [newRow, ...prev])
    form.setFieldsValue({
     ngayThang: newRow.ngayThang,
      donVi: newRow.donVi,
      viTri: newRow.viTri,
      trangThai: newRow.trangThai,
      ghiChu: newRow.ghiChu,
    })
    setEditingKey(key)
  }

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'ngayThang',
      key: 'ngayThang',
      width: 160,
      editable: true,
      inputType: 'date',
      fixed: 'left',
      render: (val) => (val ? dayjs(val).format('DD/MM/YYYY') : '-')
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donVi',
      key: 'donVi',
      editable: true,
      fixed: 'left',
    },
    {
      title: 'Vị trí',
      dataIndex: 'viTri',
      key: 'viTri',
      editable: true,
      width: 160,
    },
     {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      editable: true,
      width: 160,
    },
     {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      editable: true,
      width: 160,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button type="link" onClick={() => save(record.key)}>
              Lưu
            </Button>
            <Button type="link" onClick={cancel}>
              Hủy
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type="link" onClick={() => edit(record)}>
              Sửa
            </Button>
            <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record)}>
              <Button type="link" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType || (col.dataIndex === 'ngayThang' ? 'date' : 'text'),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  // ensure keys for existing data
  useEffect(() => {
    setData((prev) =>
      prev.map((r) => {
        if (!r.key) return { ...r, key: r.id ?? `${r.mayCaoId}_${r.id}` }
        return r
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length === 0])

  return (
    <Form form={form} component={false}>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={addNew}>
          Thêm nhật ký
        </Button>
        <Button onClick={fetch}>Tải lại</Button>
      </Space>

      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowClassName="editable-row"
        bordered       
        dataSource={data}
        columns={mergedColumns}
        rowKey="key"
        loading={loading}
        pagination={{ pageSize: 6 }}
         scroll={{ x: 'max-content' }}
      />
    </Form>
  )
}

export default Nhatkymaycao
