"use client";

import * as React from "react";
import classnames from "classnames";
import { Heading,TextField,Flex,Box,Button,Badge,Callout} from "@radix-ui/themes";
import { MagnifyingGlassIcon,PlusIcon,Cross2Icon,MixIcon, LapTimerIcon, PersonIcon,SewingPinFilledIcon,ClockIcon, DrawingPinFilledIcon, ExclamationTriangleIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon} from "@radix-ui/react-icons";
import { Dialog,Select} from "radix-ui";
import { useState, useEffect, useRef} from "react";


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
   const [end_date, setEndDate] = useState<string>("");
   const [capacity, setcapacity] = useState<number>(0);   
   const [error, setError] = useState<string>("");
   const [notification, setNotification] = useState<string>("");
   const [events, setEvents] = useState<any[]>([]);
   const [isOrganizer, setOrganizer] = useState<boolean>(false);
   const [isRegister, setRegister] = useState<boolean>(false);
   const [uploading, setUploading] = useState(false);
   const [search_event, setSearchEvent] = useState('')
   const [filter_celebration_date, setFilterCelebrationDate] = useState<string>("");
   const [filter_end_date, setFilterEndDate] = useState<string>("");
   
   useEffect(() => {
      const storedUserID = localStorage.getItem('user_id');
      if (storedUserID) {
        setUserID(parseInt(storedUserID));
      }
      const storedValue = localStorage.getItem('organizer');
     if (storedValue !== null) {
         setOrganizer(JSON.parse(storedValue));
      }
      findEvents()      
      
   }, []);

   useEffect(() => {
      if (filter_celebration_date && filter_end_date) {
         findEventByDate();
      }
   }, [filter_celebration_date, filter_end_date]);


    const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Select.Item>>(
      ({ children, className, ...props }, forwardedRef) => {
         return (
            <Select.Item
               className={classnames("SelectItem", className)}
               {...props}
               ref={forwardedRef}
            >
               <Select.ItemText>{children}</Select.ItemText>
               <Select.ItemIndicator className="SelectItemIndicator">
                  <CheckIcon />
               </Select.ItemIndicator>
            </Select.Item>
         );
      },
   );
  
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

      
   const handleUploadCSV =  async () => {

      const inputRef = useRef<HTMLInputElement | null>(null);

      setUploading(true);
   
      const input = inputRef?.current;
      const reader = new FileReader();
      const file = input?.files?.[0];
      if (!file) {
         setUploading(false);
         return;
      }
      
      const response = fetch("")
      
      reader.readAsText(file);
   }

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

    const handleSelectChange = (value: string) => {
      if(value == "small"){
         findSmallEvents(50)
      }
      if (value=="medium"){
         findMediumEvents(50,200)
      }
      if(value == "big"){
         findBigEvents(200)
      }
      if(value == "general"){
         findEventByCategory("general")
      }
      if(value == "junior"){
         findEventByCategory("junior")
      } 
      if(value == "senior"){
         findEventByCategory("senior")
      } 
      if(value == "alevin"){
         findEventByCategory("alevin")
      }
      if(value == "infantil"){
         findEventByCategory("infantil")
      }
      if(value == "football"){
         findEventByType("football")
      }
      if(value == "basketball"){
         findEventByType("basketball")
      }
      if(value == "triathlon"){
         findEventByType("triathlon")
      }
      if(value == "athletics"){
         findEventByType("athletics")
      }
      if(value == "swimming"){
         findEventByType("swimming")
      }
      if(value == "cycling"){
         findEventByType("cycling")
      }
      if(value == "hockey"){
         findEventByType("hockey")
      }
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

   const findEventByName = async(e :React.ChangeEvent<HTMLInputElement>)  => {
      setSearchEvent(e.target.value)
      if(!e.target.value){
         findEvents()
         return
      }
      const responseEvent = await fetch(`http://localhost:8000/event/find/name/${e.target.value}`, {
         method: 'GET',
      });
      
      if(!responseEvent.ok) {
         setNotification("No events to show")
         setEvents([]);
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
      } else {
         setEvents(data);
      }
   }

   const findEventByType = async(event_type : string) => {
      const responseEvent = await fetch(`http://localhost:8000/event/find/type/${event_type}`,{
         method: 'GET'
      })
      if(!responseEvent.ok) {
         setNotification("No events to show")
         setEvents([]);
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
      } else {
         setEvents(data);
      }
   }

   const findEventByCategory = async(category : string) => {
      const responseEvent = await fetch(`http://localhost:8000/event/find/category/${category}`,{
         method: 'GET'
      })
      if(!responseEvent.ok) {
         setNotification("No events to show")
         setEvents([]);
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
      } else {
         setEvents(data);
      }
   }


   const findEventByDate = async() => { 
      if (!filter_celebration_date || !filter_end_date) {
         findEvents()
         return;
      }  
      const responseEvent = await fetch(`http://localhost:8000/event/find/date/${filter_celebration_date}/${filter_end_date}`, {
         method: 'GET',
         cache: 'no-store',
      });
      if(!responseEvent.ok) {
         setNotification("No events to show")
         setEvents([]);
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
         return;
      } else {
         setEvents(data);
         return;
      }
   }

   const findSmallEvents = async (capacity: number) => {
      const responseEvent = await fetch(`http://localhost:8000/event/find/small/${capacity}`, {
         method: 'GET',
      }) 
      if(!responseEvent.ok){
         setNotification("No events to show")
         setEvents([])
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
         return;
      } else {
         setEvents(data);
         return;
      }
   }

   const findMediumEvents = async (small_capacity: number, big_capacity: number) => {
      const responseEvent = await fetch(`http://localhost:8000/event/find/medium/${small_capacity}/${big_capacity}`, {
         method: 'GET',
      }) 
      if(!responseEvent.ok){
         setNotification("No events to show")
         setEvents([])
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
         return;
      } else {
         setEvents(data);
         return;
      }
   }
   const findBigEvents = async (capacity: number) => {
      const responseEvent = await fetch(`http://localhost:8000/event/find/big/${capacity}`, {
         method: 'GET',
      }) 
      if(!responseEvent.ok){
         setNotification("No events to show")
         setEvents([])
         return;
      }
      const data = await responseEvent.json();
      if (!Array.isArray(data)) {
         setEvents([data]);
         return;
      } else {
         setEvents(data);
         return;
      }
   }
   const createInscription = async (event_id : number,event_name : string, event_type:string, event_edition: string, category:string, event_description:string, location:string, celebration_date:string, end_date: string, capacity: number) => {

      const formDetails = 
      {
         "event_id" : event_id,
         "user_id" : user_id,
         "event_name" : event_name,
         "inscription_date" : "2022-12-12T12:12:12",
         "location" : location
      }
      
         
      const responseInscription = await fetch('http://localhost:8000/inscription/register' , {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetails)
      });
    
      if(!responseInscription.ok){
       setError('You are already register in this event')
       return;
      }
      setError('')
   
      const formDetailsEvent = 
      {
         "event_name" : event_name,
         "user_id" : user_id,
         "event_type" : event_type,  
         "event_edition" :  event_edition,
         "event_description" : event_description,
         "category": category,
         "location"  : location,
         "celebration_date"  : celebration_date,
         "end_date" : end_date,
         "capacity" : capacity - 1
      }


      const responseEvent = await fetch(`http://localhost:8000/event/update/${event_name}`, {
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
         <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">All events</Heading>  
         </div>
         <div id = "filter-events" className="flex flex-row gap-2"> 
            <div id ="new-event" className="flex">
               <Dialog.Root >
                  <Dialog.Trigger asChild>
                     {isOrganizer && 
                        <Button id="create-event" type = "submit" className="flex items-center gap-3">
                           <PlusIcon radius={"full"}/>
                        </Button>
                  }              
                  </Dialog.Trigger>   
                  <Dialog.Portal>
                  <Dialog.Overlay className="DialogOverlay" />
                  <Dialog.Content className="DialogContentCreateEvent border-2 border-solid border-white/[.08]">
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
            </div>
            <div id = "search-event" className="flex items-center"> 
               <TextField.Root id ="textfield-events"variant="soft" placeholder="Search the events…" onChange={findEventByName} value={search_event}>
                  <TextField.Slot >
                  <MagnifyingGlassIcon height="16" width="16" />
                  </TextField.Slot>
               </TextField.Root>
            </div>
            <div id = "filter-by-category" className="flex py-6 px-4">
               <Select.Root onValueChange={(value) => handleSelectChange(value)}>
                  <Select.Trigger className="SelectTrigger border-2 border-solid border-white/[.08]" aria-label="Food">
                     <Select.Value placeholder="Filter by" />
                     <Select.Icon className="SelectIcon">
                        <ChevronDownIcon />
                     </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                     <Select.Content className="SelectContent border-2 border-solid border-white/[.08]">
                        <Select.ScrollUpButton className="SelectScrollButton border-2 border-solid border-white/[.08]">
                           <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="SelectViewport">
                           <Select.Group>
                              <Select.Label className="SelectLabel">category</Select.Label>
                              <SelectItem  value="general">general</SelectItem>
                              <SelectItem role="option" value="junior">junior</SelectItem>
                              <SelectItem  value="senior">senior</SelectItem>
                              <SelectItem  value="alevin">alevin</SelectItem>
                              <SelectItem  value="infantil">infantil</SelectItem>
                           </Select.Group>
                           <Select.Separator className="SelectSeparator" />
                           <Select.Group>
                              <Select.Label className="SelectLabel">Type</Select.Label>
                              <SelectItem  value="football">football</SelectItem>
                              <SelectItem  value="basketball">basketball</SelectItem>
                              <SelectItem  value="triathlon">triathlon</SelectItem>
                              <SelectItem  value="athletics">athletics</SelectItem>
                              <SelectItem  value="swimming">swimming</SelectItem>
                              <SelectItem  value="cycling">cycling</SelectItem>
                              <SelectItem  value="hockey">hockey</SelectItem>
                           </Select.Group>
                           <Select.Separator className="SelectSeparator" />
                           <Select.Group>
                              <Select.Label className="SelectLabel">Capacity</Select.Label>
                              <SelectItem  value="small">&lt; 50</SelectItem>
                              <SelectItem  value="medium">&gt; 50 y &lt; 200</SelectItem>
                              <SelectItem  value="big">&gt; 200</SelectItem>
                           </Select.Group>
                        </Select.Viewport>
                        <Select.ScrollDownButton className="SelectScrollButton">
                           <ChevronDownIcon />
                        </Select.ScrollDownButton>
                     </Select.Content>
                  </Select.Portal>
               </Select.Root>
            </div>
            <div className = "flex flex-rows items-center"onChange={findEventByDate}>
               <div id = "filter-by-date" className="flex flex-row gap-2 items-center px-4">
                  <label>Start date</label>
                  <input
                     id = "input-date"  
                     name = "event_date"
                     placeholder="date1"
                     type="datetime-local" 
                     value={filter_celebration_date}
                     onChange={(e) => setFilterCelebrationDate(e.target.value)}
                  />
               </div>
               <div id = "filter-by-date" className="flex flex-row gap-2 items-center px-2">
                  <label>End date</label>
                  <input
                     id = "input-date"  
                     name = "event_end_date"
                     placeholder="date1"
                     type="datetime-local" 
                     value={filter_end_date}
                     onChange={(e) => setFilterEndDate(e.target.value)}
                  />
               </div>  
            </div>
         </div>          
         <div id = "events_disp" className="flex flex-wrap" onSubmit={findEvents}>           
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
                              <div className="flex items-center py-3">
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
                              <Dialog.Close asChild>
                                 <Button className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                 </Button>
                              </Dialog.Close>
                              <Dialog.Close asChild>
                              {!isOrganizer && (event.capacity > 0 ) && (new Date().toISOString() < event.celebration_date) && 
                                 <div id = "div-register-inscription"className="flex items-center">
                                 <Button variant="soft" color = "pink" onClick={() => createInscription(event.event_id ,event.event_name, event.event_type, event.event_edition, event.category, event.event_description, event.location, event.celebration_date, event.end_date, event.capacity)} id="button-green-inscription">Register</Button> 
                                 </div>
                              }
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
        
         </div>
      </div>    
   )
}