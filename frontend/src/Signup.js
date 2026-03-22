import React, { useState } from "react";
import API from "../services/api";

function Signup() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleSignup = async (e) => {
e.preventDefault();

try {
await API.post("/signup", { username, password });
alert("Signup successful! Please login.");
} catch {
alert("User already exists");
}
};

return (

<form onSubmit={handleSignup}>

<h2>Signup</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button type="submit">Signup</button>

</form>

);
}

export default Signup;