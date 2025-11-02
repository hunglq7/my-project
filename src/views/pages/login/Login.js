import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import './login.scss'
import { CCardHeader, CToast, CToastBody, CToastClose, CToastHeader, CToaster } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useRef, useState } from 'react'
import { authService } from '../../../service/authService'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
const Login = () => {

  const toast = useRef(null);
  const form = useRef();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const handSummit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.loginWithUserCredentials(email, password)
      if (response) {
        navigate("/dashboard")
      }
    } catch {
      toast.current.show({ severity: 'success', summary: 'Thông báo', detail: `Tên đăng nhập hoặc mật khẩu không đúng `, life: 3000 });
    }



  }


  return (
    <div className=" backgoud-img bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <Toast ref={toast} />
      <CContainer>
        <CRow className="justify-content-start">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4 card-login">
                <CCardBody>
                  <CForm ref={form}>
                    <h1>Login</h1>
                    <p className="text-body-secondary hText">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" value={email} onChange={onChangeEmail} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={onChangePassword}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handSummit}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
