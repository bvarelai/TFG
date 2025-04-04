"use client"
import { useState, useEffect} from "react";
import { Heading, Flex,Box,Badge, AlertDialog, Button,Callout} from "@radix-ui/themes";
import {MixIcon,LapTimerIcon, PersonIcon,ClockIcon,TrashIcon,Pencil1Icon,Cross2Icon,FileIcon, ExclamationTriangleIcon, DrawingPinFilledIcon, SewingPinFilledIcon} from "@radix-ui/react-icons";
import { Dialog } from "radix-ui";


export default function MyEvents() {   
   const [events, setEvents] = useState<any[]>([]);
   const [user_id, setUserID] = useState<string>("");
   const [notification, setNotification] = useState<string>("");
   const [error, setError] = useState<string>("");
   const [event_name, setEventname] = useState<string>("");
   const [event_type, setEventType] = useState<string>("");
   const [event_edition, setEventEdition] = useState<string>("");
   const [category, setCategory] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const [location, setLocation] = useState<string>("");
   const [celebration_date, setCelebrationDate] = useState<string>("");
   const [end_date, setEndDate] = useState<string>("");
   const [capacity, setcapacity] = useState<number>(0);   
   const [csvData, setCsvData] = useState<string>("");
   
   useEffect(() => {
      const storedUserID = localStorage.getItem('user_id');
      if (storedUserID) {
        setUserID(storedUserID);
      }
      findMyEvents();
   }, []);

   const validateForm = (): boolean => {
      if (!event_name || !event_type || !event_edition || !category || !location || !celebration_date || !capacity) {
        setError("Data are required");
        return false;
      }
      if (capacity <= 0) {
         setError("The capacity is not valid")
         return false;
      }
       
      if (description.trim().split(/\s+/).length > 30) {
         setError("Description must not exceed 30 words.");
         return false;
      }
      if (celebration_date > end_date){
         setError("End date must be after the start date");
         return false;
       }


      setError("");
      return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          setCsvData(text); // Aquí tienes el CSV como string
        }
      };
      reader.readAsText(file);
      
      const responseEvent = await fetch(`http://localhost:8000/event/upload`, {     
         method: 'POST',
         body: file
      }) 

      if(!responseEvent.ok){
         setError(".csv no upload")
      }
   };

   
   const findMyEvents = async () => {

        const responseEvent = await fetch(`http://localhost:8000/event/find/${user_id}`, {     
         method: 'GET',
      })
      if (!responseEvent.ok){
         setNotification("No events to show")
         return;
      }
      const data = await responseEvent.json();
      setNotification("")
      setEvents(data)
   }

   const updateEvent = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!validateForm()) return;
        setError("")
 
      const formDetails = 
      {
         "event_name" : event_name,
         "user_id" : user_id,
         "event_type" : event_type,  
         "event_edition" :  event_edition,
         "event_description" : description,
         "category": category,
         "location"  : location,
         "celebration_date"  : celebration_date,
         "end_date" : end_date,
         "capacity" : capacity
      } 

      const responseEvent = await fetch(`http://localhost:8000/event/update/${event_name}`, {
         method: 'PUT',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetails)
      });
      if (!responseEvent.ok) {
         setError('Event cant be updated');
         return;
      }
      setError("")
   }

   const deleteEvent = async (event_name: string) => {
      const response = await fetch(`http://localhost:8000/event/delete/${event_name}`, {
         method: 'DELETE',
      });
      if (!response.ok) {
          setError("Error deleting event");    
          return
      }     
      setEvents((prevEvents) => prevEvents.filter((event) => event.event_name !== event_name));
      findMyEvents();    
   }
   
   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
         <Heading id="heading-events">Your events</Heading>  
      </div>
      <div id = "events_disp" className="flex flex-wrap">        
        
            {events.length > 0 ? (  // Verifica si hay eventos
               events.map((event) => (
                  <Dialog.Root key={event.event_name}>                    
                        <Box
                           key={event.event_id}
                           id="box-myevent"
                           className="flex flex-col border-2 border-solid border-white/[.08]"
                           width="64px"
                           height="100px"
                        >
                           <Dialog.Trigger asChild>
                              <div>
                                 <Heading className="flex" id="heading-event-name">
                                 {event.event_name}
                                 </Heading>
                                 <div  id = "info-date-myevent-div"className="flex flex-row items-center">
                                    <DrawingPinFilledIcon/>
                                    <span id="event-date">{event.category}</span>    
                                 </div>   
                                 <div  id = "info-clock-myevent-div"className="flex flex-row items-center">
                                    <SewingPinFilledIcon/> 
                                    <span id="event-date">{event.location}</span> 
                                 </div>
                                 <div  id = "info-members-myevent-div" className="flex flex-row items-center">
                                    <PersonIcon/>
                                    <span id="event-date">{event.capacity}</span>   
                                 </div>
                                 {(new Date().toISOString() < event.celebration_date) ? 
                                    <Badge id="badge" color="green" variant="solid">
                                       Published
                                    </Badge> :
                                 ((new Date().toISOString() >= event.celebration_date) && (new Date().toISOString() <= event.end_date)) ?  
                                    <Badge id="badge" color="blue" variant="solid">
                                          Ongoing
                                    </Badge> :
                                    <Badge id="badge" color="red" variant="solid">
                                          Finished 
                                    </Badge>                          
                                 } 
                              </div>
                           </Dialog.Trigger>
                           <div id="buttons-myevent" className="flex flex-row gap-2 items-center">
                              <div>
                                 <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                       {(new Date().toISOString() < event.celebration_date) && <Pencil1Icon id="icon-myevent-update"/>}
                                    </Dialog.Trigger>   
                                    <Dialog.Portal>
                                    <Dialog.Overlay className="DialogOverlay" />
                                    <Dialog.Content className="DialogContentUpdateEvent border-2 border-solid border-white/[.08]">
                                          <Dialog.Title className="DialogTitle">Update event</Dialog.Title>
                                          <Dialog.Description  className="DialogDescription">
                                             Change the event data
                                          </Dialog.Description>  
                                          <div className="flex flex-col items-center gap-3 py-4"> 
                                             <div className="flex flex-row items-center gap-3">
                                                <label htmlFor="event_name">Name</label>
                                                <input
                                                   id = "input-event"  
                                                   name = "event_name"
                                                   placeholder={event.event_name}
                                                   type="text"
                                                   value={event_name}
                                                   onChange={(e) => setEventname(e.target.value)}
                                             />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">
                                                <label htmlFor="event-type">Type</label>
                                                <input
                                                   id = "input-event"  
                                                   name = "event_type"
                                                   placeholder={event.event_type}
                                                   type="text"
                                                   value={event_type}
                                                   onChange={(e) => setEventType(e.target.value)}
                                                />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                   <label htmlFor="event-edition">Edition</label>
                                                   <input
                                                      id = "input-event"  
                                                      name = "event_edition"
                                                      placeholder={event.event_edition}
                                                      type="text"
                                                      value={event_edition}
                                                      onChange={(e) => setEventEdition(e.target.value)}
                                                   />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                      <label htmlFor="event-category">Category</label>
                                                      <input
                                                         id = "input-event"  
                                                         name = "event_category"
                                                         placeholder={event.category}
                                                         type="text"
                                                         value={category}
                                                         onChange={(e) => setCategory(e.target.value)}
                                                      />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                   <label htmlFor="event-date">Start date</label>
                                                   <input
                                                      id = "input-event"  
                                                      name = "event_date"
                                                      placeholder="date1"
                                                      type="datetime-local" 
                                                      value={celebration_date}
                                                      onChange={(e) => setCelebrationDate(e.target.value)}
                                                      />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                   <label htmlFor="event-end-date">End date</label>
                                                      <input
                                                         id = "input-event"  
                                                         name = "event_end_date"
                                                         placeholder="date1"
                                                         type="datetime-local" 
                                                         value={end_date}
                                                         onChange={(e) => setEndDate(e.target.value)}
                                                      />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                      <label htmlFor="event-location">Location</label>
                                                      <input
                                                         id = "input-event"  
                                                         name = "event_location"
                                                         placeholder={event.location}
                                                         type="text"
                                                         value = {location}
                                                         onChange={(e) => setLocation(e.target.value)}
                                                      />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                   <label htmlFor="event-description">Description</label>
                                                      <input
                                                         id = "input-event"  
                                                         name = "event_description"
                                                         placeholder={event.event_description}
                                                         type="text"
                                                         value={description}
                                                         onChange={(e) => setDescription(e.target.value)}
                                                      />
                                             </div>
                                             <div className="flex flex-row items-center gap-3">                        
                                                      <label htmlFor="event-capacity">Capacity</label>
                                                      <input
                                                         id = "input-event"  
                                                         name = "event_capacity"
                                                         placeholder={event.capacity}
                                                         type="number"
                                                         value={capacity}
                                                         onChange={(e) => setcapacity(parseInt(e.target.value))}
                                                      />
                                             </div>
                                          </div>
                                          <Dialog.Close asChild >
                                             <Button onClick={updateEvent} id="button-green">update</Button> 
                                          </Dialog.Close>
                                          <Dialog.Close asChild>
                                             <Button className="IconButton" aria-label="Close">
                                                <Cross2Icon />
                                             </Button>
                                          </Dialog.Close>   
                                          {error && 
                                             <Callout.Root id = "callout-root-event-register-inscription" color="red" size="2" variant="outline" className="flex items-center ">
                                                <Callout.Icon className="callout-icon-event-register-inscription" >
                                                   <ExclamationTriangleIcon  />
                                                </Callout.Icon>
                                                <Callout.Text className="callout-text-event-register-inscription"> {error} </Callout.Text> 
                                             </Callout.Root> }
                                       </Dialog.Content> 
                                    </Dialog.Portal>           
                                 </Dialog.Root>    
                              </div>                        
                              <div>
                                 <AlertDialog.Root>
                                    {(new Date().toISOString() < event.celebration_date || new Date().toISOString() > event.end_date) && 
                                       <AlertDialog.Trigger>
                                          <TrashIcon id="icon-myevent-delete"/>
                                       </AlertDialog.Trigger>
                                    }
                                    <AlertDialog.Content className="AlertDialogContent">
                                          <AlertDialog.Title className="AlertDialogTitle">Delete event</AlertDialog.Title>
                                       <AlertDialog.Description className="AlertDialogDescription" size="2">
                                          Are you sure? This event will be deleted permanently.
                                       </AlertDialog.Description>
                                       <Flex gap="3" mt="4" justify="end">
                                          <AlertDialog.Cancel>
                                             <Button  id = "cancel-button" variant="outline" color="gray">
                                                Cancel
                                             </Button>
                                          </AlertDialog.Cancel>
                                          <AlertDialog.Action>
                                             <Button onClick={() => deleteEvent(event.event_name)} variant="solid" color="red">
                                                Delete
                                             </Button>
                                          </AlertDialog.Action>
                                       </Flex>
                                    </AlertDialog.Content>
                                 </AlertDialog.Root>
                              </div>
                              <div>
                              <Dialog.Root>
                                 <Dialog.Trigger asChild>
                                    {(new Date().toISOString() > event.end_date) && <FileIcon id="file-myevent"/>}
                                 </Dialog.Trigger>   
                                 <Dialog.Portal>
                                    <Dialog.Overlay className="DialogOverlay" />
                                    <Dialog.Content className="DialogContent border-2 border-solid border-white/[.08]">
                                          <Dialog.Title className="DialogTitle">Event Result</Dialog.Title>
                                          <Dialog.Description  className="DialogDescription">
                                             Upload event result
                                          </Dialog.Description>  
                                          <div className="flex flex-row items-center gap-3">
                                             <label htmlFor="event_name">.csv File</label>
                                             <input
                                                id = "input-event"  
                                                name = "event_name"
                                                type="file"
                                                onChange={handleFileChange}
                                             />
                                             {error && <span>{error}</span>}
                                             <pre>{csvData}</pre>
                                          </div>
                                    </Dialog.Content>  
                                 </Dialog.Portal>         
                              </Dialog.Root>      
                              </div>
                           </div>
                        </Box>
                    
                     <Dialog.Portal>
                     <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContentMyEvent border-2 border-solid border-white/[.08]">
                           <Dialog.Title className="DialogTitle">Information about {event.event_name}</Dialog.Title>
                           <Dialog.Description className="DialogDescription">
                                 {event.event_edition} edition
                           </Dialog.Description>
                           <Dialog.Content>
                              <div className="flex flex-col gap-3">
                                 <div className="flex items-center gap-3">
                                    <div className="flex flex-row gap-1 items-center">
                                       <DrawingPinFilledIcon/>
                                       <span>{event.category}</span>  
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                       <SewingPinFilledIcon/>
                                       <span> {event.location}</span>  
                                    </div> 
                                    <div className="flex flex-row gap-1 items-center">
                                       <PersonIcon/>
                                       <span> {event.capacity}</span>  
                                    </div>
                                 </div>
                                 <div className="flex flex-col gap-2">
                                    Start date
                                    <div className="flex flex-row gap-1 items-center">                                            
                                       <LapTimerIcon/>
                                       <span>{event.celebration_date.split("T")[0]}</span>   
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                       <ClockIcon/>
                                       <span>{event.celebration_date.split("T")[1]}</span>
                                    </div>
                                    End date
                                    <div className="flex flex-row gap-1 items-center">                                            
                                       <LapTimerIcon/>
                                       <span>{event.end_date.split("T")[0]}</span>   
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                       <ClockIcon/>
                                       <span>{event.end_date.split("T")[1]}</span>
                                    </div>
                                 </div>
                                 <p id="event-description">{event.event_description}</p>
                              </div>
                           </Dialog.Content>   
                        </Dialog.Content>    
                     </Dialog.Portal>
                  </Dialog.Root>   
               ))
            ) : (
               <Box
                  id="no-box-myevent"
                  className="flex flex-col gap-5 border-2 border-solid border-white/[.08]"
                  width="64px"
                  height="100px">
                  <MixIcon id = "no-data-icon"/>
                  {notification && <label id= "label-no-data">{notification}</label>}               
               </Box>
            )}
      </div>
   </div>
   )
}