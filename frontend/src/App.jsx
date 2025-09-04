import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'
import Signup from './Signup'
import { backend_url } from './config'
import { motion } from "motion/react"
function App() {
  const [user,setUser]=useState(null)
  console.log("user setlted" , user)
  return (
    <>
    {!user? <Signup setUser={setUser}></Signup>:
     <FetchUpdate user={user}></FetchUpdate>
    }
     
    
     
    </>
  )
}

const FetchUpdate=({user})=>{
  const [message,setmessage]=useState('')
  const [loading,setloading]=useState(false)
  const [error,setError]=useState('')
  const [updates,setUpdates]=useState()
  const fetchEvent = async () => {
  setloading(true);
  
  
  const res = await axios.post(
    `${backend_url}/send-update`,
    { email:  user},
  );
  if(res.statusText!='OK'){
    setError("failed to fetch retry")
  }
  if(res.data.message){
    setmessage(res.data.message)
    setUpdates(res.data.updates)
  }
  setloading(false);
  console.log('send update', res);
};

 return (
  <div className="fetchdiv">
    <button onClick={fetchEvent}>
      {loading ? "loading..." : "fetch github event"}
    </button>
    {error && ( 
      <div>{error}</div>
    )}
    <p>{message}</p>
     {updates && (
      <pre className="mt-2 p-2 bg-gray-900 text-white rounded">
        {updates}
      </pre>
    )}
  </div>
);
}

export default App
