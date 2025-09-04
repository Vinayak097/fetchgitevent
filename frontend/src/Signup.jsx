import { useState } from "react";
import axios from "axios";

export default function Signup({setUser}) {
  const [email, setEmail] = useState("");
  const [error,seterror]=useState("")
  const [loading,setloading]=useState(false)

  const handleSubmit =async (e) => {
    e.preventDefault();
    
    setloading(true)
    try{
      const res= await axios.post("http://localhost:3000/signup", { email });
      setUser(res.data.email)
    }catch(e){
      console.log(e.message  ,'e')
        seterror(e.message)        
    }
    setloading(false)
    console.log("res " ,error)
    
    
    
  }



  if(error){
    return (
        <div className="box"> Error signup try again
            <button onClick={()=>{seterror("")}}>Retry</button>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 box">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="input"
      />
      <button type="submit" className="">
        {loading ? "loading ...":"Sign Up"}
      </button>
      
    </form>
  );
}
