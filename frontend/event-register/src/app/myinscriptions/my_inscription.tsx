"use client"
import { Heading, Box} from "@radix-ui/themes";
import { useState, useEffect} from "react";
import { MixIcon } from "@radix-ui/react-icons";
import { DataTable } from "../table/data-table";
import { columns, Inscription } from "../table/columns"


async function getData(): Promise<Inscription[]> {
   // Fetch data from your API here.
   return [
     {
       event_id: 12,
       inscription_description: "JAJAJAJ XD",
       inscription_date: "m@example.com",
     },
     // ...
   ]
}

export default function MyInscription() {
   
   const [inscriptions, setInscriptions] = useState<any[]>([]);
   const [notification, setNotification] = useState<string>("");

   useEffect(()  => {
      findMyInscription();
   },[])
   
   const findMyInscription = async () => { 
      
      const user_id = localStorage.getItem('user_id');

      const responseInscription = await fetch(`http://localhost:8000/inscription/find/${user_id}` , {
         method: 'GET',
      });

      if (!responseInscription.ok){
         setNotification("No inscriptions to show")
      }

      const data = await responseInscription.json();
      setInscriptions(data) 
   }

   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative">
            <Heading id="heading-events">My inscriptions</Heading>  
      </div>
      <div id = "events_disp" className="flex flex-row"> 
         {inscriptions.length > 0 ? (
            inscriptions.map((inscription) => (
               <DataTable key = {inscription.event_id} columns={columns} data={inscriptions} />
           ))) : (
               <Box
                  id="no-box-event"
                  className="flex flex-col gap-5 border-2 border-solid border-white/[.08]"
                  width="64px"
                  height="100px">
                  <MixIcon id = "no-data-icon"/>
                  {notification && <label id= "label-no-data">{notification}</label>}               
               </Box>
           )
         }   
      </div>  
   </div>
   )
}