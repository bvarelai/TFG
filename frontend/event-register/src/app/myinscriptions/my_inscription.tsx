"use client"
import { Heading, Box, Button,AlertDialog,Flex} from "@radix-ui/themes";
import { useState, useEffect} from "react";
import { MixIcon,LapTimerIcon,ClockIcon,SewingPinFilledIcon, TrashIcon} from "@radix-ui/react-icons";


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
      const storedEventName = localStorage.getItem('event_name')
      const storedEventType = localStorage.getItem('event_type')
      const storeEventEdition = localStorage.getItem('event_edition')
      const storeEventCategory = localStorage.getItem('category')
      const storeEventDescription = localStorage.getItem('description')
      const storeEventCelebrationDate = localStorage.getItem('celebration_date')
      const storeEventEndDate = localStorage.getItem('end_date')
      const storeEventLocation = localStorage.getItem('location')
      let storeEventCapacity = localStorage.getItem('capacity')
      
      if (storeEventCapacity) {
         storeEventCapacity = (parseInt(storeEventCapacity) + 1).toString();
         localStorage.setItem('capacity', storeEventCapacity); 
      } 

      const responseDeleteInscription = await fetch(`http://localhost:8000/inscription/delete/${user_id}/${event_id}`, {
         method: 'DELETE',
      });

      if (!responseDeleteInscription.ok){
         setNotification("Error deleting inscription")
      }
      const formDetailsEvent = 
      {
         "event_name" : storedEventName,
         "user_id" : user_id,
         "event_type" : storedEventType,  
         "event_edition" :  storeEventEdition,
         "event_description" : storeEventDescription,
         "category": storeEventCategory,
         "location"  : storeEventLocation,
         "celebration_date"  : storeEventCelebrationDate,
         "end_date" : storeEventEndDate,
         "capacity" : storeEventCapacity
      }

      const responseEvent = await fetch(`http://localhost:8000/event/update/${storedEventName}`, {
         method: 'PUT',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetailsEvent)
      });

      setInscriptions((prevInscriptions) => prevInscriptions.filter((inscription) => inscription.event_name !== event_name));
      findMyInscription();
   }


   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative">
            <Heading id="heading-events">Your inscriptions</Heading>  
      </div>
      <div id = "events_disp" className="flex flex-row">          
         {inscriptions.length > 0 ? (
            inscriptions.map((inscription) =>(
              <Box
                  key={inscription.event_id}
                  id="box-myinscription"
                  className="flex flex-col border-2 border-solid border-white/[.08]"
                  width="64px"
                  height="100px"
              >
                  <Heading className="flex" id="heading-event-name">
                    {inscription.event_name}
                  </Heading>
                  <div  id = "info-date-myinscription-div"className="flex flex-row items-center">
                     <LapTimerIcon/> 
                     <span id="event-date">{inscription.inscription_date.split("T")[0]}</span>  
                  </div>   
                  <div  id = "info-clock-myinscription-div"className="flex flex-row items-center">
                     <ClockIcon/> 
                     <span id="event-date">{inscription.inscription_date.split("T")[1]}</span>  
                  </div>
                  <div  id = "info-members-myinscription-div" className="flex flex-row items-center">
                     <SewingPinFilledIcon/>
                     <span id="event-date">{inscription.location}</span>   
                  </div>
                     <div id="buttons-myevent" className="flex flex-row gap-2 items-center">
                        <AlertDialog.Root>
                           <AlertDialog.Trigger>
                              <TrashIcon id="icon-myevent" />
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