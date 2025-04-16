"use client"
import { Heading, Box, Button,AlertDialog,Flex} from "@radix-ui/themes";
import { useState, useEffect} from "react";
import { MixIcon,LapTimerIcon,ClockIcon,SewingPinFilledIcon, TrashIcon} from "@radix-ui/react-icons";
import { Dialog } from "radix-ui";


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

   const deleteInscription = async (event_name: string, event_id: string) => {
      
      const user_id = localStorage.getItem('user_id');

      const responseDeleteInscription = await fetch(`http://localhost:8000/inscription/delete/${user_id}/${event_id}`, {
         method: 'DELETE',
      });

      if (!responseDeleteInscription.ok){
         setNotification("Error deleting inscription")
         return;
      }
      
      const reponseFindEvent = await fetch(`http://localhost:8000/event/find/name/${event_name}`,{
         method: 'GET',
      });
      
      if(!reponseFindEvent.ok){
         setNotification('Error finding event')
         return;
      }

      const data = await reponseFindEvent.json()

      const formDetailsEvent = {
         event_name: data.event_name,
         user_id: user_id,
         event_type: data.event_type,
         event_edition: data.event_edition,
         event_description: data.event_description,
         category: data.category,
         location: data.location,
         celebration_date: data.celebration_date,
         end_date: data.end_date,
         capacity: data.capacity + 1,
         organizer_by : data.organizer_by,
         duration : data.duration,
         event_full_description: data.event_full_description,
         language : data.language,
         is_free : data.is_free
      };
      const responseEvent = await fetch(`http://localhost:8000/event/update/${data.event_name}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetailsEvent)
      });   
      
      if(!responseEvent.ok){
         setNotification("Event cant update")
         return;
      }
   
      setInscriptions((prevInscriptions) => prevInscriptions.filter((inscription) => inscription.event_name !== event_name));
      findMyInscription();
   }


   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">Your inscriptions</Heading>  
      </div>
      <div id = "inscriptions_disp" className="flex flex-wrap">          
         {inscriptions.length > 0 ? (
            inscriptions.map((inscription) =>(
               <Dialog.Root key={inscription.event_name}>  
                  <Box
                     key={inscription.event_id}
                     id="box-myinscription"
                     className="flex flex-col border-2 border-solid border-white/[.08]"
                     width="64px"
                     height="100px"
                  >
                     <Dialog.Trigger asChild>              
                        <div>
                           <Heading className="flex items-center" id="heading-event-name">
                              Inscription in {inscription.event_name} 
                           </Heading>
                           <div className="flex flex-col px-2 py-2">
                              <div  id = "info-members-myinscription-div" className="flex flex-row items-center">
                                 <SewingPinFilledIcon/>
                                 <span id="event-date">{inscription.location}</span>   
                              </div>
                              <div  id = "info-date-myinscription-div"className="flex flex-row items-center">
                                 <LapTimerIcon/> 
                                 <span id="event-date">{inscription.inscription_date.split("T")[0]}</span>  
                              </div>   
                              <div  id = "info-clock-myinscription-div"className="flex flex-row items-center">
                                 <ClockIcon/> 
                                 <span id="event-date">{inscription.inscription_date.split("T")[1]}</span>  
                              </div>
                           </div>
                        </div>
                     </Dialog.Trigger>    
                     <div id="buttons-myevent" className="flex flex-row gap-2 items-center">
                           <AlertDialog.Root>
                              <AlertDialog.Trigger>
                                 <TrashIcon id="icon-myinscription" />
                              </AlertDialog.Trigger>
                              <AlertDialog.Content className="AlertDialogContent">
                                 <AlertDialog.Title className="AlertDialogTitle">Delete inscription</AlertDialog.Title>
                                 <AlertDialog.Description className="AlertDialogDescription" size="2">
                                    Are you sure? This inscription will be deleted permanently.
                                 </AlertDialog.Description>
                                    <Flex gap="3" mt="4" justify="end">
                                       <AlertDialog.Cancel>
                                          <Button  id = "cancel-button" variant="outline" color="gray">
                                             Cancel
                                          </Button>
                                       </AlertDialog.Cancel>
                                       <AlertDialog.Action>
                                          <Button onClick={() =>deleteInscription(inscription.event_name, inscription.event_id)} variant="solid" color="red">
                                             Delete
                                          </Button>
                                       </AlertDialog.Action>
                                    </Flex>
                                 </AlertDialog.Content>
                           </AlertDialog.Root>
                     </div>   
               </Box>
               <Dialog.Portal>
               <Dialog.Overlay className="DialogOverlay" />
                  <Dialog.Content className="DialogContentMyEvent border-2 border-solid border-white/[.08]">
                     <Dialog.Title className="DialogTitle">Information about inscription</Dialog.Title>
                     <Dialog.Description className="DialogDescription">
                           Information about {inscription.event_name} inscription
                     </Dialog.Description>
                     <Dialog.Content>                        
                        <div className="flex flex-col gap-3">
                           <div className="flex flex-row gap-1 items-center">
                              <SewingPinFilledIcon/>
                              <span> {inscription.location}</span>  
                           </div> 
                           <div className="flex flex-col gap-3">
                              Registration date
                              <div className="flex flex-row gap-1 items-center">                                            
                                 <LapTimerIcon/>
                                 <span>{inscription.inscription_date.split("T")[0]}</span>   
                              </div>
                              <div className="flex flex-row gap-1 items-center">
                                 <ClockIcon/>
                                 <span>{inscription.inscription_date.split("T")[1]}</span>
                              </div>
                           </div>
                        </div>
                     </Dialog.Content>
                  </Dialog.Content>            
               </Dialog.Portal>
               </Dialog.Root>    
            ))
         ) : (
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