import React, { useEffect, useCallback } from 'react'
import { myData } from '../widgets/data'
import { CRow, CContainer } from '@coreui/react'
import WidgetThietbi from '../widgets/WidgetThietbi'
import { useDispatch, useSelector } from 'react-redux'
import { readAllQuatgio } from '../../reducer/quatgioSlice'
import { readAllToidien } from '../../reducer/toidienSlice'
const Dashboard = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(readAllQuatgio());
    dispatch(readAllToidien());
  }, [])


  //Lấy dữ liệu từ Slice
  const countQuatgio = useSelector((state) => state.quatgios.count)
  const countToidien = useSelector((state) => state.toidiens.count)
  const Data = myData;
  //Dùng vòng lặp để gán tổng vào myData
  for (let i = 0; i < myData.length; i++) {
    switch (Data[i].name) {
      case "bomnuoc":
        Data[i].sl = countQuatgio
        break;
      case "toidien":
        Data[i].sl = countToidien
        break;
      case "maycao":
        Data[i].sl = null
        break;
      case "bangtai":
        Data[i].sl = null
        break;
      default:
        Data[i].sl = null
    }
  }

  return (
    <>
      <CContainer fluid>
        <CRow xs={{ cols: 1, gutter: 2 }} md={{ cols: 3, gutter: 4 }} lg={{ cols: 6, gutter: 4 }} >
          {Data.map((item) => (
            <WidgetThietbi key={item.title} {...item} />
          ))}
        </CRow>
      </CContainer>

    </>
  )
}

export default React.memo(Dashboard) 
