"use client"
import * as React from "react";
import { Heading,Box, Button,TextArea,Badge,SegmentedControl}  from "@radix-ui/themes";
import { useState, useEffect, Key} from "react";
import classnames from "classnames";
import {DrawingPinFilledIcon,  SewingPinFilledIcon,PersonIcon} from "@radix-ui/react-icons"

import { MixIcon,StarFilledIcon,StarIcon, CheckIcon,Cross2Icon,ArrowUpIcon,ArrowDownIcon, ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons";
import { Dialog, Select } from "radix-ui";

export default function Review({ event }: { event: any }) {
   
   const [user_id, setUserID] = useState<number>(0);
   const [user_name, setUserName] = useState<string>("");
   const [isOrganizer, setOrganizer] = useState<boolean>(false);
   const [isRegister, setRegister] = useState<boolean>(false);
   const [reviews, setReviews] = useState<any[]>([]);
   const [eventResults, setEventResults]  = useState<any>("");
   const [eventResultsHeaders, setEventResultsHeaders]  = useState<String[]>([]);
   const [eventResultsData, setEventResultsData]  = useState<{ participant_name: string; position: string; time: string; score: string; category: string; }[]>([]);
   const [reviewContent, setReviewsContent] = useState<string>("");
   const [rating, setRating] = useState<number>(0);
   const [visibleReviews, setVisibleReviews] = useState<number>(4); 
   const [review_index, setReviewIndex] = useState<number>(0); 
   const [edition_result, setEditionResult] = useState<string>("");
   const [category_result, setCategoryResult] = useState<string>("")
   const [notification,setNotification] = useState<string>("");
   const [visibleResult, setVisibleResult] = useState<boolean>(true);
   const [selectedSegment, setSelectedSegment] = useState<string>("");
   const [selectedSelect, setSelectedSelect] = useState<string>("");

   
   useEffect(() => {  
      const storedUserID = localStorage.getItem('user_id');
      if (storedUserID) {
      setUserID(parseInt(storedUserID));
      }
      const storedValue = localStorage.getItem('organizer');
      if (storedValue !== null) {
         setOrganizer(JSON.parse(storedValue));
      }

      const storedUserName = localStorage.getItem('user_name');
      if(storedUserName){
         setUserName(storedUserName)
      }
      findEventResults(event.event_id, edition_result,category_result) 
   }, []);

   useEffect(() => {
      if (event && user_id) {
        findInscription(user_id, event.event_id);
      }
    }, [event, user_id]);

   useEffect(() => {
      if (event && event.event_id) {
         findReviews(event.event_id);
      }
   },[event.event_id])

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

   const processCsvData = (csvData: string) => {
      
      const rows = csvData.trim().split("\n");  
      const headers = rows[0].split(",");
      const dataRows = rows.slice(1).map((row) => {
         const cols = row.split(",");
         return {
           participant_name: cols[0], 
           category: cols[1], 
           position: cols[2], 
           time:  cols[3],
           score: cols[4], 
           team: cols[5], 
           country : cols[6]
         };
       });
      
      return {headers, dataRows}; 
   }
   const handleSelectCategory = (value: string) => {
      if(value == "general"){
         setCategoryResult(value)
      }
      if(value == "junior"){
         setCategoryResult(value)
      } 
      if(value == "senior"){
         setCategoryResult(value)
      } 
      if(value == "alevin"){
         setCategoryResult(value)
      }
      if(value == "infantil"){
         setCategoryResult(value)
      }
      if(value == "2024-2025"){
         setEditionResult(value)
      }
      if(value == "2023-2024"){
         setEditionResult(value)
      }
   };
   

    
   const createInscription = async (event_id : number,event_name : string, event_type:string, event_edition: string, category:string, event_description:string, location:string, celebration_date:string, end_date: string, capacity: number, organizer_by: string, duration: number, event_full_description: string, language : string, is_free : boolean) => {

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
        return;
      }
      setRegister(true)

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
         "capacity" : capacity - 1,
         "organizer_by" : organizer_by,
         "duration" : duration,
         "event_full_description" : event_full_description,
         "language" : language,
         "is_free" : is_free
      }


      const responseEvent = await fetch(`http://localhost:8000/event/update/${event_name}`, {
         method: 'PUT',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetailsEvent)
      });

      if (!responseEvent.ok) {
         return;
      }
   }

   const findInscription = async (user_id : number,event_id : number) => {
      
      const response = await fetch(`http://localhost:8000/inscription/find/${user_id}/${event_id}`, {
         method: 'GET',
      });

      if (!response.ok) {
         setRegister(false)
         return;
      }
      else{
         setRegister(true)
         return;
      }
   }

   const createReview = async () => {
    
      const formDetails = 
      {
         "event_id" : event.event_id,
         "user_id" : user_id,
         "user_name" : user_name,
         "review_text" : reviewContent,
         "review_rating" : rating
      }

      const responseReview = await fetch(`http://localhost:8000/review/register`, {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetails)
      })        
      const data = await responseReview.json();
      if(!responseReview.ok){
         return;
      }
      findReviews(event.event_id);
      setReviewsContent('')
      setRating(0);
   }

   const findReviews = async (event_id : number) => {
  
      const responseReview = await fetch(`http://localhost:8000/review/find/${event_id}`, {
         method: 'GET',
      })

      if (!responseReview.ok) {
         return;
      }
      const data = await responseReview.json();
      setReviews(data);
      return;
   }

   const findEventResults = async (event_id: number, edition_result:string, category_result:string) => {
      
      const responseResult = await fetch(`http://localhost:8000/event/result/find/${event_id}/${edition_result}/${category_result}`, {
         method: 'GET',
      })   
      if (!responseResult.ok){
         setVisibleResult(false)
         return;
      }
      const data = await responseResult.json();
      if (data.csv_file) {
         const csvData = data.csv_file; // Accede al contenido del CSV
         const { headers, dataRows } = processCsvData(csvData); // Procesa el CSV
         setEventResultsHeaders(headers); // Actualiza las cabeceras
         setEventResultsData(dataRows); // Actualiza las filas de datos
         setVisibleResult(true);
      }      
      else{
         setVisibleResult(false);
      }
   }

   const showMoreReviews = () => {
      if (visibleReviews < reviews.length) {
        setVisibleReviews(visibleReviews + 4); // Muestra 5 más
        setReviewIndex(review_index+1); 
      }
    };
    
    const showLessReviews = () => {
      if (visibleReviews > 4) {
        setVisibleReviews(visibleReviews - 4); // Muestra 5 menos
        setReviewIndex(review_index-1)
      }
    };

   return ( 
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">Events results and reviews</Heading>  
      </div>
      <div id = "filter-info" className="flex flex-row gap-2 justify-between"> 
         <div id="event-info-comments" className="flex flex-col gap-2 h-full">
            <div id = "even-information" className="flex flex-col p-5 border-2 border-solid border-white/[.08]">
                  <div className="flex flex-row justify-between items-center">
                     <Heading id = "event-info-heading" className="text-3xl font-bold mb-4"> {event.event_name} Information</Heading>
                      {(new Date().toISOString() < event.celebration_date) ? 
                        <Badge id="badge-review" color="green" variant="solid">
                              Published
                        </Badge> :
                     ((new Date().toISOString() >= event.celebration_date) && (new Date().toISOString() <= event.end_date)) ?  
                        <Badge id="badge-review" color="blue" variant="solid">
                              Ongoing
                        </Badge> :
                        <Badge id="badge-review" color="red" variant="solid">
                              Finished  
                        </Badge>                          
                     }
                  </div>
                  <div id ="div-all-info" className="grid grid-cols-2 gap-2 text-sm">
                     <div id="first-info-col"><strong>Type:</strong> {event.event_type}</div>
                     <div className="flex flex-row gap-1" id="second-info-col"><strong className="flex flex-row gap-1"> <DrawingPinFilledIcon/> Category:</strong> {event.category}</div>
                     <div  className="flex flex-row gap-1" id="first-info-col"><strong className="flex flex-row gap-1"> <SewingPinFilledIcon/> Location:</strong> {event.location}</div>
                     <div className="flex flex-row gap-1" id="second-info-col"><strong className="flex flex-row gap-1" > <PersonIcon/> Capacity:</strong> {event.capacity} places</div>
                     <div id="first-info-col"><strong>Start date:</strong> {event.celebration_date.split("T")[0]} {event.celebration_date.split("T")[1]}</div>
                     <div id="second-info-col"><strong>End date:</strong> {event.end_date.split("T")[0]} {event.end_date.split("T")[1]}</div>
                     <div id="first-info-col"><strong>Organizer by:</strong> {event.organizer_by}</div>
                     <div id="second-info-col"><strong>Duration:</strong> {event.duration} days </div>
                     <div id="first-info-col"> <strong>Language:</strong> {event.language}</div>
                     <div id="second-info-col"><strong>Free:</strong> {event.is_free == true ? "Yes": "No"}</div>
                     <div className="flex flex-row items-center gap-1">
                     {!isOrganizer && (
                        <>
                           <strong id="first-info-col">Status:</strong>
                           {!isRegister ? (
                           <span className="flex flex-row items-center gap-1 text-red-600">
                              Not Registered <Cross2Icon />
                           </span>
                           ) : (
                           <span className="flex flex-row items-center gap-1 text-green-600">
                              Registered <CheckIcon />
                           </span>
                           )}
                        </>
                     )}
                     </div>
                     <div> { !isOrganizer && (new Date().toISOString() < event.celebration_date) && !isRegister && <Button id = "button-inscription" onClick={()=> createInscription(event.event_id,event.event_name, event.event_type,event.event_edition, event.category, event.event_description, event.location, event.celebration_date, event.end_date, event.capacity, event.organizer_by, event.duration, event.event_full_description, event.language, event.is_free)}>Register</Button>}</div>  

                  </div>
                  <div id="description-full-event">
                     <p className="mt-4">{event.event_full_description}</p>
                  </div>
            </div>
            <Dialog.Root>
               <Dialog.Trigger>
                  <div id= "event-comments" className="p-6 flex flex-col border-2 border-solid border-white/[.08] flex-grow">
                     <Heading id = "comments-heading" className="text-3xl font-bold mb-1">Comments and Reviews</Heading> 
                        {reviews.length > 0 ? (  
                           reviews.slice(0,3).map((review,index) => (
                              <Box id ="box-review" key={event.review_id || index} className="flex flex-col border-2 border-solid border-white/[.08]">
                                 <div id = "rating-review" className="flex flex-row items-center gap-2">
                                       <div  className="flex flex-row">
                                          {Array.from({ length: review.review_rating }).map((_, index) => (
                                             <StarFilledIcon key={`filled-${index}`} />
                                          ))}
                                          {Array.from({ length: 5 - review.review_rating }).map((_, index) => (
                                             <StarIcon key={`empty-${index}`} />
                                          ))}
                                       </div>
                                       <span id="text-review">{review.review_text}</span>
                                 </div>
                                 <div id="name-review" className="flex flex-row items-center gap-2">
                                       <span> {review.user_name}</span>
                                 </div>

                              </Box>    
                           ))) : (
                              <Box id = "no-box-review" className="flex flex-col gap-2 border-2 border-solid border-white/[.08] ">
                                 <label id= "label-no-data">No reviews to show</label>
                                 <MixIcon id = "no-data-icon"/>
                              </Box>    
                           )
                        }
                  </div>                
               </Dialog.Trigger> 
                  <Dialog.Portal>
                     <Dialog.Overlay className="DialogOverlayReview" />
                     <Dialog.Content className="DialogContentReview border-2 border-solid border-white/[.08] ">
                        <Dialog.Title className="DialogTitle">Comments and reviews</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                           Create and view comments and reviews
                        </Dialog.Description>
                        {(new Date().toISOString() > event.end_date) ? (                        
                           <div className="flex flex-row">
                              <div id ="div-title-and-reviews" className="flex flex-col border-2 border-solid border-white/[.08]">
                                 <Heading  id="heading-review">Reviews</Heading>
                                 <div id="div-reviews">
                                    {reviews.length > 0 ? (  
                                       reviews.slice(review_index,visibleReviews).map((review,index) => (
                                          <Box id ="box-review-view" key={event.review_id || index} className="flex flex-col border-2 border-solid border-white/[.08]">
                                             <div id = "rating-review-view" className="flex flex-row items-center gap-2">
                                                   <div  className="flex flex-row">
                                                      {Array.from({ length: review.review_rating }).map((_, index) => (
                                                         <StarFilledIcon key={`filled-${index}`} />
                                                      ))}
                                                      {Array.from({ length: 5 - review.review_rating }).map((_, index) => (
                                                         <StarIcon key={`empty-${index}`} />
                                                      ))}
                                                   </div>
                                                   <span id="text-review">{review.review_text}</span>
                                             </div>
                                             <div id="name-review" className="flex flex-row items-center gap-2">
                                                   <span> {review.user_name}</span>
                                             </div>

                                          </Box>    
                                       ))) : (
                                          <Box id = "no-box-review-view" className="flex flex-col gap-5 ">
                                             <label id= "label-no-data">No reviews to show</label>
                                             <MixIcon id = "no-data-icon"/>
                                          </Box>    
                                       )
                                    }
                                    {(review_index == 0) ? 
                                       <ArrowUpIcon id="arrow-up" onClick={showLessReviews} color='#808080' />:
                                       <ArrowUpIcon id="arrow-up" onClick={showLessReviews}/>  
                                    }  
                                    {visibleReviews >= reviews.length ? 
                                    <ArrowDownIcon id="arrow-down" onClick={showMoreReviews} color='#808080'/> :
                                    <ArrowDownIcon id="arrow-down" onClick={showMoreReviews}/>
                                    }                               
                                 </div>
                              </div>
                              {!isOrganizer && isRegister && (
                                 <div id="div-create-review" className="flex flex-col py-4 border-2 border-solid border-white/[.08]"> 
                                    <div className="flex flex-col">
                                       <Heading id="label-review">Leave a review</Heading>
                                       <div id="div-star" className="flex flex-row py-3">
                                          {Array.from({ length: 5 }).map((_, index) => (
                                             <div key={index} onClick={() => setRating(index + 1)}>
                                             {index < rating ? (
                                             <StarFilledIcon id="star-filled-review" />
                                             ) : (
                                             <StarIcon id="star-review" />
                                             )}
                                          </div>
                                          ))}  
                                       </div> 
                                       <TextArea 
                                          id= "input-create-review"
                                          placeholder="Write you review here..." 
                                          value = {reviewContent} 
                                          onChange = {(e) => setReviewsContent(e.target.value)} 
                                          typeof="text"
                                          className="flex flex-col"
                                       />

                                    </div>
                                    <div className="flex flex-row">
                                       {reviewContent=='' || rating==0 ? 
                                       <Button id="button-create-review" color="violet" onClick={createReview} disabled={true}>Submit</Button> :
                                       <Button id="button-create-review" color="violet" onClick={createReview}>Submit</Button>
                                       }
                                    </div>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <Box id = "no-box-review-event-no-finish" className="flex flex-col gap-5  border-2 border-solid border-white/[.08] ">
                              <label id= "label-no-data">The event didn`t end</label>
                              <MixIcon id = "no-data-icon"/>
                           </Box>    
                        ) }
                     </Dialog.Content>                                  
                  </Dialog.Portal>
            </Dialog.Root>
         </div>
         <div id="event-results" className = "flex flex-col border-2 border-solid border-white/[.08] p-6 gap-4 ">
            <Heading className="text-3xl font-bold mb-4">Results</Heading>
            
            {(new Date().toISOString() > event.end_date) ? (
               <><SegmentedControl.Root onValueChange={(value) => handleSelectCategory(value)} variant="surface" id="segment-root" defaultValue="inbox">
                     {!event.category.includes(",") && <SegmentedControl.Item id="segment-item" value={event.category} className="border-2 border-solid border-white/[.08]"
                        data-state={selectedSegment === event.category ? "on" : "off"}
                        onClick={() => setSelectedSegment(event.category)}
                     >{event.category}</SegmentedControl.Item>}
                     {event.category.split(",").length >= 2 ? (
                        event.category.split(",").map((Item: string, index: Key | null | undefined) => (
                           <SegmentedControl.Item
                              key={index}
                              id="segment-item"
                              data-state={selectedSegment === Item.trim() ? "on" : "off"}
                              onClick={() => setSelectedSegment(Item.trim())}
                              value={Item.trim()}
                              className="border-2 border-solid border-white/[.08]"

                           >
                              {Item.trim()}
                           </SegmentedControl.Item>
                        ))
                     ) : null}
                  </SegmentedControl.Root><Select.Root onValueChange={(value) => { handleSelectCategory(value); } }>
                        <Select.Trigger className="SelectTrigger border-2 border-solid border-white/[.08]" aria-label="Food">
                           <Select.Value placeholder="Select edition..." />
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
                                    <Select.Label className="SelectLabel">Edition</Select.Label>
                                    <SelectItem id="select-item" value="2024-2025"
                                       data-state={selectedSelect === "2024-2025" ? "on" : "off"}
                                       onClick={() => setSelectedSelect("2024-2025")}
                                    >2024-2025</SelectItem>
                                    <SelectItem id="select-item" value="2023-2024"
                                       data-state={selectedSelect === "2023-2024" ? "on" : "off"}
                                       onClick={() => setSelectedSelect("2023-2024")}
                                    >2023-2024</SelectItem>
                                 </Select.Group>
                              </Select.Viewport>
                              <Select.ScrollDownButton className="SelectScrollButton">
                                 <ChevronDownIcon />
                              </Select.ScrollDownButton>
                           </Select.Content>
                        </Select.Portal>
                     </Select.Root><div id="div-table-result" className="flex justify-center overflow-y-auto custom-scroll">
                        {eventResultsData.length > 0 && visibleResult ? (
                           <table id="table-result" className="border border-gray-300">
                              <thead className="bg-purple-100">
                                 <tr id="table-head">
                                    {eventResultsHeaders.map((header, index) => (
                                       <th key={index} className="border p-2">{header}</th>
                                    ))}
                                 </tr>
                              </thead>
                              <tbody>
                                 {eventResultsData.map((data, index) => (
                                    <tr id="table-data" key={index} className="border border-gray-300">
                                       <td className="border border-gray-300 p-2">{data.participant_name}</td>
                                       <td className="border border-gray-300 p-2">{data.category}</td>
                                       <td className="border border-gray-300 p-2">{data.position}</td>
                                       <td className="border border-gray-300 p-2">{data.time}</td>
                                       <td className="border border-gray-300 p-2">{data.score}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        ) : (
                           <Box id="no-box-result" className="flex flex-col gap-5  border-2 border-solid border-white/[.08]">
                              <label id="label-no-data">No results to show</label>
                              <MixIcon id="no-data-icon" />
                           </Box>
                        )}
                     </div><Button id="button-upload" onClick={() => {
                        if (edition_result && category_result) {
                           findEventResults(event.event_id, edition_result, category_result);
                        }
                        else setNotification('No CSV');
                     } }>Upload</Button>
                     {notification && <p>{notification}</p>}
                     </> 
            ):(
               <Box id="no-box-result-event-no-finish" className="flex flex-col gap-3  border-2 border-solid border-white/[.08] ">
                  <label id="label-no-data">No results to show</label>
                  <MixIcon id="no-data-icon" />
               </Box>
            )}
            
         
         </div>
       {/* {(new Date().toISOString() >= event.end_date) ? 
       //    <div>
       //          Este es el resultado     
       //    </div> : 
       //    <Box
       //     id = "no-box-event-result"
       //     className="flex flex-col gap-5 "
       //     >
       //     <MixIcon id = "no-data-icon"/>
       //</div>     <label id= "label-no-data">No result to show</label> 
       //     </Box>                               
       //  }*/}
      </div>
   </div>
   )
}