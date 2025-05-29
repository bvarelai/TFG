"use client"
import * as React from "react";
import { registerInscription } from "../paypalUtils"; // Ajusta la ruta según tu estructura
import { Heading,Box, Button,TextArea,Badge,SegmentedControl, Text, Radio}  from "@radix-ui/themes";
import { useState, useEffect, Key} from "react";
import classnames from "classnames";
import { RadioGroup } from "radix-ui";
import { MixIcon,StarFilledIcon,StarIcon, CheckIcon,Cross2Icon,ArrowUpIcon,ArrowDownIcon, ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons";
import { Dialog, Select } from "radix-ui";

import { randomUUID } from "crypto";

export default function Review({ event }: { event: any }) {

   const [openDialog, setOpenDialog] = useState(false);
   const [tokenPayPal, setTokenPaypal] = useState<string>("");
   const [tokenExpiry, setTokenExpiry] = useState<number>(0);
   const [user_id, setUserID] = useState<number>(0);
   const [user_name, setUserName] = useState<string>("");
   const [isOrganizer, setOrganizer] = useState<boolean>(false);
   const [isRegister, setRegister] = useState<boolean>(false);
   const [reviews, setReviews] = useState<any[]>([]);
   const [index, setIndex]  = useState<number>(0);
   const [eventResultsHeaders, setEventResultsHeaders]  = useState<String[]>([]);
   const [eventResultsData, setEventResultsData]  = useState<string[][]>([]);
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
   const [selectPaypal, setSelectPaypal] = useState<boolean>(false);
   const startDate = new Date(event.celebration_date).toISOString().split("T")[0];
   const endDate = new Date(event.end_date).toISOString().split("T")[0];   
   const start = new Date(event.celebration_date);
   const end = new Date(event.end_date);
   const formattedStartDate = new Date(startDate).toLocaleDateString('en-US',{year: 'numeric', month: 'long', day: 'numeric'});
   const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
   const [categoryInscription, setCategoryInscription] = useState<string>("");
   const [selectedCategory, setSelectedCategory] = useState<string>("");

   useEffect(() => {  
      const storedUserID = sessionStorage.getItem('user_id');
      if (storedUserID) {
      setUserID(parseInt(storedUserID));
      }
      const storedValue = sessionStorage.getItem('organizer');
      if (storedValue !== null) {
         setOrganizer(JSON.parse(storedValue));
      }

      const storedUserName = sessionStorage.getItem('user_name');
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

   useEffect(() => {
      const updateVisibleReviews = () => {
         if (window.matchMedia("(max-width: 707px)").matches) {
            setVisibleReviews(3);
            setIndex(3)
         } else if (window.matchMedia("(max-width: 1024px)").matches) {
            setVisibleReviews(4);
            setIndex(4)
         } else {
            setVisibleReviews(6);
            setIndex(6)
         }
      };

      updateVisibleReviews();

      window.addEventListener("resize", updateVisibleReviews);

      return () => {
         window.removeEventListener("resize", updateVisibleReviews);
      };
   }, []);

   useEffect(() => {
      const checkCancel = () => {
         if (sessionStorage.getItem("paypal_cancel") === "1") {
            setOpenDialog(false);
            setSelectPaypal(false);
            setSelectedCategory("");
            sessionStorage.removeItem("paypal_cancel");
         }
      };
      window.addEventListener("focus", checkCancel);
      return () => window.removeEventListener("focus", checkCancel);
   }, []);

   useEffect(() => {
    const checkAccept = () => {
         if (sessionStorage.getItem("paypal_accept") === "1") {
            setOpenDialog(false);
            setSelectPaypal(false);
            setSelectedCategory("");
            sessionStorage.removeItem("paypal_accept");
         }
      };
      window.addEventListener("focus", checkAccept);
      return () => window.removeEventListener("focus", checkAccept);
   }, []);


   useEffect(() => {
    if (edition_result && category_result) {
      findEventResults(event.event_id, edition_result, category_result);
    }
   } ,[edition_result, category_result]);

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
         return cols;
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
   

   const getTokenPayPal = async () => {
      
      const clientId = "AXakwYqmd8PphTBOtOof0v-jX8MkPdpHljszEmeSQh-FNbSDSo12W8zb0qDAYD5nJ4ZbkKQFbgrFwCqi";
      const clientSecret = "EJ0a166KijEwMxv38NtMdc_BmcyehpiNSSFdu815iyvPxqxofUQWte2sMCVLCNildYv7Nmwz27DJNVt7";
      const credentials = btoa(`${clientId}:${clientSecret}`);

      const responsePayPal = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
         method : "POST",
         headers : {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${credentials}`,
         },
         body: "grant_type=client_credentials",
      })

      if(!responsePayPal.ok){
         setNotification("Error getting token");
         return;
      }
      const data = await responsePayPal.json();
      if(data.access_token) {
         setTokenPaypal(data.access_token)
         sessionStorage.setItem("token", data.access_token);
         setTokenExpiry(Date.now() + data.expires_in * 1000);
         return data.access_token;
      }
      return null;
   }

   const realisePaidPayPal = async(token: string, category_inscription : string) => {

      const responsePayPal = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
         },
         body: JSON.stringify({
            "intent": "CAPTURE",
            "purchase_units": [
               { "amount": { "currency_code": "EUR", "value": (event.language) } }
            ],
            "application_context": {
               "return_url": "http://localhost:3000/paypal/accept",

               "cancel_url": "http://localhost:3000/paypal/cancel",
            }
         })
      })
      if(!responsePayPal.ok){
         setNotification("Error creating order");
         return null;
      }
      const data = await responsePayPal.json();
      const approveLink = data.links?.find((link: { rel: string; }) => link.rel === "approve")?.href;
      if (approveLink) {
         window.location.href = approveLink;  
      } else {
         setNotification("No approval link from PayPal");
      } 
      return data.id;   
   }

   

   const createInscription = async (event_name : string, event_type:string, event_edition: string, category:string, category_inscription: string, event_description:string, location:string, celebration_date:string, end_date: string, capacity: number, organizer_by: string, event_full_description: string, language : string, is_free : boolean) => {

      sessionStorage.setItem("event", JSON.stringify(event));
      sessionStorage.setItem("category_inscription", category_inscription);

      if(!is_free){
         let token = tokenPayPal 
         if(!token || Date.now() > tokenExpiry){
            token = await getTokenPayPal();
            if(!token){
               setNotification("No token");
               return;
            }
         }
         const orderId =  await realisePaidPayPal(token, category_inscription);
         if(!orderId){
            setNotification("No order");
            return;
         }
         return;
      }      
      let register = await registerInscription(event,user_id,event_name, event_type, event_edition, category, category_inscription, event_description, location, celebration_date, end_date, capacity, organizer_by, event_full_description, language, is_free);
      setRegister(register)
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
  
      const responseReview = await fetch(`http://localhost:8000/review/event/find/${event_id}`, {
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
         const csvData = data.csv_file; 
         const { headers, dataRows } = processCsvData(csvData); 
         setEventResultsHeaders(headers); 
         setEventResultsData(dataRows); 
         setVisibleResult(true);
      }      
      else{
         setVisibleResult(false);
      }
   }

   const showMoreReviews = () => {
      if (visibleReviews < reviews.length) {
        setVisibleReviews(visibleReviews + index); 
        setReviewIndex(review_index+index); 
      }
    };
    
    const showLessReviews = () => {
      if (visibleReviews > 4) {
        setVisibleReviews(visibleReviews - index);
        setReviewIndex(review_index-index)
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
                      {new Date() < new Date(event.celebration_date) ? 
                        <Badge id="badge-review-green" color="green" variant="solid">
                              Published
                        </Badge> :
                     ((new Date() >= new Date(new Date(event.celebration_date).getFullYear(), new Date(event.celebration_date).getMonth(), new Date(event.celebration_date).getDate())) && (new Date() <= new Date(new Date(event.end_date).getFullYear(), new Date(event.end_date).getMonth(), new Date(event.end_date).getDate() + 1))) ?  
                        <Badge id="badge-review-blue" color="blue" variant="solid">
                              Ongoing
                        </Badge> :
                        <Badge id="badge-review-red" color="red" variant="solid">
                              Finished  
                        </Badge>                          
                     }
                  </div>
                  <div id ="div-all-info" className="grid grid-cols-2 gap-2 text-sm">
                     <div id="first-info-col"><strong>Type:</strong> {event.event_type} </div>
                     <div className="flex flex-row gap-1" id="second-info-col"><strong className="flex flex-row gap-1"> Category:</strong> {event.category}</div>
                     <div  className="flex flex-row gap-1" id="first-info-col"><strong className="flex flex-row gap-1"> Location:</strong> {event.location}</div>
                     <div className="flex flex-row gap-1" id="second-info-col"><strong className="flex flex-row gap-1" > Capacity:</strong> {event.capacity} places</div>
                     <div id="first-info-col"><strong>From:</strong> {event.celebration_date ? formattedStartDate: "N/A"} {event.celebration_date ? event.celebration_date.split("T")[1]: "N/A"}</div>
                     <div id="second-info-col"><strong>To:</strong> {event.end_date ? formattedEndDate: "N/A"} {event.end_date ? event.end_date.split("T")[1]: "N/A"}</div>
                     <div id="first-info-col"><strong>Organizer by:</strong> {event.organizer_by}</div>
                     <div id="second-info-col"><strong>Duration:</strong> {Math.ceil((end.getTime() - start.getTime())/(1000 * 60 * 60 * 24))} days </div>
                     <div id="first-info-col"><strong>Free:</strong> {event.is_free == true ? "Yes": "No"}</div>
                     {!event.is_free && <div id="second-info-col"> <strong>Price:</strong> {event.language} €</div> }
                     <div className="flex flex-row items-center gap-1">
                     {!isOrganizer && (
                        <>
                           {event.is_free ? <strong id="second-info-col">Status:</strong> : <strong id="first-info-col">Status:</strong>} 
                           {!isRegister ? (
                           <span id="register-status" className="flex flex-row items-center gap-1 text-red-600">
                              Not Registered <Cross2Icon />
                           </span>
                           ) : (
                           <span id="register-status" className="flex flex-row items-center gap-1 text-green-600">
                              Registered <CheckIcon />
                           </span>
                           )}
                        </>
                     )}
                     </div>
                  </div>
                  <div id="description-full-event">
                     <p className="mt-4">{event.event_full_description}</p>
                  </div>
                  <div> 
                  {!isOrganizer && (new Date().toISOString() < event.celebration_date) && !isRegister &&
                     (
                        <Dialog.Root  open={openDialog} onOpenChange={setOpenDialog} >
                           <Dialog.Trigger asChild>
                              <Button id = "button-inscription" color="violet" onClick={() => setOpenDialog(true)}>Register</Button> 
                           </Dialog.Trigger>
                           <Dialog.Portal>
                              <Dialog.Overlay className="DialogOverlayReview" />
                              <Dialog.Content className="DialogContentRegisterInscription border-2 border-solid border-white/[.08] ">
                                 <Dialog.Title className="DialogTitle">Register for a Event</Dialog.Title>
                                 <Dialog.Description className="DialogDescription">
                                   Select a category to register: 
                                 </Dialog.Description>
                                    <div className="flex flex-col gap-1" id="div-inscription">
                                       {event.category.split(",").map((category : any) => (
                                          <div key = {category} className="flex flex-row gap-3 items-center"
                                             onClick={() => setCategoryInscription(category)}>                                            
                                             	<RadioGroup.Root
                                                   className="RadioGroupRoot"
                                                   value={selectedCategory} 
                                                   onValueChange={(value) => {
                                                      setSelectedCategory(value); 
                                                      setCategoryInscription(value);
                                                   }}
                                                   aria-label="Select a category"
                                                >
                                                   <div style={{ display: "flex", alignItems: "center" }}>
                                                      <RadioGroup.Item id= "radio-item" className="RadioGroupItem border-2 border-solid border-white/[.08]" value={category}>
                                                         <RadioGroup.Indicator className="RadioGroupIndicator" />
                                                      </RadioGroup.Item>
                                                      <label className="Label" htmlFor="r1">
                                                         {category}
                                                      </label>
                                                   </div>
                                                </RadioGroup.Root>
                                          </div>  
                                       ))}
                                    </div>
                                    {!event.is_free ? (
                                       <>
                                       <Button id="button-realize-inscription-paypal" variant="solid" color="indigo" onClick={() => createInscription(event.event_name, event.event_type, event.event_edition, event.category, categoryInscription, event.event_description, event.location, event.celebration_date, event.end_date, event.capacity, event.organizer_by, event.event_full_description, event.language, event.is_free)} disabled={!(categoryInscription)}>PayPal</Button></>    
                                    ) : (
                                       <Button id="button-realize-inscription" variant="solid" color="violet" onClick={() => createInscription(event.event_name, event.event_type, event.event_edition, event.category, categoryInscription, event.event_description, event.location, event.celebration_date, event.end_date, event.capacity, event.organizer_by, event.event_full_description, event.language, event.is_free)} disabled={!(categoryInscription)}>Accept</Button>       
                                    )}
                                    {notification}
                              </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>                    
                     )
                  }
                  </div>  
            </div>
            <Dialog.Root>
               <Dialog.Trigger>
                  <div id= "event-comments" className="p-6 flex flex-col border-2 border-solid border-white/[.08]">
                     <Heading id = "comments-heading" className="text-3xl font-bold mb-1">Comments and Reviews</Heading> 
                        {reviews.length > 0 ? (  
                           reviews.slice(0,4).map((review,index) => (
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
                           <div id= "div-create-and-view-reviews"className="flex flex-row">
                              <div id ="div-title-and-reviews" className="flex flex-col border-2 border-solid border-white/[.08]">
                                 <Heading  id="heading-review">Reviews</Heading>
                                 <div id="div-reviews" className="flex flex-wrap">
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
                                             <span id="name-review" className="flex flex-row" > {review.user_name}</span>
                                          </Box>    
                                       ))) : (
                                          <Box id = "no-box-review-view" className="flex flex-col gap-5 border-2 border-solid border-white/[.08] ">
                                             <label id= "label-no-data">No reviews to show</label>
                                             <MixIcon id = "no-data-icon"/>
                                          </Box>    
                                       )
                                    }
                                    {!(review_index == 0) && 
                                      <Button id="arrow-up" color="violet" onClick={showLessReviews}>Less</Button> 
                                    }  
                                    {!(visibleReviews >= reviews.length) && 
                                       <Button id="arrow-down" color="violet" onClick={showMoreReviews} > More </Button>

                                    }                               
                                 </div>
                              </div>
                              {!isOrganizer && isRegister &&(
                                 <div id="div-create-review" className="flex flex-col py-4 border-2 border-solid border-white/[.08]"> 
                                    <div className="flex flex-col">
                                       <Heading id="label-review">Leave a review</Heading>
                                       <div id="div-star" className="flex flex-row py-3">
                                          {Array.from({ length: 5 }).map((_, index) => (
                                          <div id="div-select-starts" key={index} onClick={() => setRating(index + 1)}>
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
                                          placeholder="Write your review here..." 
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
            <Heading id="result-heading" className="text-3xl font-bold mb-4">Results</Heading>
            
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
                  </SegmentedControl.Root>
                  <div id="filter-by-edition" className="flex flex-col">
                     <Select.Root onValueChange={(value) => { handleSelectCategory(value); } }>
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
                        </Select.Root>
                  </div>
                     <div id="div-table-result" className="flex justify-center overflow-y-auto custom-scroll">
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
                                    <tr id="table-data" key={index} className="border border-gray-300 items-center">
                                      {data.map((cell, index) => (
                                          <td key={index} className="border border-gray-300 p-2">{cell}</td>
                                       ))}
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
                     </div>
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