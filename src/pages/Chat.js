import axios from 'axios';
import React, { useEffect, useState ,useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute, host } from '../utils/APIroutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import Logo from "../assets/logo.svg";
import {io} from "socket.io-client"

const Chat = () => {
  const socket=useRef();
  const navigate = useNavigate();
  const[contacts, setContacts]=useState([]);
  const[currentUser,setCurrentUser]=useState(undefined);
  const[currentChat,setCurrentChat]=useState(undefined);
  const[isLoaded , setisLoaded]=useState(false);
  
  useEffect(()=>{
    (async()=>{
      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }
      else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setisLoaded(true);
      }
  
    }
    
    )();

  },[])
  console.log("loaded",isLoaded);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  
  useEffect(()=>{
    (async()=>{
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          console.log("data",data.data)
          setContacts(data.data)
        }
        else{
          navigate("/setavatar")
        }
      }
    })()
  },[currentUser])

 const handleChatChange=(chat)=>{
  setCurrentChat(chat)

 }
console.log("cuchat",currentChat);
console.log("cuser",currentUser);


  return (
    <div>
      <Container>
      <h2 style={{color:"white",paddingTop:"0.2rem"}}>Let's chat with SNAPPY</h2>
      <div className='container'>
      
      <Contacts 
      contacts={contacts} 
      currentUser={currentUser}
      changeChat={handleChatChange}/>
      
      {(isLoaded && currentChat===undefined )? 
        (<Welcome currentUser={currentUser}/>) :
      (
        <ChatContainer 
        currentChat={currentChat} 
        currentUser={currentUser}
        socket={socket}/>
      )}
     
      </div>
      
      </Container>
    </div>
  )
}

export default Chat;
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 92vh;
    width: 95vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;