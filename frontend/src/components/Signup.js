import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const navigate = useNavigate();

  const handleSignup = async () => {

    try {

      await axios.post("http://127.0.0.1:5000/signup", {
        username,
        password,
        role
      });

      alert("Account Created Successfully");

      navigate("/");

    } catch {

      alert("User already exists");

    }

  };

  const handleResetDB = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/reset-db");
      alert("Database reset successfully! You can now create new accounts.");
      window.location.reload();
    } catch (error) {
      alert("Failed to reset database");
    }
  };

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h2>Create Account</h2>

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

        <select
          style={styles.input}
          value={role}
          onChange={(e)=>setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>

        <button
          style={styles.button}
          onClick={handleSignup}
        >
          Signup
        </button>

        <button
          style={{...styles.button, backgroundColor: "#dc2626", marginTop: "10px"}}
          onClick={handleResetDB}
        >
          Reset Database (Development Only)
        </button>

        <p>
          Already have an account? <Link to="/">Login</Link>
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

export default Signup;
