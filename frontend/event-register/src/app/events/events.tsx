"use client";

import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import {Button, Heading,Spinner, Section} from "@radix-ui/themes";

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [logout, setLogout] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {

        const response = await fetch("http://localhost:8000/protected", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                redirect("/protected"); 
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);

            if (!data.token) {
                throw new Error("Token inválido");
            }
            setTimeout(() => {              
              setLoading(false);
            },2000)
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {      


    const username = localStorage.getItem('user_name');

    const response = await fetch(`http://localhost:8000/user/logout/${username}`, {
      method: "POST",
      credentials : "include"});

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }
      
    localStorage.removeItem('token');
    localStorage.removeItem('user_name'); 
    setLogout(true);
    setTimeout(() => {  
     redirect("/login");}, 1000);
  }

  if (loading) {
    return (
      <div id="events-first-div" className="min-h-screen flex flex-col justify-center items-center">
         <div id="events-second-div" className="flex flex-col relative items-center border-2 border-solid border-white/[.08] relative">
              <Heading weight="bold" >
              Cargando eventos...
              </Heading>       
              <Spinner id="spinner" size="2" loading={true} />         
         </div>
      </div>
    )  
  }
  if (logout) {
     return(
        <div id="events-first-div" className="min-h-screen flex flex-col justify-center items-center">
            <div id="events-second-div" className="flex flex-col items-center border-2 border-solid border-white/[.08]">
              <Heading weight="bold">
                Cerrando sesión...
              </Heading>
              <Spinner id="spinner" size="2" loading={true} /> 
            </div>
        </div>
     )
  }
  return (<div>
            <div>
              <Button
                color="violet"
                id = "logout-button"
                type = "submit" 
                className="rounded-full border border-solid h-10 sm:h-10 px-4 sm:px-5 sm:min-w-25" 
                onClick={handleLogout}>
                Cerrar Sesión
              </Button>
              {username && <span>Bienvenido, {username}!</span>} {/* Mostrar el nombre de usuario */}
            </div>
            <div>
              <Heading>
                Pagina Protegida
              </Heading>
            </div>
            <div>

            </div>
          </div>)
  

}
