import express, { json } from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from "ws";
import bodyParser from 'body-parser';
import { sendTokens,startTransaction,startTransactions,getAccountInfo,getProducerList,
         unstakeResource,sellRam,accountTransaction,voteProducer,resourceStaking,buyRam,createAccount,getAccountList,
         GetNFT,BuyNFTBox} from './api_method.mjs'

const app = express();

const server = createServer(app).listen(8989,()=>{
    console.log('Server is running : port 8989')
}); 

  let connectedClients = new Map();
  const wss = new WebSocketServer({server : server})

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용할 HTTP 메소드 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더 설정
  next();
});
var client_count=0;
wss.on("connection", ws => {
    console.log("웹소켓 연결됨");
    const clientId = client_count++;
    connectedClients.set(clientId,ws);
    const client_data = {type : "connect", socket_id : clientId};
    const client_data_string = JSON.stringify(client_data);
    sendToClient(clientId,client_data_string)
    ws.on("message", data => {
      const data_json = JSON.parse(data);
      console.log("data_json"+data_json);
      if(data_json.type === "login"){
        const account_data = {type : "login", account_name : data_json.account_name};
        const account_data_string = JSON.stringify(account_data);
        sendToClient(parseInt(data_json.socket_id),account_data_string);
      }else if(data_json.type === "buy_box"){
        BuyNFTBox(data_json.private_key,data_json.account_name,data_json.count,parseInt(data_json.socket_id),ws)
      }
    })
  
    ws.on('close', () => {
      connectedClients.delete(clientId); // 연결이 닫힌 클라이언트를 Map에서 제거
      console.log(clientId)
    });
})
function sendToClient(clientId, message) {
    const ws = connectedClients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
}

app.post('/sendTokens', (req, res) => {
    sendTokens(req,res)
  });
  
  app.post('/startTransaction', (req, res) => {
    startTransaction(req,res)
  });
  app.post('/startTransactions', (req, res) => {
    startTransactions(req,res)
  });
  app.post('/getAccountInfo', (req, res) => {
    getAccountInfo(req,res)
  });
  app.post('/getProducerList', (req, res) => {
    getProducerList(req,res)
  });
  app.post('/unstakeResource', (req, res) => {
    unstakeResource(req,res);
  });
  app.post('/sellRam', (req, res) => {
    sellRam(req,res);
  });
  app.post('/getAccountTransaction', (req, res) => {
      accountTransaction(req,res);
    });
  
  app.post('/voteProducer',(req,res) =>{
    voteProducer(req,res);
  })
  
  app.post('/resourceStaking',(req,res) =>{
      resourceStaking(req,res);
    })
  app.post('/buyRam',(req,res) =>{
      buyRam(req,res);
  })
  app.post('/createAccount',(req,res) =>{
      createAccount(req,res);
  })
  app.post('/getAccountList',(req,res) =>{
    getAccountList(req,res);
  })
  app.post('/GetNFT',(req,res) =>{
    GetNFT(req,res);
  })