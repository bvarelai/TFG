"use client";
import { Heading,TextField,Flex,Box,Button,Badge,Callout} from "@radix-ui/themes";
import { MagnifyingGlassIcon,PlusIcon,Cross2Icon,MixIcon, LapTimerIcon, PersonIcon,SewingPinFilledIcon,ClockIcon, DrawingPinFilledIcon, ExclamationTriangleIcon} from "@radix-ui/react-icons";
import { Dialog } from "radix-ui";
import { useState, useEffect} from "react";
import { parse } from "path";


export default function Events() {
   const [event_id, setEventID] = useState<number>(0);
   const [user_id, setUserID] = useState<string>("");
   const [event_name, setEventname] = useState<string>("");
   const [event_type, setEventType] = useState<string>("");
   const [event_edition, setEventEdition] = useState<string>("");
   const [category, setCategory] = useState<string>("");
   const [description, setDescription] = useState<string>("");
   const [location, setLocation] = useState<string>("");
   const [celebration_date, setCelebrationDate] = useState<string>("");
   const [end_date, setEndDate] = useState<string>("");
   const [capacity, setcapacity] = useState<number>(0);   
   const [error, setError] = useState<string>("");
   const [notification, setNotification] = useState<string>("");
   const [events, setEvents] = useState<any[]>([]);
   const [isOrganizer, setOrganizer] = useState<boolean>(false);
   const [isRegister, setRegister] = useState<boolean>(false);

   
   useEffect(() => {
      const storedUserID = localStorage.getItem('user_id');
      if (storedUserID) {
        setUserID(storedUserID);
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
       
      if (description.trim().split(/\s+/).length > 20) {
         setError("Description must have at least 20 words");
         return false;
      }
       if (celebration_date > end_date){
         setError("End date must be after the start date");
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
         "end_date" : end_date,
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
      localStorage.setItem('event_name',event_name)
      localStorage.setItem('event_type',event_type)
      localStorage.setItem('event_edition',event_edition)
      localStorage.setItem('category',category)
      localStorage.setItem('description',description)
      localStorage.setItem('celebration_date',celebration_date)
      localStorage.setItem('end_date',end_date)
      localStorage.setItem('location',location)
      localStorage.setItem('capacity',capacity.toString())

      setEventname("");
      setEventType("");
      setEventEdition("");
      setCategory("");
      setDescription("");
      setLocation("");
      setCelebrationDate("");
      setEndDate("");
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
         storeEventCapacity = (parseInt(storeEventCapacity) - 1).toString();
         localStorage.setItem('capacity', storeEventCapacity); // Actualizar en localStorage
      } 

      const formDetails = 
      {
         "event_id" : event_id,
         "user_id" : user_id,
         "event_name" : storedEventName,
         "inscription_date" : "2022-12-12T12:12:12",
         "location" : storeEventLocation
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
       setRegister(true)
       return;
      }
      setError('')

      const formDetailsEvent = 
      {
         "event_name" : storedEventName,
         "user_id" : user_id,
         "event_type" : storedEventType,  
         "event_edition" :  storeEventEdition,
         "event_description" : storeEventDescription,
         "category": storeEventCategory,
         "location"  : location,
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

      if (!responseEvent.ok) {
         setError('Can`t register');
         return;
      }
      findEvents()
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
                        <div className="flex flex-col items-center gap-3 py-4"> 
                           <div className="flex flex-row items-center gap-3">
                              <label htmlFor="event_name">Name</label>
                              <input
                                 id = "input-event"  
                                 name = "event_name"
                                 placeholder="event1"
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
                                 placeholder="type1"
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
                                    placeholder="edition1"
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
                                       placeholder="category1"
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
                                       placeholder="location1"
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
                                       placeholder="description1"
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
                                       placeholder="capacity1"
                                       type="number"
                                       value={capacity}
                                       onChange={(e) => setcapacity(e.target.valueAsNumber)}
                                    />
                           </div>
                        </div>
                        <Dialog.Close asChild >
                           <Button onClick= {createEvent} id="button-green">create</Button> 
                        </Dialog.Close>
                        <Dialog.Close asChild onClick = {resetForm}>
                           <Button className="IconButton" aria-label="Close">
                              <Cross2Icon />
                           </Button>
                        </Dialog.Close>   
                        {error && 
                        <Callout.Root id = "callout-root-event-register" color="red" size="2" variant="outline" className="flex items-center ">
                           <Callout.Icon className="callout-icon-event-register" >
                              <ExclamationTriangleIcon  />
                           </Callout.Icon>
                           <Callout.Text className="callout-text-event-register"> {error} </Callout.Text> 
                        </Callout.Root> }
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
                              <div  id = "info-date-event-div"className="flex flex-row items-center">
                                 <DrawingPinFilledIcon/>
                                 <span id="event-date">{event.category}</span>  
                              </div>
                              <div  id = "info-members-event-div"className="flex flex-row items-center">
                                 <SewingPinFilledIcon/> 
                                 <span id="event-date">{event.location}</span>  
                              </div>   
                              <div  id = "info-members-event-div" className="flex flex-row items-center">
                                 <PersonIcon/>
                                 <span id="event-date">{event.capacity}</span>   
                              </div>
                              {(new Date().toISOString() < event.celebration_date) ? 
                                 <Badge id="badge" color="green" variant="solid">
                                       Published
                                 </Badge> :
                              ((new Date().toISOString() >= event.celebration_date) && (new Date().toISOString() <= event.end_date)) ?  
                                 <Badge id="badge" color="orange" variant="solid">
                                       Ongoing
                                 </Badge> :
                                  <Badge id="badge" color="red" variant="solid">
                                       Finished  
                                  </Badge>                          
                              }
                           </Box>   
                        </Dialog.Trigger>
                        <Dialog.Portal>
                           <Dialog.Overlay className="DialogOverlay" />
                           <Dialog.Content className="DialogContent border-2 border-solid border-white/[.08]">
                              <Dialog.Title className="DialogTitle">Information about {event.event_name}</Dialog.Title>
                              <Dialog.Description className="DialogDescription">
                                 {event.event_edition} edition
                              </Dialog.Description>
                              <Dialog.Content>
                                 <div className="flex gap-2 items-center gap-3">
                                    <div className="flex flex-row gap-1 items-center">
                                       <LapTimerIcon/>
                                       <span>{event.celebration_date.split("T")[0]} {event.celebration_date.split("T")[1]}</span>  
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                       <ClockIcon/>
                                       <span> {event.end_date.split("T")[0]} {event.end_date.split("T")[1]}</span>  
                                    </div> 
                                 </div>
                                 <p id="event-description">{event.event_description}</p>
                              </Dialog.Content>
                              <Dialog.Close asChild>
                                 <Button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                 </Button>
                              </Dialog.Close>
                              <Dialog.Close asChild>
                              {!isOrganizer && (event.capacity > 0 ) && !isRegister && (new Date().toISOString() < event.celebration_date) && 
                                 <div className="flex items-center">
                                 <Button onClick={createInscription} id="button-green-inscription">Register</Button> 
                                 </div>
                              }
                              </Dialog.Close>
                              {error && <label id = "p-red" data-testid="error-message"  style={{ color: "red" }}>{error}</label>}
                              <Dialog.Title id="title-result" className="DialogTitle">Event result</Dialog.Title> 
                              {(new Date().toISOString() >= event.end_date) ? 
                                <div>
                                      Este es el resultado     
                                </div> : 
                                 <Box
                                 id = "no-box-event-result"
                                 className="flex flex-col gap-5 "
                                 >
                                 <MixIcon id = "no-data-icon"/>
                                 <label id= "label-no-data">No result to show</label> 
                                 </Box>                               
                              }
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