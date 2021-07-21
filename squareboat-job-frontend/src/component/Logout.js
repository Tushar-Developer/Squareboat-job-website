import { useEffect } from "react";
import { Redirect } from "react-router-dom";

const refreshPage = () => {
  window.location.reload();
}

const Logout = (props) => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    refreshPage();
  }, []);
  return <Redirect to="/login" />;
};

export default Logout;
