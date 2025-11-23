import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilHome
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Trang chủ',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'TMD',
    },
  },
  {
    component: CNavTitle,
    name: 'Danh mục',
  },
  {
    component: CNavGroup,
    name: 'Danh mục',
    to: '/danhmuc',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Chức vụ',
        to: '/chucvu/chucvu',
      },
      {
        component: CNavItem,
        name: 'Đơn vị',
        to: '/donvi/donvi',
      },

    ],
  },
  {
    component: CNavTitle,
    name: 'Cập nhật thiết bị',
  },
  {
    component: CNavGroup,
    name: 'Máy cào',
    to: '/maycao',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cập nhật máy cào',
        to: '/maycao/capnhatmaycao',
      },
      {
        component: CNavItem,
        name: 'Danh mục máy cào',
        to: '/maycao/danhmucmaycao',
      },
      {
        component: CNavItem,
        name: 'Thông số máy cào',
        to: '/maycao/thongsomaycao',
      }, 

    ],
  },
  {
    component: CNavGroup,
    name: 'Quạt gió',
    to: '/quatgio',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cập nhật quạt gió',
        to: '/quatgio/capnhatquatgio',
      },
      {
        component: CNavItem,
        name: 'Danh mục quạt gió',
        to: '/quatgio/danhmucquatgio',
      },
      {
        component: CNavItem,
        name: 'Thông số quạt gió',
        to: '/quatgio/thongsoquatgio',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Tời điện',
    to: '/toidien',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [

      {
        component: CNavItem,
        name: 'Danh mục tời điện',
        to: '/toidien/danhmuctoidien',
      },
      {
        component: CNavItem,
        name: 'Cập nhật tời điện',
        to: '/toidien/tonghoptoidien',
      },
      {
        component: CNavItem,
        name: 'Thông số tời điện',
        to: '/toidien/thongsotoidien',
      },

    ],
  },

  {
    component: CNavTitle,
    name: 'Hệ thống',
  },
  {
    component: CNavGroup,
    name: 'Cài đặt',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
