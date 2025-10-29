
import { Navigate } from "react-router-dom"
function ProtectRouter({ children }) {
    const isLogin = localStorage.getItem("session")
    if (!isLogin) {
        return <Navigate to="/" replace />
    }
    return children;
}
export default ProtectRouter