"use client";

import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';
import { Button} from "@radix-ui/themes";

export default function Login() {
  const [user_name, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [autonomous_community, setAutonomousCommunity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sucess, setSucess] = useState<boolean>(false);

  
  const validateForm = (): boolean => {
    
    if (!user_name || !password || !age || !country) {
      setError("Los datos del usuario son requeridos");
      return false;
    }
    if (isNaN(Number(age))){
      setError("La edad debe ser númerica");
      return false;
    }    
    setError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setSucess(false);
    setError("")

    const formDetails = 
    {
       "user_name" : user_name,
       "password" : password,  
       "age" :  age,
       "city": city,
       "autonomous_community"  : autonomous_community,
       "country"  : country
    } 

    const formDetailsLogin = new URLSearchParams();
    formDetailsLogin.append("username", user_name);
    formDetailsLogin.append("password", password);

    
      let response = await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDetails)
      });
              
      if (!response.ok) {
        setLoading(false);
        setError('Ya existe un usuario con estos datos');
        return;
      }
  
      const responselogin = await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetailsLogin,
        credentials : "include",
    });
                 
    if (!responselogin.ok) {
      setLoading(false);
      setError('Usuario y/o contraseña incorrectos');
      return;
    }
    const data = await responselogin.json();
    localStorage.setItem('user_name', user_name); 
      
    setLoading(true);
    setError("");
    setSucess(true);
    redirect('/events'); 
  }
  return (
    <form 
    id = "register-form"
    className="flex grid grid-rows-[10px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-10] "
    onSubmit={handleSubmit}>
      <div 
        id = "register-div"
        className="flex flex-col gap-10 row-start-2 items-center">                                
          <label id="label-register"> Register</label>
          <div className="flex flex-col gap-6 items-center relative"> 
            <input className="relative top-[-90px]"
              id = "user_name"  
              name = "user_name"
              placeholder="nombre"
              type="text"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input className="relative top-[-90px]"
              id = "password"
              name= "password"
              placeholder="contraseña"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input className="relative top-[-90px]"
              id = "age"
              name= "age"
              placeholder="edad"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input className="relative top-[-90px]"
              id = "city"
              name= "age"
              placeholder="ciudad *"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input className="relative top-[-90px]"
              id = "autonomous_community"
              name= "autonomous_community"
              placeholder="comunidad autónoma *"
              type="text"
              value={autonomous_community}
              onChange={(e) => setAutonomousCommunity(e.target.value)}
            />
            <input className="relative top-[-90px]"
              id = "country"
              name= "country"
              placeholder="país"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>        
          <div className="flex flex-col items-center relative">
                <Button
                color="violet"
                id = "register-button"
                type = "submit"  
                className=" relative top-[-55px] rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"   
                disabled={loading}>  
                  {loading ? "..." : "Registrarse"} 
                </Button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {sucess && <p style={{ color: "green" }}>register successful</p>}   
          </div>
      </div> 
  </form>

    /*
    
  */



  );
};