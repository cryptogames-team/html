import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import {getAccountInfo,GetNFT,GetAccountForDB,GetFriends,BuyBox,RequestFriends,GetSenderRequestFriends, GetRankByName
,GetRecieverRequestFriends,CancelRequestFriends,AcceptRequestFriends,SetScore,AddChat,GetChat,CheckAccount,GetRanker} from './api_method.js'
import WebSocket, { WebSocketServer } from "ws";
const app = express();
const server = createServer(app).listen(3334,()=>{
  console.log('Server is running : port 3334')
}); 
const wss = new WebSocketServer({server : server})
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용할 HTTP 메소드 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더 설정
  next();
});
const userSockets = new Map();
//웹소켓
wss.on("connection", ws => {

  ws.on("message", data => {
    const data_json = JSON.parse(data);
    if(data_json.type === "connect"){
      userSockets.set(data_json.accountName, ws);
      console.log(data_json.accountName + "의 소켓 연결 완료");
    }else if(data_json.type === "chat") {
      const chat_data = {type : "chat", from_account_name : data_json.from_account_name, chat : data_json.chat, time : data_json.time};
      const chat_data_string = JSON.stringify(chat_data);
      sendMessage(data_json.to_account_name,chat_data_string);
      AddChat(data_json.from_account_name,data_json.to_account_name,data_json.chat,data_json.time);
    }else if(data_json.type === "request_friend"){
        
        RequestFriends(data_json.accountName, data_json.friendName)
        .then((insertId) => {
          if(insertId === 0){
            const request_data = {type : "request_friend", result : "FAILED"};
            const request_data_string = JSON.stringify(request_data);
            sendMessage(data_json.friendName,request_data_string);
            ws.send(request_data_string);
          }else {
            console.log("request_result : "+ insertId);
            const request_data = {type : "request_friend",result : "SUCCESS", accountName : data_json.accountName,to_account_name : data_json.friendName, requestID : insertId};
            const request_data_string = JSON.stringify(request_data);
            sendMessage(data_json.friendName,request_data_string);
            ws.send(request_data_string);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        
      
    }else if(data_json.type === "accept_friend"){
      AcceptRequestFriends(data_json.requestID);
      const accept_request_data = {type : "accept_request_friend", requestID : data_json.requestID};
      const accept_request_data_string = JSON.stringify(accept_request_data);
      sendMessage(data_json.accountName,accept_request_data_string);
    }else if(data_json.type === "cancel_request_friend"){
      CancelRequestFriends(data_json.requestID);
      const cancel_request_data = {type : "cancel_request_friend", requestID : data_json.requestID};
      const cancel_request_data_string = JSON.stringify(cancel_request_data);
      sendMessage(data_json.accountName,cancel_request_data_string);
    }else if(data_json.type === "refuse_request_friend"){
      CancelRequestFriends(data_json.requestID);
      const refuse_request_data = {type : "cancel_request_friend", requestID : data_json.requestID};
      const refuse_request_data_string = JSON.stringify(refuse_request_data);
      sendMessage(data_json.accountName,refuse_request_data_string);
    }else if(data_json.type === "invite_party" || data_json.type === "accept_party" || data_json.type === "join_party" || data_json.type === "game_start"  || data_json.type === "relay_session_name"){
      sendMessage(data_json.to,JSON.stringify(data_json));
    }

  })
  ws.on('close', () => {
    userSockets.forEach((socket, key) => {
      if (socket === ws) {
          userSockets.delete(key);
          console.log(`Socket removed for account: ${key}`);
      }
  });
  });
})

function sendMessage(accountName, message) {
  const ws = userSockets.get(accountName);
  if (ws) {
      ws.send(message);
      console.log(`Message sent to ${accountName}: ${message}`);
  } else {
      console.log(`No socket found for account: ${accountName}`);
  }
}

//http post
app.post('/getAccountInfo', (req, res) => {
  getAccountInfo(req,res);
});
app.post('/CheckAccount', (req, res) => {
  CheckAccount(req,res);
});
app.post('/GetNFT', (req, res) => {
  GetNFT(req,res);
});
app.post('/RequestFriend', (req, res) => {
  RequestFriend(req,res);
});
app.post('/GetAccountForDB',(req,res)=>{
  GetAccountForDB(req,res);
});
app.post('/GetFriends',(req,res)=>{
  GetFriends(req,res);
});
app.post('/BuyBox',(req,res)=>{
  BuyBox(req,res);
});
app.post('/GetSenderRequestFriends',(req,res)=>{
  GetSenderRequestFriends(req,res);
});
app.post('/GetRecieverRequestFriends',(req,res)=>{
  GetRecieverRequestFriends(req,res);
});
app.post('/SetScore',(req,res)=>{
  SetScore(req,res);
});
app.post('/GetChat',(req,res)=>{
  GetChat(req,res);
});
app.post('/getranker',(req,res)=>{
  GetRanker(req,res);
})
app.post('/getRankByName',(req,res)=> {
  GetRankByName(req,res);
})

