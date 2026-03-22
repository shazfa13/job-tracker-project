import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (

    <div style={{
      background: "#1e293b",
      color: "white",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      <h2 style={{margin:0}}>JobTracker {userRole === "admin" && "- Admin"}</h2>

      <div>

        {userRole === "admin" ? (
          <>
            <button
              onClick={()=>navigate("/admin-dashboard")}
              style={{marginRight:"10px"}}
            >
              Admin Dashboard
            </button>
          </>
        ) : (
          <>
            <button
              onClick={()=>navigate("/dashboard")}
              style={{marginRight:"10px"}}
            >
              Dashboard
            </button>

            <button
              onClick={()=>navigate("/add-job")}
              style={{marginRight:"10px"}}
            >
              Add Job
            </button>

            <button
              onClick={()=>navigate("/search-company")}
              style={{marginRight:"10px"}}
            >
              Search Company
            </button>
          </>
        )}

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>

  );
}

export default Navbar;
