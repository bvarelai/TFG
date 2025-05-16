"use client";

import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';
import { Button, Text, Callout } from "@radix-ui/themes";
import { Checkbox } from "radix-ui";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Image from 'next/image'


export default function Login() {
  
  const [user_name, setUserName] = useState<string>("");
  const [user_surname, setUserSurname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phonePrefix, setPhonePrefix] = useState("+34");
  const [city, setCity] = useState<string>("");
  const [autonomous_community, setAutonomousCommunity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sucess, setSucess] = useState<boolean>(false);
  const [organizer, setOrganizer] = useState<boolean>(false);

  
  const validateForm = (): boolean => {
    
    if (!user_name ||!user_surname || !password || !age || !email || !phone || !city || !autonomous_community || !country) {
      setError("Data are required");
      setTimeout(() => {
        setError("");
     },2000)
      return false;
    }
    if (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 80){
      setError("Age value is not valid");
      setTimeout(() => {
        setError("");
      },2000)
      return false;
    }
  
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError("Email is not valid");
      setTimeout(() => {
        setError("");
      },2000)
      return false;
    }

    if (!/^[6-9]\d{2} \d{3} \d{3}$/.test(phone)) {
      setError("Phone number must be in format 600 123 456");
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
    setSucess(false);
    setError("")

    const formDetails = 
    {
       "user_name" : user_name,
       "user_surname" : user_surname,
       "password" : password,  
       "age" :  age,
       "email" : email,
       "phone" : phone, 
       "city": city,
       "autonomous_community"  : autonomous_community,
       "country"  : country,
       "is_organizer" : organizer
    } 

    const formDetailsLogin = new URLSearchParams();
    formDetailsLogin.append("username", user_name);
    formDetailsLogin.append("password", password);

    try{
      let response = await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDetails)
      });
                
      if (!response.ok) {
        setLoading(false);
        setError('User already exist');
        setTimeout(() => {
          setError("");
        },2000)
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
        setError('Incorrect user or/and password');
        setTimeout(() => {
          setError("");
        },2000)
        return;
      }
      const data = await responselogin.json();

      const loginDate = new Date().toISOString();
      sessionStorage.setItem("session_id", data.session_id);
      sessionStorage.setItem("user_id", data.user_id.toString());
      sessionStorage.setItem("user_name", user_name);
      sessionStorage.setItem("organizer", data.organizer);
      sessionStorage.setItem("login_date", loginDate);        
      setLoading(true);
      setError("");
      setSucess(true);
      redirect('/home'); 
    }
    catch (error) {
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
  return (
    <form 
    id = "register-form"
    className="flex grid grid-rows-[10px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-10] "
    onSubmit={handleSubmit}>
      <div 
        id = "register-div"
        className="flex flex-col gap-10 row-start-2 items-center border-2 border-solid border-white/[.08]">                                
          <Image className="relative top-[+35px]"
                src="/logo.png"
                width={300}
                height={300}
                alt="Application`s Logo"
                id = "image-login"  
          />   
          <div className="flex flex-col gap-6 items-center relative"> 
            <input className="relative top-[+0px]"
              id = "input_register"  
              name = "user_name"
              placeholder="Name"
              type="text"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
            />
             <input className="relative top-[-10px]"
              id = "input_register"  
              name = "user_surname"
              placeholder="Surname"
              type="text"
              value={user_surname}
              onChange={(e) => setUserSurname(e.target.value)}
            />
            <input className="relative top-[-20px]"
              id = "input_register"
              name= "password"
              placeholder="Password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input className="relative top-[-30px]"
              id = "input_register"
              name= "age"
              placeholder="Age"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input className="relative top-[-40px]"
              id = "input_register"
              name= "email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> 
            <input className="relative top-[-50px]"
              id = "input_register"
              name= "phone"
              placeholder="Ej: +34 600 123 456"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />  
            <input className="relative top-[-60px]"
              id = "input_register"
              name= "age"
              placeholder="City *"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input className="relative top-[-70px]"
              id = "input_register"
              name= "autonomous_community"
              placeholder="Autonomous Community *"
              type="text"
              value={autonomous_community}
              onChange={(e) => setAutonomousCommunity(e.target.value)}
            />
            <input className="relative top-[-80px]"
              id = "input_register"
              name= "country"
              placeholder="Country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
             <div id = "check-box-register" className="flex flex-rows gap-2.5 relative top-[-110px] items-center"
             onClick={() => setOrganizer(!organizer)}>
              <Text className="Label" htmlFor="c1">
                Be organizer
              </Text>
              {!organizer ? <Checkbox.Root className="CheckboxRoot" id="checkbox-root">
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
            id = "register-button"
            type = "submit"  
            className=" relative top-[-110px] rounded-full flex items-center justify-center hover:border-transparent text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-40"   
            disabled={loading}>  
              {loading ? "..." : "SignUp"} 
            </Button>
            {error &&
              <div id = "p-red" data-testid="error-message">
                  <Callout.Root id="callout-root-register" color="red" size="2" variant="soft" className="flex items-center ">
                    <Callout.Icon className="callout-icon-large" >
                      <ExclamationTriangleIcon  />
                    </Callout.Icon>
                    <Callout.Text className="callout-text-large"> {error} </Callout.Text> 
                  </Callout.Root>
              </div>} 
          </div>
      </div> 
  </form>
  );
};