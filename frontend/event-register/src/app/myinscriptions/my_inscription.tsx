"use client"
import { Heading, Box, Button,AlertDialog,Flex, Badge} from "@radix-ui/themes";
import { useState, useEffect} from "react";
import { MixIcon,LapTimerIcon,ClockIcon,SewingPinFilledIcon, TrashIcon} from "@radix-ui/react-icons";
import { Dialog } from "radix-ui";


export default function MyInscription({ onGoToReview, setSelectedEvent }: { onGoToReview: () => void; setSelectedEvent: (event: any) => void }) {
   
   const [inscriptions, setInscriptions] = useState<any[]>([]);
   const [notification, setNotification] = useState<string>("");
   const [events, setEvents] = useState<any>([]);

   useEffect(() => {
      findMyInscription();
   }, []);

   useEffect(() => {
      const updateInscriptionAutomatically = async () => {
         const user_id = localStorage.getItem('user_id');
         if(inscriptions != null) {
            for (const inscription of inscriptions) {
               const eventDetails = await findEventInscription(inscription.event_name);
               if (eventDetails) {
                  await updateInscription(
                     eventDetails.event_id,
                     Number(user_id),
                     eventDetails.celebration_date, // Replace with the user's name if available
                     eventDetails.end_date, // Replace with the review text if necessary
                  );
               }
               else if (!eventDetails) {
                  deleteInscription(inscription.event_name, inscription.event_id);
               }
            }
        }
      };
      updateInscriptionAutomatically();
   }, [inscriptions]);

   const findMyInscription = async () => { 
      
      const user_id = localStorage.getItem('user_id');

      const responseInscription = await fetch(`http://localhost:8000/inscription/find/${user_id}` , {
         method: 'GET',
      });

      if (!responseInscription.ok){
         setNotification("No inscriptions to show")
         setInscriptions([])
      }

      const data = await responseInscription.json();
      if (Array.isArray(data)) {
         setInscriptions(data);
      } else {
         setInscriptions([]); // Si no es un array, establece un array vacío
         setNotification("No inscriptions to show");
      }
   }

   const findEventInscription = async (event_name: string) => {
      const responseFindEvent = await fetch(`http://localhost:8000/event/find/name/${event_name}`,{
         method: 'GET',
      });
      
      if(!responseFindEvent.ok){
         setNotification('Error finding event')
         return null;
      }
      const data = await responseFindEvent.json();
      setEvents(data)
      return data;
      
   }

   const updateInscription = async (event_id: number, user_id: number, start_date : string, end_date : string) => {
      
      const responsefindInscription = await fetch(`http://localhost:8000/inscription/find/${user_id}/${event_id}`, {
         method: 'GET',
      });

      if (!responsefindInscription.ok){
         setNotification("Error finding inscription")
      }

      const data = await responsefindInscription.json()       
      
         const formDetailsInscription = {
         event_id: event_id,
         user_id: user_id,
         event_name: data.event_name,
         inscription_date: data.inscription_date,
         start_date: start_date,
         end_date: end_date,
         location: data.location
      };
      const responseInscription = await fetch(`http://localhost:8000/inscription/update`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetailsInscription)
      });   
      
      if(!responseInscription.ok){
         setNotification("Event cant update")
         return;
      }
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
                              {inscription.event_name} 
                           </Heading>
                           <div className="flex flex-col py-2 gap-1">
                              <div  id = "info-members-myinscription-div" className="flex flex-row items-center">
                                 <SewingPinFilledIcon/>
                                 <span id="event-date">{inscription.location}</span>   
                              </div>
                              <div  id = "info-date-myinscription-div"className="flex flex-row items-center">
                                 <LapTimerIcon/> 
                                 <span id="event-date">{inscription.inscription_date ? inscription.inscription_date.split("T")[0] : "N/A"}</span>  
                              </div>   
                              <div  id = "info-clock-myinscription-div"className="flex flex-row items-center">
                                 <ClockIcon/> 
                                 <span id="event-date">{inscription.inscription_date ? inscription.inscription_date.split("T")[1] : "N/A"}</span>  
                              </div>
                              <div className="flex items-center py-3">
                              {(new Date().toISOString() < inscription.start_date) ? 
                                 <Badge id="badge-green-myinscriptions" color="green" variant="soft" >
                                       Pending
                                 </Badge> :
                              ((new Date().toISOString() >= inscription.start_date) && (new Date().toISOString() <= inscription.end_date)) ?  
                                 <Badge id="badge-blue-myinscriptions" color="blue" variant="solid">
                                       In Progress
                                 </Badge> :
                                 <Badge id="badge-red-myinscriptions" color="red" variant="solid">
                                       Completed  
                                 </Badge>                          
                              } 
                              </div>
                           </div>
                        </div>
                     </Dialog.Trigger>    
                     <div id="buttons-myevent" className="flex flex-row gap-2 items-center">
                           <AlertDialog.Root>
                              { ((new Date().toISOString() < inscription.start_date) ||  (new Date().toISOString() > inscription.end_date) ) &&  
                                 <AlertDialog.Trigger>
                                    <TrashIcon id="icon-myinscription" />                               
                                 </AlertDialog.Trigger>
                              }
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
                  <Dialog.Content className="DialogContentMyInscription border-2 border-solid border-white/[.08]">
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
                           <div className="grid grid-cols-3 gap-14">
                              <div className="flex flex-col gap-3">
                                 Register date
                                 <div className="flex flex-row gap-1 items-center">                                            
                                    <LapTimerIcon/>
                                    <span>{inscription.inscription_date ? inscription.inscription_date.split("T")[0] : "N/A"}</span>   
                                 </div>
                                 <div className="flex flex-row gap-1 items-center">
                                    <ClockIcon/>
                                    <span>{inscription.inscription_date ? inscription.inscription_date.split("T")[1] : "N/A"}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col gap-3">
                                 Start date
                                 <div className="flex flex-row gap-1 items-center">                                            
                                    <LapTimerIcon/>
                                    <span>{inscription.start_date ? inscription.start_date.split("T")[0] : "N/A"}</span>   
                                 </div>
                                 <div className="flex flex-row gap-1 items-center">
                                    <ClockIcon/>
                                    <span>{inscription.start_date ? inscription.start_date.split("T")[1] : "N/A"}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col gap-3">
                                 End date
                                 <div className="flex flex-row gap-1 items-center">                                            
                                    <LapTimerIcon/>
                                    <span>{inscription.end_date ? inscription.end_date.split("T")[0] : "N/A"}</span>   
                                 </div>
                                 <div className="flex flex-row gap-1 items-center">
                                    <ClockIcon/>
                                    <span>{inscription.end_date ? inscription.end_date.split("T")[1] : "N/A"}</span>
                                 </div>
                              </div>
                              {notification}
                           </div>
                        </div>
                     </Dialog.Content>
                     <Dialog.Close asChild>
                        <div id = "div-register-inscription"className="flex items-center">
                              <Button
                                 variant="soft" color = "pink"
                                 onClick={async () => {
                                    const eventDetails = await findEventInscription(inscription.event_name); // Busca los datos del evento
                                    if (eventDetails) {
                                       setSelectedEvent(eventDetails); // Pasa los datos completos del evento
                                       onGoToReview(); // Navega a la sección "review"
                                    } else {
                                      setNotification("Error finding event details");
                                    }
                                  }}
                                  id="button-more-details"
                              >
                                 Show details       
                              </Button>
                       </div>
                     </Dialog.Close>
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