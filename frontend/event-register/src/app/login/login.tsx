"use client";

import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';
import Link from 'next/link'
import { middleware } from "../context/authContext";
import { NextRequest } from "next/server";

export default function Login() {
  const [user_name, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<boolean>(false);
  //const {login} = useAuthContext();
  
  const validateForm = (): boolean => {
    
    if (!user_name || !password) {
      setError("Usuario y/o contraseña requeridos");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setToken(false);
    setError("")

    const formDetails = new URLSearchParams();
    formDetails.append("username", user_name);
    formDetails.append("password", password);

    
    const response = await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
        credentials : "include",
    });
                 
    if (!response.ok) {
      setLoading(false);
      setError('Usuario y/o contraseña incorrectos');
      return;
    }
    const data = await response.json();
    localStorage.setItem('token', data.access_token);  
    const token = localStorage.getItem('token');
 
   const responseToken = await fetch(`http://localhost:8000/user/token/${token}`, {
      method: 'GET'});
      
    if (!responseToken.ok) {
      setLoading(false);
      setError('Token verification failed');
      return;
    }  
    setLoading(true);
    setError('');
    setToken(true);
    redirect('/events');   
    }
  
  return (
    <form 
    id = "welcome-form"
    className="flex grid grid-rows-[10px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)] "
    onSubmit={handleSubmit}>
      <div 
        id = "welcome-div"
        className="flex flex-col gap-5 row-start-2 items-center font-[family-name:var(--font-geist-mono)] border-4 border-solid border-white/[.08]  ">                                         
          <label id="label-login"> Login</label>
          <div className="flex flex-col gap-6 items-center relative"> 
            <input className="relative top-[-100px]"
              id = "user_name"  
              name = "user_name"
              placeholder="Nombre"
              type="text"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input className="relative top-[-100px]"
              id = "password"
              name= "password"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />                        
          </div>        
          <div className="flex flex-col items-center gap-3 relative ">
                <button
                id = "login-button"
                type = "submit"  
                className="relative top-[-40px] rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"   
                disabled={loading}>  
                  {loading ? "..." : "Iniciar Sesión"} 
                </button>
                <p className=' relative top-[-40px]  my-4 hover:border-transparent'>No tienes cuenta? &nbsp; 
                  <Link id= "link-login" className=" rounded-full border border-solid border-black/[.08] h-12 w-64 px-4 sm:px-5" href="/register">Registrate</Link>
                </p>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {token && <p style={{ color: "green" }}>Login successful</p>}   
          </div>
      </div> 
  </form>

    /*
    
  */



  );
};