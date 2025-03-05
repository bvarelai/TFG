"use client";

import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';
import Link from 'next/link'
import { EyeClosedIcon, EyeOpenIcon} from "@radix-ui/react-icons"
import { Button} from "@radix-ui/themes";

export default function Login() {
  const [user_name, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
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
    localStorage.setItem('user_name', user_name);  

    setLoading(true);
    setError('');
    setToken(true);
    redirect('/events');   
    }
  
  return (
    <form 
    id = "login-form"
    className="flex grid grid-rows-[10px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-10 "
    onSubmit={handleSubmit}>
      <div 
        id = "login-div"
        className="flex flex-col gap-5 row-start-2 items-center border-2 border-solid border-white/[.08]">                                         
          <label id="label-login"> User Login</label>
          <div className="flex flex-col gap-6 items-center relative"> 
            <input className="relative top-[-120px] transparent"
              id = "user_name"  
              name = "user_name"
              placeholder="nombre"
              type="text"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input className="relative top-[-120px]"
              id = "password"
              name= "password"
              placeholder="contraseña"
              type={visible? "text": "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />     
            <span className="absolute top-[-65px] right-0 mr-1 cursor-pointer"            
            onClick={() => setVisible(!visible)}>
              {visible ? <EyeOpenIcon color="violet" /> : <EyeClosedIcon color="violet"/>}
            </span>              
          </div>        
          <div className="flex flex-col items-center gap-3 relative ">
                <Button variant="solid"
                color="violet"
                id = "login-button"
                type = "submit"  
                className="relative top-[-45px] rounded-full border border-solid  dark:border-white/[.145] flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-40"   
                disabled={loading}>  
                  {loading ? "..." : "Iniciar Sesión"} 
                </Button>
                <Link id= "link-login" className="relative top-[-35px]" href="/register">No tienes cuenta?</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {token && <p style={{ color: "green" }}>Login successful</p>}   
          </div>
      </div> 
  </form>

    /*
    
  */



  );
};