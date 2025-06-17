"use client";

import { useState} from "react";
import { redirect } from 'next/navigation';
import { EyeClosedIcon, EyeOpenIcon, ExclamationTriangleIcon} from "@radix-ui/react-icons"
import { Button, Callout} from "@radix-ui/themes";
import Image from 'next/image'

export default function Login() {
  const [user_name, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  
  const validateForm = (): boolean => {
    
    if (!user_name || !password) {
      setError("Username and password are required");
      setTimeout(() => {
        setError("");
      },2000)
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
    try{
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
        setError('User and password incorrects');
        setTimeout(() => {
          setError("");
       },2000)
        return;
      }
      let data;
      try {
        data = await response.json(); 
      } catch (jsonError) {
        setLoading(false);
        setError('Error parsing server response');
        return;
      }
      const loginDate = new Date().toISOString();
      sessionStorage.setItem("user_id", data.user_id.toString());
      sessionStorage.setItem("user_name", user_name);
      sessionStorage.setItem("organizer", data.organizer);
      sessionStorage.setItem("login_date", loginDate);
      setLoading(true);
      setError('');
      setToken(true);
      redirect('/home');   
    } catch (error) {
        setLoading(false);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setError('The server is down, please try again later.');
          setTimeout(() => {
            setError("");
          },2000)
        }
        else {
          setLoading(true);
          redirect('/home');   
        } 
      }
    }

    const goToRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault(); 
      setLoading(false);
      setError('');
      redirect('/register');
    }

  return (
    <form 
    id = "login-form"
    className="flex grid grid-rows-[10px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-10 "
    onSubmit={handleSubmit}>
      <div 
        id = "login-div"
        className="flex flex-col gap-5 row-start-2 relative items-center border-2 border-solid border-white/[.08]">                                         
           <Image className="relative top-[-35px]"
              src="/logo.png"
              width={300}
              height={300}
              alt="Application`s Logo"
              id="logo-login"
           />  
          <div className="flex flex-col gap-6 items-center relative"> 
            <input className="relative top-[-50px] transparent input-primary"
              id = "input-login"  
              name = "user_name"
              placeholder="Username"
              type="text"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input className="relative top-[-60px] input-secondary"
              id = "input-login"
              name= "password"
              placeholder="Password"
              type={visible? "text": "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />     
            <span className="absolute top-[+2px] right-0 mr-1 cursor-pointer"            
            onClick={() => setVisible(!visible)}>
              {visible ? <EyeOpenIcon id="eye-open" color="plum" /> : <EyeClosedIcon id="eye-close" color="plum"/>}
            </span>              
          </div>        
          <div id = "login-div-2" className="flex flex-col items-center gap-3 relative ">
                <Button variant="solid"
                id = "login-button"
                type = "submit"  
                className="relative top-[-40px] rounded-full flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-40 button-primary"   
                disabled={loading}>  
                  {loading ? "..." : "Login"} 
                </Button>
                <div id="span-or" className="relative top-[-40px]">
                 <span>or</span>
                </div>
                <Button variant="soft" color = "pink"
                id ="login-button"
                type = "submit"
                className="relative top-[-40px] rounded-full flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-40 button-secondary"   
                onClick={goToRegister}
                > Create a new account </Button>
                {error &&
                 <div id = "p-red" data-testid="error-message">
                    <Callout.Root id= "callout-root-login" color="red" size="2" variant="soft" className="flex items-center ">
                      <Callout.Icon className="callout-icon-large" >
                        <ExclamationTriangleIcon  />
                      </Callout.Icon>
                      <Callout.Text className="callout-text-large"> {error} </Callout.Text> 
                    </Callout.Root>
                 </div>}
          </div>
      </div> 
  
  
  </form>

    /*
       */



  );
};