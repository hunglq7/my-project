import { CToast, CToastBody, CToastHeader } from '@coreui/react'

const AppToasts = ({ title, body }) => {
    return (
        <CToast className="m-2">
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill="#007aff"></rect>
                </svg>
                <strong className="me-auto">{title}</strong>
                <small>7 min ago</small>
            </CToastHeader>
            <CToastBody style={{ fontSize: '0,8rem', fontFamily: 'Arial, sans-serif' }}>
                {body}
            </CToastBody>
        </CToast>
    )
}

export default AppToasts
