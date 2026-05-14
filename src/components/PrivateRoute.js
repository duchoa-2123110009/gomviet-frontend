import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu chưa đăng nhập → chuyển về /auth
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Nếu role không nằm trong allowedRoles → chuyển về /auth
  if (!allowedRoles.includes(user.roles)) {
    return <Navigate to="/auth" replace />;
  }

  // Nếu hợp lệ → render component con
  return children;
}

export default PrivateRoute;