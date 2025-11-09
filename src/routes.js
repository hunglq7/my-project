import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
//danhmuc
const Chucvu = React.lazy(() => import('./views/danhmuc/chucvu/Chucvu'))
const Donvi = React.lazy(() => import('./views/danhmuc/donvi/Donvi'))
//máy cào
const Maycao = React.lazy(() => import('./views/maycao/Capnhatmaycao'))
const DanhmucMaycao = React.lazy(() => import('./views/maycao/Capnhatdanhmucmaycao'))
//Quạt gió
const Quatgio = React.lazy(() => import('./views/quatgio/Capnhatquatgio'))
const DanhmucQuatgio = React.lazy(() => import('./views/quatgio/Capnhatdanhmucquatgio'))
const ThongsoQuatgio = React.lazy(() => import('./views/quatgio/Capnhatthongsoquatgio'))





const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  //DANH MỤC
  { path: '/chucvu/chucvu', name: 'Chức vụ', element: Chucvu },
  { path: '/donvi/donvi', name: 'Đơn vị', element: Donvi },
  //MÁy CÀO
  { path: '/maycao/capnhatmaycao', name: 'Cập nhật máy cào', element: Maycao },
  { path: '/maycao/danhmucmaycao', name: 'Danh mục máy cào', element: DanhmucMaycao },
  //QUẠT GIÓ
  { path: '/quatgio/danhmucmaycao', name: 'Danh mục máy cào', element: DanhmucMaycao },
  { path: '/quatgio/capnhatquatgio', name: 'Cập nhật quạt gió', element: Quatgio },
  { path: '/quatgio/danhmucquatgio', name: 'Danh mục quạt gió', element: DanhmucQuatgio },
  { path: '/quatgio/thongsoquatgio', name: 'Thông số quạt gió', element: ThongsoQuatgio },

]

export default routes
