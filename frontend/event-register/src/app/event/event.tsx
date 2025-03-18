"use client";
import { Heading,TextField,Flex,Box,Button,Badge} from "@radix-ui/themes";
import { MagnifyingGlassIcon,PlusIcon,Cross2Icon,MixIcon} from "@radix-ui/react-icons";
import { Dialog } from "radix-ui";
import { useState, useEffect} from "react";


export default function Events() {
   const [event_id, setEventID] = useState<number>(0);
   const [user_id, setUserID] = useState<number>(0);
   const [event_name, setEventname] = useState<string>("");
   const [event_type, setEventType] = useState<string>("");
   const [event_edition, setEventEdition] = useState<string>("");
   const [category, setCategory] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const [location, setLocation] = useState<string>("");
   const [celebration_date, setCelebrationDate] = useState<string>("");
   const [capacity, setcapacity] = useState<number>(0);   
   const [error, setError] = useState<string>("");
   const [notification, setNotification] = useState<string>("");
   const [events, setEvents] = useState<any[]>([]);
   const [isOrganizer, setOrganizer] = useState<boolean>(false);

   useEffect(() => {
      const storedUserID = localStorage.getItem('user_id');
      if (storedUserID) {
        setUserID(parseInt(storedUserID));
      }
      const storedValue = localStorage.getItem('organizer');
     if (storedValue !== null) {
         setOrganizer(JSON.parse(storedValue));
      }      
      findEvents();
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
      setError("");
      return true;
    };

    const resetForm = () => {
      setEventname("");
      setEventType("");
      setEventEdition("");
      setCategory("");
      setDescription("");
      setLocation("");
      setCelebrationDate("");
      setcapacity(0);
      setError("");
    };
   
    const createEvent = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
         "capacity" : capacity
      } 
    
      const responseEvent = await fetch('http://localhost:8000/event/register', {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetails)
      });
      if (!responseEvent.ok) {
         setError('Error al crear el evento');
         return;
      }
      const data = await responseEvent.json()
      localStorage.setItem('event_id',data.event_id)   

      setEventname("");
      setEventType("");
      setEventEdition("");
      setCategory("");
      setDescription("");
      setLocation("");
      setCelebrationDate("");
      setcapacity(0);
      findEvents()
   }

   const findEvents = async () => {
      const responseEvent = await fetch('http://localhost:8000/event/find', {
         method: 'GET',
      });
      
      if(!responseEvent.ok) {
         setNotification("No events to show")
         return;
      }
      const data = await responseEvent.json();
      setNotification("")      
      setEvents(data);
   }

    const createInscription = async () => {
      const storedEventId = localStorage.getItem('event_id');
      if(storedEventId)
        setEventID(parseInt(storedEventId))
      
      const formDetails = 
      {
         "event_id" : event_id,
         "user_id" : user_id,
         "inscription_description" : description
      }  

      const responseInscription = await fetch('http://localhost:8000/inscription/register' , {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetails)
      });
    
      if(!responseInscription.ok){
       setError('Can`t register')
       return;
      }
      setError('')
   }

   return (
      <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>   
         <div id = "title-events" className="flex flex-col relative">
            <Heading id="heading-events">All events</Heading>  
         </div>
         <div id = "filter-events" className="flex flex-row gap-2"> 
            <Dialog.Root>
                  <Dialog.Trigger asChild>
                     {isOrganizer && 
                        <Button id="create-event" className="flex items-center gap-3">
                           <PlusIcon radius={"full"}/>
                        </Button>
                  }              
                  </Dialog.Trigger>   
                  <Dialog.Portal>
                  <Dialog.Overlay className="DialogOverlay" />
                  <Dialog.Content className="DialogContent border-2 border-solid border-white/[.08]">
                        <Dialog.Title className="DialogTitle">Create a new event</Dialog.Title>
                        <Dialog.Description  className="DialogDescription">
                           Add the event data
                        </Dialog.Description>  
                        <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                        <label htmlFor="event_name">Name</label>
                        <input
                           id = "input-event"  
                           name = "event_name"
                           placeholder="event1"
                           type="text"
                           value={event_name}
                           onChange={(e) => setEventname(e.target.value)}
                        />
                        <label htmlFor="event-type">Type</label>
                        <input
                           id = "input-event"  
                           name = "event_type"
                           placeholder="type1"
                           type="text"
                           value={event_type}
                           onChange={(e) => setEventType(e.target.value)}
                        />
                        </fieldset>    
                        <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                           <label htmlFor="event-edition">Edition</label>
                           <input
                              id = "input-event"  
                              name = "event_edition"
                              placeholder="edition1"
                              type="text"
                              value={event_edition}
                              onChange={(e) => setEventEdition(e.target.value)}
                           />
                           <label htmlFor="event-category">Category</label>
                           <input
                              id = "input-event"  
                              name = "event_category"
                              placeholder="category1"
                              type="text"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                           />
                        </fieldset> 
                        <fieldset id = "fieldset-create" className="flex gap-3 items-center">               
                        <label htmlFor="event-date">Date</label>
                           <input
                              id = "input-event"  
                              name = "event_date"
                              placeholder="date1"
                              type="datetime-local" 
                              value={celebration_date}
                              onChange={(e) => setCelebrationDate(e.target.value)}
                           />
                           <label htmlFor="event-location">Location</label>
                           <input
                              id = "input-event"  
                              name = "event_location"
                              placeholder="location1"
                              type="text"
                              value = {location}
                              onChange={(e) => setLocation(e.target.value)}
                           />
                        </fieldset> 
                        <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                        <label htmlFor="event-description">Description</label>
                           <input
                              id = "input-event"  
                              name = "event_description"
                              placeholder="description1"
                              type="text"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                           />
                           <label htmlFor="event-capacity">Capacity</label>
                           <input
                              id = "input-event"  
                              name = "event_capacity"
                              placeholder="capacity1"
                              type="number"
                              value={capacity}
                              onChange={(e) => setcapacity(e.target.valueAsNumber)}
                           />
                        </fieldset> 
                        <Dialog.Close asChild >
                           <Button onClick= {createEvent} id="button-green">create</Button> 
                        </Dialog.Close>
                        <Dialog.Close asChild onClick = {resetForm}>
                           <Button className="IconButton" aria-label="Close">
                              <Cross2Icon />
                           </Button>
                        </Dialog.Close>   
                        {error && <label id = "p-red"   data-testid="error-message"  style={{ color: "red" }}>{error}</label>}
                     </Dialog.Content> 
                  </Dialog.Portal>           
               </Dialog.Root>    
               <div id = "search-event" className="flex items-center"> 
                  <TextField.Root id = "textfield-events"variant="soft" placeholder="Search the events…">
                     <TextField.Slot >
                     <MagnifyingGlassIcon height="16" width="16" />
                     </TextField.Slot>
                  </TextField.Root>
               </div>
         </div>          
         <div id = "events_disp" className="flex flex-row" onSubmit={findEvents}>           
            <Flex gap="6">
               {events.length > 0 ? (  // Verifica si hay eventos
                  events.map((event) => (
                     <Dialog.Root key={event.event_name}>
                        <Dialog.Trigger asChild>
                           <Box
                              id="box-event"
                              className="flex flex-col border-2 border-solid border-white/[.08]"
                              width="64px"
                              height="100px"
                           >
                              <Heading className="flex" id="heading-event-name">
                              {event.event_name}
                              </Heading>
                              <fieldset id="fieldset-create" className="flex gap-20 items-center">
                                 <span id="span-event" className="flex">{event.event_type}</span>
                                 <span id="span-event" className="flex">{event.category}</span>
                              </fieldset>
                              <fieldset id="fieldset-create" className="flex gap-32 items-center">
                                 <span id="span-event" className="flex">{event.location}</span>
                                 <span id="span-event" className="flex">{event.capacity}</span>
                              </fieldset>
                              <Badge id="badge" color="green" variant="solid">
                                 Complete
                              </Badge>
                           </Box>   
                        </Dialog.Trigger>
                        <Dialog.Portal>
                           <Dialog.Overlay className="DialogOverlay" />
                           <Dialog.Content className="DialogContent border-2 border-solid border-white/[.08]">
                              <Dialog.Title className="DialogTitle">{event.event_name}</Dialog.Title>
                              <Dialog.Description className="DialogDescription">
                                 {event.event_description}
                              </Dialog.Description>
                              <Dialog.Content>
                                 <div className="flex flex-col gap-2">
                                    <span>Edition : {event.event_edition}</span>  
                                    <span>Type : {event.event_type}</span>  
                                    <span>Category : {event.category}</span>  
                                    <span>Location : {event.location}</span>  
                                    <span>Date : {event.celebration_date}</span>  
                                    <span>Places : {event.capacity}</span>  
                                 </div>
                              </Dialog.Content>
                              <Dialog.Close asChild>
                                 <Button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                 </Button>
                              </Dialog.Close>
                              <Dialog.Close asChild>
                              {!isOrganizer && 
                                 <div className="flex items-center">
                                   <Button onClick= {createInscription} id="button-green-inscription">Register</Button> 
                                 </div>
                              }
                              </Dialog.Close>
                              {error && <label id = "p-red" data-testid="error-message"  style={{ color: "red" }}>{error}</label>}
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
               )}
            </Flex>
         </div>
      </div>    
   )
}