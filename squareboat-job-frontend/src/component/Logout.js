import { useEffect } from "react";
import { Redirect } from "react-router-dom";

const Logout = (props) => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
  }, []);
  return <Redirect to="/login" />;
};

export default Logout;
