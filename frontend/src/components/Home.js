import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home(){

  const navigate = useNavigate();

  useEffect(()=>{

    const loggedIn = localStorage.getItem("loggedIn");

    if(!loggedIn){
      navigate("/");
    }

  },[navigate]);

  const logout = ()=>{

    localStorage.removeItem("loggedIn");

    navigate("/");

  };

  return(

    <div style={styles.page}>

      <div style={styles.container}>

        <h1>Welcome to Job Tracker</h1>

        <p>Manage your job applications easily</p>

        <div style={styles.buttons}>

          <button
            style={styles.button}
            onClick={()=>navigate("/dashboard")}
          >
            Open Dashboard
          </button>

          <button
            style={styles.button}
            onClick={()=>navigate("/add-job")}
          >
            Add Job
          </button>

          <button
            style={styles.logout}
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );

}

const styles={

  page:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#f1f5f9"
  },

  container:{
    textAlign:"center",
    background:"white",
    padding:"50px",
    borderRadius:"10px",
    boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
  },

  buttons:{
    marginTop:"30px",
    display:"flex",
    gap:"15px",
    justifyContent:"center"
  },

  button:{
    padding:"10px 20px",
    background:"#2563eb",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
  },

  logout:{
    padding:"10px 20px",
    background:"#ef4444",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
  }

};

export default Home;
