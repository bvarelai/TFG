"use client";

import { redirect } from 'next/navigation';
import { use, useEffect, useState } from "react";
import {Button} from "@radix-ui/themes";
import {ExitIcon, HomeIcon, Pencil2Icon,CalendarIcon, ShuffleIcon, RowsIcon} from "@radix-ui/react-icons";
import MyInscription from '../myinscriptions/my_inscription';
import Stadistics from '../stadistic/stadistics';
import Events from '../event/event';
import MyEvents from '../myevents/my_events';
import Review from '../review/review';
import Logout from '../logout/logout';


export default function Home() {
  
  const [username, setUsername] = useState<string | null>(null);
  const [isOrganizer, setOrganizer] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>('home');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState(false); 

  useEffect(() => {
    const updateVisibleEvents = () => {
      if (window.matchMedia("(max-width: 707px)").matches) {
         setIsSmallScreen(true);
      } else if (window.matchMedia("(min-width: 707px) and (max-width: 1920px)").matches) {
        setIsSmallScreen(false); 
      } 
   };   
   updateVisibleEvents();
  },[]);

  useEffect(() => {
    const checkAuth = async () => {

      const response = await fetch(`http://localhost:8000/protected`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
          redirect("/login"); 
          return;
      }
      const data = await response.json();
      const user_name = sessionStorage.getItem("user_name")
      if(user_name)
        setUsername(user_name);
      const organizer = sessionStorage.getItem("organizer")
      if(organizer) 
        setOrganizer(JSON.parse(organizer));
            
    };
    checkAuth();
  }, []);

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
  
  const handleLogout = async () => {      
    setCurrentContent('logout')
  }
  
  const renderContent = () => {
    switch (currentContent) {
      case 'events':
        return <Events onGoToReview={handleReview} setSelectedEvent={setSelectedEvent}  />;
      case 'my_events':
        return <MyEvents onGoToReview={handleReview} setSelectedEvent={setSelectedEvent} />;
      case 'my_inscriptions':
        return <MyInscription onGoToReview={handleReview} setSelectedEvent={setSelectedEvent} />;
      case 'stadistics':
        return <Stadistics />;
      case 'review':
        return <Review event={selectedEvent}/>;
      case 'logout' :
        return <Logout/>
        default:
        return <Events onGoToReview={handleReview} setSelectedEvent={setSelectedEvent}  />;
    }
  }
  return (
    isSmallScreen ? (
      <div id='events-main-div' className="flex flex-col">
          {renderContent()}
          <div id="events-menu-div" className="flex flex-row border-2 border-solid border-white/[.08]">
            <Button variant="outline" id="home-button" className="gap-2"
              type="submit"
              onClick={() => { handleEvents(); setSelectedButton("home-button"); }}
              data-state={selectedButton === "home-button" ? "on" : "off"}
              >
              <HomeIcon id="menu-icon" />
            </Button>  
            {!isOrganizer ?  
              <><Button variant='outline' id="myinscriptions-button" className='gap-2'
                type="submit"
                onClick= {() => {handleMyInscriptions(); setSelectedButton("myinscriptions-button")}}
                data-state={selectedButton === "myinscriptions-button" ? "on" : "off"}
                >  
                <Pencil2Icon id="menu-icon" />
              </Button>
              </> :
              <Button variant='outline' id="myevents-button" className='gap-2'
                type="submit"
                onClick= {() => {handleMyEvents(); setSelectedButton("myevents-button")}}
                data-state={selectedButton === "myevents-button" ? "on" : "off"}
                >
                <CalendarIcon id="menu-icon"  />
              </Button>
            }   
            <Button variant='outline' id="stadistics-button" className='gap-2'
              type="submit"
              onClick= {() => {handleStadistics(); setSelectedButton("stadistics-button")}}
              data-state={selectedButton === "stadistics-button" ? "on" : "off"}
              >
              <ShuffleIcon id="menu-icon" />
            </Button>  
            <Button variant='outline' id="logout-button" className='gap-2'
              onClick= {() => {handleLogout(); setSelectedButton("logout-button")}}
              data-state={selectedButton === "logout-button" ? "on" : "off"}
              type="submit"
              >
              <ExitIcon id="menu-icon" />
            </Button>
          </div>
      </div>
    ) : (
        <div id='events-main-div' className="flex flex-row">
          <div id="events-menu-div" className="flex flex-col border-2 border-solid border-white/[.08]">
            <Button variant="outline" id="home-button" className="gap-2"
              type="submit"
              onClick={() => { handleEvents(); setSelectedButton("home-button"); }}
              data-state={selectedButton === "home-button" ? "on" : "off"}
              >
              <HomeIcon/>
            </Button>  
            {!isOrganizer ?  
              <><Button variant='outline' id="myinscriptions-button" className='gap-2'
                type="submit"
                onClick= {() => {handleMyInscriptions(); setSelectedButton("myinscriptions-button")}}
                data-state={selectedButton === "myinscriptions-button" ? "on" : "off"}
                >  
                <Pencil2Icon />
              </Button>
              </> :
              <Button variant='outline' id="myevents-button" className='gap-2'
                type="submit"
                onClick= {() => {handleMyEvents(); setSelectedButton("myevents-button")}}
                data-state={selectedButton === "myevents-button" ? "on" : "off"}
                >
                <CalendarIcon />
              </Button>
            }   
            <Button variant='outline' id="stadistics-button" className='gap-2'
              type="submit"
              onClick= {() => {handleStadistics(); setSelectedButton("stadistics-button")}}
              data-state={selectedButton === "stadistics-button" ? "on" : "off"}
              >
              <ShuffleIcon/>
            </Button>  
            <Button variant='outline' id="logout-button" className='gap-2'
              onClick= {() => {handleLogout(); setSelectedButton("logout-button")}}
              data-state={selectedButton === "logout-button" ? "on" : "off"}
              type="submit"
              >
              <ExitIcon/>
            </Button>
          </div>
        {renderContent()}
      </div>
     )
  )
}
