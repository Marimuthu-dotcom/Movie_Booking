import { useState } from "react";
import styles1 from "../styles/LoginPage.module.css";
import axios from "axios";

function PasswordPage({ userEmail,onClose ,setIsLogged }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [icon, setIcon] = useState(true);
  const [confIcon, setconfIcon] = useState(true);
  
  const handleSubmit=async (e)=>{
    e.preventDefault();

    const maxLength = 8;
    const checkNum=(password.match(/\d/g)||[]).length;
    const checkAlpha=(password.match(/[a-zA-Z]/g)||[]).length;
    const checkSpecial=(password.match(/[@$!%*?&]/g)||[]).length;   

    if(password.length<maxLength ){
      alert("Password must be at least 8 characters");
      return;
    }
    if(checkNum<2){
      alert("Password must contain at least two numbers");
      return;
    }
    if(checkAlpha<5){
      alert("Password must contain at least five letters");
      return;
    }
    if(checkSpecial<1){
      alert("Password must contain at least one special character");
      return;
    }
    
    try{
    const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/set-password`,{
        email:userEmail,
        password
    });
    localStorage.setItem("token",res.data.token);
    setIsLogged(true);
   }catch(err){
    alert(err.response?.data.error || "Error setting password");
    return;
   }
    alert("Password is valid ✅");
    onClose();
  }

  return (
    <div className={styles1.modal}>
      <button className={styles1.closeBtn} style={{color:"white",fontSize:"1.2rem"}} onClick={onClose}>✖</button>
      <h2 style={{ fontFamily: "Roboto, serif", fontWeight: "500" ,color:"white"}}>Set Password</h2>
      <div className={styles1.formBox}>
      <form className={styles1.form} onSubmit={handleSubmit} autoComplete="off">
      <div style={{ position: "relative", width: "100%" }}>
        <input type={icon?"password":"text"} placeholder="Password" value={password} autoComplete="off" onChange={e => setPassword(e.target.value)} required/>
        <span 
        onClick={()=>setIcon(!icon)}
        style={{
            position: "absolute",
            right: "10px",
            top:"10px",
            cursor: "pointer",
            fontSize: "1.1rem",
            color: "gray"
        }}>{icon?<i className="bi bi-eye-slash-fill"></i>:<i className="bi bi-eye-fill"></i>}</span>
      </div>
      <div style={{ position: "relative", width: "100%" }}>
        <input type={confIcon?"password":"text"} placeholder="Confirm Password" value={confirm} autoComplete="off" onChange={e => setConfirm(e.target.value)} required/>
        <span 
        onClick={()=>setconfIcon(!confIcon)}
        style={{
            position: "absolute",
            right: "10px",
            top:"10px",
            cursor: "pointer",
            fontSize: "1.1rem",
            color: "gray"
        }}>{confIcon?<i className="bi bi-eye-slash-fill"></i>:<i className="bi bi-eye-fill"></i>}</span>
      </div>
      <button type="submit">Submit</button>
      </form>
      </div>
    </div>
  );
}

export default PasswordPage;
