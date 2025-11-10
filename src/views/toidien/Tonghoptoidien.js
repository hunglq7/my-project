import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {
    CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormCheck, CFormInput
} from '@coreui/react'
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
// import { InputNumber } from 'primereact/inputnumber';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { classNames } from 'primereact/utils';

import { DeleteFilled, EditFilled, SaveFilled, UndoOutlined, FileAddFilled, DownloadOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { CTab, CTabContent, CTabList, CTabPanel, CTabs, CPopover } from '@coreui/react'
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Toast } from 'primereact/toast';

export default function Tonghoptoidien() {

    let emptyToidien = {
        id: 0,
        maQuanLy: '',
        thietBiId: '',
        donViSuDungId: 0,
        viTriLapDat: '',
        ngayLap: "",
        mucDichSuDung: "",
        soLuong: 1,
        tinhTrangThietBi: '',
        duPhong: false,
        ghiChu: ''
    };

    const [toidiens, setToidiens] = useState([])
    const [donvis, setDonvis] = useState([]);
    const [danhmuctoidiens, setDanhmuctoidiens] = useState([]);
    const [toidienDialog, setToidienDialog] = useState(false);
    const [deleteToidienDialog, setDeleteToidienDialog] = useState(false);
    const [deleteToidiensDialog, setDeleteToidiensDialog] = useState(false);
    const [toidien, setToidien] = useState(emptyToidien);
    const [toidienId, setToidienId] = useState(null);
    const [tenthietbi, setTenthietbi] = useState(null);
    const [selectedToidiens, setSelectedToidiens] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [themmoi, setThemmoi] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    return (
        <>
            <p className="fw-bold text-primary">Tổng hợp tời điện</p>
        </>
    )
}