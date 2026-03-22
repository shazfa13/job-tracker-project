import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("client");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password
      });

      if (res.data.message === "Login successful") {

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data.user_id);

        if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }

      }

    } catch {

      alert("Invalid Login");

    }

  };

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h2>Job Tracker Login</h2>

        <input
          style={styles.input}
          placeholder="Username"
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={() => { setSelectedRole("client"); handleLogin(); }}>
          Login as Client
        </button>

        <button style={{...styles.button, marginTop: "10px"}} onClick={() => { setSelectedRole("admin"); handleLogin(); }}>
          Login as Admin
        </button>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>

      </div>

    </div>

  );
}

const styles = {

  page:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#f1f5f9"
  },

  card:{
    background:"white",
    padding:"40px",
    borderRadius:"10px",
    width:"320px",
    textAlign:"center",
    boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
  },

  input:{
    width:"100%",
    padding:"10px",
    margin:"10px 0",
    borderRadius:"5px",
    border:"1px solid #ccc"
  },

  button:{
    width:"100%",
    padding:"10px",
    background:"#2563eb",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
  }

};

export default Login;

