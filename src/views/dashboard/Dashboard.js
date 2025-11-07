import React from 'react'
import bomnuoc from '../../assets/images/thietbi/Bomnuoc.jpg'
import maycao from '../../assets/images/thietbi/mangcao-sgb.jpg'
import bangtai from '../../assets/images/thietbi/Bang-tai.jpg'
import bienap from '../../assets/images/thietbi/Bienap.jpg'
import capdien from '../../assets/images/thietbi/capdien.png'
import aptomat from '../../assets/images/thietbi/Ap-to-mat.png'
import maykhoan from '../../assets/images/thietbi/Maykhoan.jpg'
import khoidongtu from '../../assets/images/thietbi/khoi-dong-tu.jpg'
import { useDispatch, useSelector } from 'react-redux'

import { CRow, CContainer } from '@coreui/react'
import WidgetThietbi from '../widgets/WidgetThietbi'
export const myData = [
  {
    image: bomnuoc,
    title: "Bơm nước",
    desc: "Tổng số thiết bị",
    url: "/quatgio/capnhatquatgio",
    sl: "150"
  },
  {
    image: maycao,
    title: "Máy cào",
    desc: "Tổng số thiết bị",
    url: "/maycao/capnhatmaycao",
    sl: "150"
  },
  {
    image: bangtai,
    title: "Băng tải",
    desc: "Tổng số thiết bị",
    url: "/bangtai/capnhatbangtai",
    sl: "150"
  },
  {
    image: bienap,
    title: "Biến áp",
    desc: "Tổng số thiết bị",
    url: "/bienap/capnhatbienap",
    sl: "150"
  },
  {
    image: capdien,
    title: "Cáp điện",
    desc: "Tổng số thiết bị",
    url: "/capdien/capnhatcapdien",
    sl: "150"
  },
  {
    image: aptomat,
    title: "Áp to mát",
    desc: "Tổng số thiết bị",
    url: "/aptomat/capnhataptomat",
    sl: "150"
  },
  {
    image: maykhoan,
    title: "Máy khoan",
    desc: "Tổng số thiết bị",
    url: "/maykhoan/capnhatmaykhoan",
    sl: "150"
  },
  {
    image: khoidongtu,
    title: "Khởi động từ",
    desc: "Tổng số thiết bị",
    url: "/khoidongtu/capnhatkhoidongtu",
    sl: "150"
  },
];
const Dashboard = () => {
  const data = useSelector((state) => state.quatgios.data)
  const counts = data.length;

  return (
    <>
      <CContainer fluid>
        <CRow xs={{ cols: 1, gutter: 2 }} lg={{ cols: 6, gutter: 4 }}>
          {myData.map((item) => (
            <WidgetThietbi key={item.title} {...item} />
          ))}
        </CRow>
      </CContainer>

    </>
  )
}

export default Dashboard
