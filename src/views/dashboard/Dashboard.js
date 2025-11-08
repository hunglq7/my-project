import React, { useEffect, useCallback } from 'react'
import { myData } from '../widgets/data'
import { CRow, CContainer } from '@coreui/react'
import WidgetThietbi from '../widgets/WidgetThietbi'
import { useDispatch, useSelector } from 'react-redux'
import { readAllQuatgio } from '../../reducer/quatgioSlice'
const Dashboard = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    quatgioData();
  }, [])

  const quatgioData = useCallback(async () => {
    try {
      dispatch(readAllQuatgio());
    } catch (error) {
      console.log(error)
    }
  }, [])
  //Lấy dữ liệu từ bảng Tonghopquatgio
  const quatgios = useSelector((state) => state.quatgios.data)
  const Data = myData;
  //Tạo hàm tính tổng
  function tinhTong(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      count += arr[i].soLuong;
    }
    return count
  }
  //Tính tổng số lượng quạt gió
  const countQuatgio = tinhTong(quatgios);
  console.log("countQuatgio", countQuatgio)

  //Dùng vòng lặp để gán tổng vào myData
  for (let i = 0; i < myData.length; i++) {
    switch (Data[i].name) {
      case "bomnuoc":
        Data[i].sl = countQuatgio
        break;
      case "maycao":
        Data[i].sl = 25
        break;
      case "bangtai":
        Data[i].sl = 150
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

export default Dashboard
