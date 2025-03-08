"use client";

import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';
import { Button, Text, Flex} from "@radix-ui/themes";
import { Checkbox } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";


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
  const [organizer, setOrganizer] = useState<boolean>(false);

  
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
       "country"  : country,
       "is_organizer" : organizer
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
        className="flex flex-col gap-10 row-start-2 items-center border-2 border-solid border-white/[.08]">                                
          <label id="label-register"> Registro de Usuario</label>
          <div className="flex flex-col gap-6 items-center relative"> 
            <input className="relative top-[-110px]"
              id = "user_name"  
              name = "user_name"
              placeholder="nombre"
              type="text"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input className="relative top-[-110px]"
              id = "password"
              name= "password"
              placeholder="contraseña"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input className="relative top-[-110px]"
              id = "age"
              name= "age"
              placeholder="edad"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input className="relative top-[-110px]"
              id = "city"
              name= "age"
              placeholder="ciudad *"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input className="relative top-[-110px]"
              id = "autonomous_community"
              name= "autonomous_community"
              placeholder="comunidad autónoma *"
              type="text"
              value={autonomous_community}
              onChange={(e) => setAutonomousCommunity(e.target.value)}
            />
            <input className="relative top-[-110px]"
              id = "country"
              name= "country"
              placeholder="país"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
             <div className="flex flex-rows gap-2.5 relative top-[-80px] items-center"
             onClick={() => setOrganizer(!organizer)}>
              <Text className="Label" htmlFor="c1">
                Ser organizador
              </Text>
              {!organizer ? <Checkbox.Root className="CheckboxRoot" id="checkbox-register" >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root> : <Checkbox.Root className="CheckboxRoot" defaultChecked>
                <Checkbox.Indicator className="CheckboxIndicator">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>}
              
             </div>      
          </div>        
          <div className="flex flex-col items-center relative">
                <Button
                color="violet"
                id = "register-button"
                type = "submit"  
                className=" relative top-[-55px] rounded-full border-2 border-solid  dark:border-white/[.145] transition-colors flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"   
                disabled={loading}>  
                  {loading ? "..." : "Registrarse"} 
                </Button>
                {error && <label id = "p-red" style={{ color: "red" }}>{error}</label>}
                {sucess && <label id = "p-green" style={{ color: "green" }}>Register successfull</label>}   
          </div>
      </div> 
  </form>

    /*
    
  */



  );
};