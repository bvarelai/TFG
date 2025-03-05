"use client";

import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import {Button, Heading,Spinner, Box, Card, Flex, Text, Avatar} from "@radix-ui/themes";
import {ExitIcon} from "@radix-ui/react-icons";

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
            const storedUsername = localStorage.getItem('user_name');
            setUsername(storedUsername);

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

    localStorage.removeItem('user_name');
    localStorage.removeItem('token');

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
  return (<div id='events-main-div' className="flex flex-col">
            <div id = "events-third-div" className="flex items-center justify-between gap-5">                        
                <div id = "events-third-div-1" className='flex items-center'>
                  <Heading weight="bold" id="events_title">
                  SportNexus
                  </Heading>  
                </div>
                <div id = "events-third-div-2" className='flex items-center gap-5'>
                    <Box maxWidth="240px" id="events-box" className='flex flex-col relative '>
                      <Card className="flex flex-col gap-3 p-3 border-2 border-solid border-white/[.08]">
                        <Flex align="center" className='gap-2.5'>
                        <Avatar variant= "soft" className="AvatarFallback relative top-[-5px]" color="indigo" highContrast 
                          fallback={
                          <Box width="24px" height="24px">
                            <svg viewBox="0 0 64 64" fill="currentColor">
                              <path d="M41.5 14c4.687 0 8.5 4.038 8.5 9s-3.813 9-8.5 9S33 27.962 33 23 36.813 14 41.5 14zM56.289 43.609C57.254 46.21 55.3 49 52.506 49c-2.759 0-11.035 0-11.035 0 .689-5.371-4.525-10.747-8.541-13.03 2.388-1.171 5.149-1.834 8.07-1.834C48.044 34.136 54.187 37.944 56.289 43.609zM37.289 46.609C38.254 49.21 36.3 52 33.506 52c-5.753 0-17.259 0-23.012 0-2.782 0-4.753-2.779-3.783-5.392 2.102-5.665 8.245-9.472 15.289-9.472S35.187 40.944 37.289 46.609zM21.5 17c4.687 0 8.5 4.038 8.5 9s-3.813 9-8.5 9S13 30.962 13 26 16.813 17 21.5 17z" />
                            </svg>
                          </Box>
                        }
                        ></Avatar>
                        <Box>
                            <Text as="div" size="2" weight="bold" className='relative top-[-5px]'>
                              {username}
                            </Text>
                        </Box>
                        </Flex>
                      </Card>
                    </Box>
                </div>                
           </div>
            <div id = "events-fourth-div" className='flex flex-rows '>
                <div id= "events-menu-div" className='flex flex-col border-4 border-solid border-white/[.08]'>
                 <Button variant='outline' id="logout-button" className='gap-2'
                 onClick={handleLogout}
                 type="submit">
                  <ExitIcon/>
                  Cerrar Sesión
                 </Button>  
                </div>
                <div id = "events-list-div" className='flex flex-col border-4 border-solid border-white/[.08]'>
                </div>
            </div>
          </div>)
  

}
