import Image from "next/image";
import Login from "./login";
import Register from "../register/register";

export default async function Page() {
     
  const express = require('express');
  const cors = require('cors'); 
  const app = express();
 
  app.use(cors()); 

  return (     
    <Login/>
  );
}