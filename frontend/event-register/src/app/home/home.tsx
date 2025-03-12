"use client";

import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import {Button, Heading,Spinner} from "@radix-ui/themes";
import {ExitIcon, HomeIcon, Pencil2Icon,CalendarIcon, ShuffleIcon, PersonIcon,ChatBubbleIcon} from "@radix-ui/react-icons";
import Image from 'next/image'
import MyInscription from '../myinscriptions/my_inscription';
import Stadistics from '../stadistic/stadistics';
import Events from '../events/event';
import MyEvents from '../myevents/my_events';
import Review from '../review/review';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isOrganizer, setOrganizer] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>('home');

  
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
            
            const storedValue = localStorage.getItem("organizer");
              if (storedValue !== null) {
                setOrganizer(false);
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

    localStorage.removeItem('user_name');
    localStorage.removeItem('token');

    setLogout(true);
    setTimeout(() => {  
     redirect("/login");}, 1000);
  }

  const handleEvents = async() => {
    setCurrentContent('events')
  }

  const handleMyEvents = async() => {
    setCurrentContent('my_events')
  }

  const handleMyInscriptions = async() => {
    setCurrentContent('my_inscriptions');
  }

  const handleStadistics = async() => {
    setCurrentContent('stadistics');
  }

  const handleReview = async() => {
    setCurrentContent('review');
  }

  const handleProfile = async() => {
    setCurrentContent('profile');
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
  
  const renderContent = () => {
    switch (currentContent) {
      case 'events':
        return <Events/>;
      case 'my_events':
        return <MyEvents/>;
      case 'my_inscriptions':
        return <MyInscription />;
      case 'stadistics':
        return <Stadistics />;
        case 'review':
        return <Review/>;
        case 'profile':
        return <div>{username} {isOrganizer}</div>;
        default:
        return <Events/>;
    }
  }

  
  return (<div id='events-main-div' className="flex flex-row">
                <div id= "events-menu-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
                 <Button variant='outline' id="home-button" className='gap-2'
                 type="submit"
                 onClick={handleEvents}>
                  <HomeIcon/>
                 </Button>  
                 {!isOrganizer ?  
                    <><Button variant='outline' id="myinscriptions-button" className='gap-2'
                        type="submit"
                        onClick={handleMyInscriptions}>
                        <Pencil2Icon />
                    </Button><Button variant='outline' id="myinscriptions-button" className='gap-2'
                        type="submit"
                        onClick={handleReview}>
                        <ChatBubbleIcon />
                    </Button></> 
                    :
                    <Button variant='outline' id="myevents-button" className='gap-2'
                        type="submit"
                        onClick={handleMyEvents}
                        >
                        <CalendarIcon />
                      </Button>
                 }   
                 <Button variant='outline' id="stadistics-button" className='gap-2'
                 type="submit"
                 onClick={handleStadistics}>
                  <ShuffleIcon/>
                 </Button>  
                 <Button variant='outline' id="profile-button" className='gap-2'
                 type="submit"
                 onClick={handleProfile}>
                  <PersonIcon/>
                 </Button>
                 <Button variant='outline' id="logout-button" className='gap-2'
                 onClick={handleLogout}
                 type="submit">
                  <ExitIcon/>
                 </Button>
                </div>
                  {renderContent()}
          </div>)
  

}
