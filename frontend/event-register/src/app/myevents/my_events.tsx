"use client"
import * as React from "react";
import { useState, useEffect} from "react";
import classnames from "classnames";
import { Heading, Flex,Box,Badge, AlertDialog, Button,Callout, TextArea} from "@radix-ui/themes";
import {MixIcon,LapTimerIcon, PersonIcon,ClockIcon,TrashIcon,Pencil1Icon,Cross2Icon,FileIcon, ExclamationTriangleIcon, DrawingPinFilledIcon, SewingPinFilledIcon,CheckIcon, ChevronDownIcon, ChevronUpIcon, InfoCircledIcon} from "@radix-ui/react-icons";
import { Dialog, Select,Checkbox } from "radix-ui";


export default function MyEvents({ onGoToReview, setSelectedEvent }: { onGoToReview: () => void; setSelectedEvent: (event: any) => void }) {   
   const [events, setEvents] = useState<any[]>([]);
   const [user_id, setUserID] = useState<number>(0);
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
   const [organizer_by, setOrganizerBy] = useState<string>("");
   const [event_full_description, setEventDescription] = useState<string>("");
   const [event_language, setEventLanguage] = useState<string>("");
   const [is_free, setIsFree] = useState<boolean>(false);
   const [category_result, setCategoryResult] = useState<string>("");
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [uploadSUcess, setUploadSuccess] = useState<boolean>(false);
   const [Sucess, setSuccess] = useState<boolean>(false);


   useEffect(() => {
      const storedUserID = sessionStorage.getItem('user_id');
      if (storedUserID) {
        setUserID(Number(storedUserID));
      }
   }, []);

   useEffect(() => {
     if (user_id !== 0) {
      findMyEvents(); // Llama a findMyEvents solo si user_id es válido
     }
   }, [user_id]);

   const handleSelectChange = (value: string) => {
      if(value == "general"){
         setCategoryResult("general")
      }
      if(value == "junior"){
         setCategoryResult("junior")
      } 
      if(value == "senior"){
         setCategoryResult("senior")
      } 
      if(value == "alevin"){
         setCategoryResult("alevin")
      }
      if(value == "infantil"){
         setCategoryResult("infantil")
      }
   };
   
   
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
   
   const handleFileChange = async (file: File, event_id: number, event_name : string, event_edition: string) => {
      if (!file){
         setError("File is required");
         setTimeout(() => {
            setError("");
         },2000)
            return;
      } 
      
      if (file.type !== "text/csv") {
         setError("Only CSV files are allowed");
         setTimeout(() => {
            setError("");
         },2000)
         return;
       }
      
      const formData = new FormData();
      formData.append("file", file);      

      const responseEvent = await fetch(`http://localhost:8000/event/result/upload/${event_id}?event_name=${event_name}&edition_result=${event_edition}&category_result=${category_result}`, {     
         method: 'POST',
         body: formData, 
      }) 
      if(!responseEvent.ok){
         setError("Error uploading file")
         setTimeout(() => { 
           setError("")
         },2000)
         return;
      }
      setUploadSuccess(true)
      setError("")
      setSelectedFile(null); 
      setCategoryResult("");

      setTimeout(() => {
         setUploadSuccess(false);
      }, 2000); // 3000 ms = 3 segundos
      
   };
   
   const validateForm = (): boolean => {
      const validCategories = ["general", "alevin", "junior", "senior", "infantil"];
     
      const categories = category.split(",").map((cat) => cat.trim());
      const isValidCategory = categories.filter(cat => !validCategories.includes(cat)); 
      
      if (!event_name || !event_type || !event_edition || !category || !location || !celebration_date || !capacity) {
        setError("Data are required");
        setTimeout(() => { 
         setError("")
        },2000)
        return false;
      }

      if (isValidCategory.length > 0) {
         setError("Invalid category");
         setTimeout(() => { 
            setError("")
         },2000)
         return false;
      } 

      if (capacity <= 0) {
         setError("The capacity is not valid")
         setTimeout(() => { 
            setError("")
         },2000)
         return false;
      }
       
      if (description.trim().split(/\s+/).length > 10) {
         setError("Description must not exceed 10 words.");
         setTimeout(() => { 
            setError("")
         },2000)
         return false;
      }


      if (event_full_description.trim().split(/\s+/).length > 30) {
         setError("Description must not exceed 30 words.");
         setTimeout(() => {
            setError("");
         },2000)
         return false;
      }


      if (celebration_date > end_date){
         setError("End date must be after the start date");
         setTimeout(() => { 
            setError("")
         },2000)
         return false;
       }

      setError("");
      return true;
    };

   const findMyEvents = async () => {

        const responseEvent = await fetch(`http://localhost:8000/event/find/myevents/${user_id}`, {     
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
         "capacity" : capacity,
         "organizer_by" : organizer_by,
         "event_full_description" : event_full_description,
         "language" : event_language,
         "is_free" : is_free,
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
      findMyEvents();
      setSuccess(true)
      setTimeout(() => {
         setSuccess(false);
      }, 2000); // 3000 ms = 3 segundos
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
                           data-event-id={event.event_id}
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
                                    <span title = "category" id="event-date">{event.category}</span>    
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
                                    <Badge id="badge-green-event" color="green" variant="solid">
                                       Published
                                    </Badge> :
                                 ((new Date().toISOString() >= event.celebration_date) && (new Date().toISOString() <= event.end_date)) ?  
                                    <Badge id="badge-blue-event" color="blue" variant="solid">
                                          Ongoing
                                    </Badge> :
                                    <Badge id="badge-red-event" color="red" variant="solid">
                                          Finished 
                                    </Badge>                          
                                 } 
                              </div>
                           </Dialog.Trigger>
                           <div id="buttons-myevent" className="flex flex-row gap-2 items-center">
                              <div>
                                 <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                       {(new Date().toISOString() < event.celebration_date) && <Pencil1Icon  data-event-id={event.event_id} id="icon-myevent-update"/>}
                                    </Dialog.Trigger>   
                                    <Dialog.Portal>
                                    <Dialog.Overlay className="DialogOverlay" />
                                    <Dialog.Content className="DialogContentUpdateEvent border-2 border-solid border-white/[.08]">
                                          <Dialog.Title className="DialogTitle">Update event</Dialog.Title>
                                          <Dialog.Description  className="DialogDescription">
                                             Change the event data
                                          </Dialog.Description>  
                                          <div className="flex flex-col gap-3 py-2"> 
                                             <div className="flex flex-row items-center gap-5">
                                                <div className="flex flex-col gap-1">
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
                                                <div className="fflex flex-col gap-1">
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
                                             </div>
                                             <div className="flex flex-row items-center gap-5">
                                                <div className="flex flex-col gap-1">                        
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
                                                <div className="flex flex-col gap-1">                        
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
                                             </div>
                                             <div className="flex flex-row items-center gap-5">
                                                <div className="flex flex-col gap-1">                        
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
                                                <div className="flex flex-col gap-1">                        
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
                                             </div>
                                             <div className="flex flex-row items-center gap-5">
                                                <div className="flex flex-col gap-1">                        
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
                                                <div className="flex flex-col gap-1">                        
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
                                             <div className="flex flex-col gap-1">                        
                                                   <label htmlFor="event-description">Event resume</label>
                                                      <input
                                                         id = "input-event-large"  
                                                         name = "event_description"
                                                         placeholder={event.event_description}
                                                         type="text"
                                                         value={description}
                                                         onChange={(e) => setDescription(e.target.value)}
                                                      />
                                             </div>
                                             <div className="flex flex-row items-center gap-5">
                                                <div className="flex flex-col gap-1">                        
                                                      <label htmlFor="organizer-by">Organizer by</label>
                                                         <input
                                                            id = "input-event-large"  
                                                            name = "organizer-by"
                                                            placeholder="organizer1"
                                                            type="text"
                                                            value={organizer_by}
                                                            onChange={(e) => setOrganizerBy(e.target.value)}
                                                         />
                                                </div>
                                             </div>
                                             <div className="flex flex-row items-center gap-5">
                                                <div className="flex flex-col gap-1">                        
                                                      <label htmlFor="Language">Language</label>
                                                         <input
                                                            id = "input-event"  
                                                            name = "language"
                                                            placeholder="language"
                                                            type="text"
                                                            value={event_language}
                                                            onChange={(e) => setEventLanguage(e.target.value)}
                                                         />
                                                </div>
                                                <div id = "is-free-event" className="flex flex-row gap-2 items-center"  onClick={() => setIsFree(!is_free)}>                        
                                                      {!is_free ? <Checkbox.Root className="CheckboxRoot" id="checkbox-root">
                                                      <Checkbox.Indicator className="CheckboxIndicator">
                                                         <CheckIcon />
                                                      </Checkbox.Indicator>
                                                   </Checkbox.Root> : <Checkbox.Root className="CheckboxRoot" defaultChecked>
                                                      <Checkbox.Indicator className="CheckboxIndicator">
                                                         <CheckIcon />
                                                      </Checkbox.Indicator>
                                                   </Checkbox.Root>}  
                                                   <label htmlFor="organizer-by">Is free?</label>
                                                </div>
                                             </div>
                                             <div className="flex flex-col gap-1">
                                                <label htmlFor="Event Description">Event Description</label>
                                                   <TextArea 
                                                   id= "input-event-big"
                                                   name = "description"
                                                   placeholder="My event is about..." 
                                                   value = {event_full_description} 
                                                   onChange = {(e) => setEventDescription(e.target.value)} 
                                                   typeof="text"
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
                                             <Callout.Root id = "callout-root-event-update" color="red" size="2" variant="soft" className="flex items-center ">
                                                <Callout.Icon className="callout-icon-event-update" >
                                                   <ExclamationTriangleIcon  />
                                                </Callout.Icon>
                                                <Callout.Text className="callout-text-event-update"> {error} </Callout.Text> 
                                             </Callout.Root> }
                                          {Sucess && 
                                             <Callout.Root id = "callout-root-event-update" color="green" size="2" variant="soft" className="flex items-center ">
                                                <Callout.Icon className="callout-icon-event-update" >
                                                   <InfoCircledIcon  />
                                                </Callout.Icon>
                                                <Callout.Text className="callout-text-event-update"> Event updated success </Callout.Text> 
                                             </Callout.Root> }   
                                       </Dialog.Content> 
                                    </Dialog.Portal>           
                                 </Dialog.Root>    
                              </div>                        
                              <div>
                                 <AlertDialog.Root>
                                    {(new Date().toISOString() < event.celebration_date || new Date().toISOString() > event.end_date) && 
                                       <AlertDialog.Trigger>
                                          <TrashIcon data-event-id={event.event_id} id="icon-myevent-delete"/>
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
                                    {(new Date().toISOString() > event.end_date) && <FileIcon data-event-id={event.event_id} id="file-myevent"/>}
                                 </Dialog.Trigger>   
                                 <Dialog.Portal>
                                    <Dialog.Overlay className="DialogOverlay" />
                                    <Dialog.Content className="DialogContentUpload border-2 border-solid border-white/[.08]">
                                       <Dialog.Title className="DialogTitle">Event Result</Dialog.Title>
                                       <Dialog.Description  className="DialogDescription">
                                          Upload event result
                                       </Dialog.Description>  
                                       <div className="flex flex-col items-center gap-4">
                                          <div className="flex flex-row items-center gap-2 items-center">
                                             <label htmlFor="event_name">CSV file</label>
                                             <div className="border-2 border-solid border-white/[.08]">
                                                <input
                                                   id = "input-upload"  
                                                   name = "event_name"
                                                   type="file"
                                                   placeholder="Select the file..."
                                                   onChange={(e) => {
                                                      const file = e.target.files?.[0];
                                                      if (file) {
                                                         setSelectedFile(file); 
                                                      }
                                                   }}
                                                />
                                             </div>
                                          </div>
                                          <div className="flex flex-row items-center gap-2 items-center">
                                             <label htmlFor="event_name">Event category</label>
                                                <div id="filter-by-edition-event">
                                                   <Select.Root onValueChange={(value) => handleSelectChange(value)}>
                                                      <Select.Trigger className="SelectTrigger border-2 border-solid border-white/[.08]" aria-label="Food">
                                                         <Select.Value placeholder="Select category" />
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
                                                                  <Select.Label className="SelectLabel">Category</Select.Label>
                                                                  {event.category.split(",").map((category : any, index : any) => (
                                                                     <SelectItem key={index} value={category.trim()}>
                                                                        {category.trim()}
                                                                     </SelectItem>
                                                                  ))}
                                                               </Select.Group>
                                                            </Select.Viewport>
                                                            <Select.ScrollDownButton className="SelectScrollButton">
                                                               <ChevronDownIcon />
                                                            </Select.ScrollDownButton>
                                                         </Select.Content>
                                                      </Select.Portal>
                                                   </Select.Root>
                                                </div>
                                          </div>
                                          <Button id = "button-upload" onClick={() => {
                                             if (selectedFile && category_result) {
                                                handleFileChange(selectedFile, event.event_id, event.event_name, event.event_edition);
                                             }
                                             else{
                                                setError('A CSV file and a category are required.')
                                                setTimeout(() => {
                                                   setError('')
                                                },2000)
                                             } 
                                          }}>Upload</Button>
                                          {error && 
                                             <Callout.Root id = "callout-root-upload-error" color="red" size="2" variant="soft" className="flex items-center ">
                                                <Callout.Icon className="callout-icon-upload" >
                                                   <ExclamationTriangleIcon  />
                                                </Callout.Icon>
                                                <Callout.Text className="callout-text-upload"> {error} </Callout.Text> 
                                             </Callout.Root>}
                                          {uploadSUcess && 
                                             <Callout.Root id = "callout-root-upload" color="green" size="2" variant="soft" className="flex items-center ">
                                                <Callout.Icon className="callout-icon-upload" >
                                                   <InfoCircledIcon  />
                                                </Callout.Icon>
                                                <Callout.Text className="callout-text-upload"> File uploaded successfully </Callout.Text> 
                                             </Callout.Root>}   
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
                           <Dialog.Close asChild>
                              <div id = "div-register-inscription"className="flex items-center">
                                 <Button
                                    variant="soft" color = "pink"
                                    onClick={() => {
                                       setSelectedEvent(event); // Guarda los datos del evento seleccionado
                                       onGoToReview(); // Navega a la sección "review"
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