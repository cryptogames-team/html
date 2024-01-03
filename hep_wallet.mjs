import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import { fileURLToPath } from 'url';
import path from 'path';
import express, { json } from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from "ws";


import bodyParser from 'body-parser';
const app = express();

import * as io from "socket.io"
// app.listen(8989, '0.0.0.0', () => {
  
// })
const server = createServer(app).listen(8989,()=>{
  console.log('Server is running : port 8989')
}); 
const socketio = new io.Server(server);
const wss = new WebSocketServer({server : server})
const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rpc = new JsonRpc('http://14.63.34.160:8888');
const allowedOrigins = ['http://221.148.25.234', 'http://221.148.25.234:3001', 'http://221.148.25.234:3002'];
let connectedClients = new Map();
let client_count = 1;

app.use(bodyParser.json());
//app.use(express.static(__dirname + '/explorer/build'))
app.use((req, res, next) => {
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //       res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용할 HTTP 메소드 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더 설정
  next();
});


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

app.post('/UploadMarket', (req, res) => {
  UploadMarket(req,res)
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
app.post('/checkBalance', (req, res) => {
  checkBalance(req,res);
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



async function BuyNFTBox(senderPrivateKey, account_name, count,socket_id,ws){
  const signatureProvider = new JsSignatureProvider([senderPrivateKey]);
  const hep = new Api({rpc,signatureProvider});

    try {
        const result = await hep.transact({
            actions: [{
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: account_name,
                permission: 'active',
              }],
              data: {
                from: account_name,
                to: 'producer1',
                quantity: '5.0000 HEP',
                memo: 'nft_box',
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          console.log({result : result})
          const client_data = {type : "buy_box", result : "SUCCESS"};
          const client_data_string = JSON.stringify(client_data);
          console.log("소켓 아이디 : " + socket_id);
          // sendToClient(socket_id,client_data_string);
          sendToClient(socket_id,client_data_string);
          ws.send(client_data_string);
    }catch(error){
      const client_data = {type : "buy_box", result : "FAILED"};
          const client_data_string = JSON.stringify(client_data);
      console.log({result : error, status : "FAILED"});
      sendToClient(socket_id,client_data_string);
          ws.send(client_data_string);
      
    }
    
}

function getAccountInfo(req,res){
  const { accountName } = req.body;
  console.log(accountName);
  (async () => {
    try{
      const account = await rpc.get_account(accountName);
      res.send({account : account,status : "SUCCESS"});

    }catch(error){
      res.send({error : error,status : "Failed"});

    }
  })();
}

async function accountTransaction(req,res){
    console.log(req.body)
    const {accountName} = req.body.datas;
    console.log(accountName+"의 accountTransaction" );
    (async () => {
        try{
            const result = await rpc.history_get_actions(accountName);
            res.send({result : result.actions})
            console.log({result : result.actions})
        }catch(error){
          console.log(error);
          res.send({error : error});
        }
        
    })();
    
}

function voteProducer(req,res){
  let { voterPrivateKey, voterName, producerName } = req.body.datas;
  if (typeof producerName === 'string') {
    producerName = JSON.parse(producerName)
  }
  console.log(voterPrivateKey)
  console.log(voterName)
  console.log(producerName)
  const signatureProvider = new JsSignatureProvider([voterPrivateKey]);
  const hep = new Api({rpc,signatureProvider});
  (async () => {
    try{
      const result = await hep.transact({
        actions: [{
          account: 'eosio',
          name: 'voteproducer',
          authorization: [{
            actor: voterName,
            permission: 'active',
          }],
          data: {
            voter: voterName,
            proxy: '',
            producers: producerName
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
        broadcast: true,
        sign: true
      });
      res.send({result : result, status : "SUCCESS"});
      console.log({result : result});
    }catch(error){
      res.send({result : error, status : "FAILED"});
      console.log({result : error});
    }

  })();
}
async function resourceStaking(req, res){
    console.log(req.body);
    const { privateKey, accountName, cpuQuantity, netQuantity} = req.body.datas;
    console.log(req.body.datas);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const hep = new Api({rpc,signatureProvider});
    (async () => {
      try {
          
          const result = await hep.transact({
            actions: [{
                account: 'eosio',
                name: 'delegatebw',
                authorization: [{
                  actor: accountName,  // CPU 스테이킹을 할 계정
                  permission: 'active',
                }],
                data: {
                  from: accountName,  // CPU 스테이킹을 할 계정
                  receiver: accountName,  // CPU 스테이킹을 할 계정
                  stake_net_quantity: netQuantity + " HEP",  // 네트워크 스테이킹 수량 (0으로 설정하려면 해당 필드를 제거하세요)
                  stake_cpu_quantity: cpuQuantity + " HEP",  // CPU 스테이킹 수량
                  transfer: false,
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            });
            res.send({result : result, status : "SUCCESS"});
            console.log({result : result});
      }catch(error){
        res.send({result : error, status : "FAILED"});
        console.log({result : error});
      }
       
    })();
}
async function unstakeResource(req, res){
  const { privateKey, accountName, cpuQuantity, netQuantity} = req.body.datas;
  console.log(privateKey);
  console.log(accountName);
  console.log(cpuQuantity);
  console.log(netQuantity);
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const hep = new Api({rpc,signatureProvider});
  (async () => {
    try {
        
        const result = await hep.transact({
          actions: [{
              account: 'eosio',
              name: 'undelegatebw',
              authorization: [{
                actor: accountName,  
                permission: 'active',
              }],
              data: {
                from: accountName,  
                receiver: accountName,  
                unstake_net_quantity: netQuantity + " HEP", 
                unstake_cpu_quantity: cpuQuantity + " HEP", 
                transfer: false,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          res.send({result : result, status : "SUCCESS"});
          console.log({result : result});
    }catch(error){
      res.send({result : error, status : "FAILED"});
      console.log({result : error});
    }
     
  })();
}
async function buyRam(req, res){
    const { privateKey, accountName, quantity} = req.body.datas;
    console.log(req.body.datas);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const hep = new Api({rpc,signatureProvider});
    (async () => {
      try {
          
          const result = await hep.transact({
            actions: [{
                account: 'eosio',
                name: 'buyram',
                authorization: [{
                  actor: accountName,  // RAM을 구매할 계정
                  permission: 'active',
                }],
                data: {
                  payer: accountName,  // RAM을 구매할 계정
                  receiver: accountName,  // RAM을 받을 계정
                  quant: quantity + ' HEP',  // 구매할 RAM 수량
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            });
            res.send({result : result, status : "SUCCESS"});
            console.log({result : result});
      }catch(error){
        res.send({result : error, status : "FAILED"});
        console.log({result : error});
      }
       
    })();
}
async function sellRam(req, res){
  const { privateKey, accountName, bytes} = req.body.datas;
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const hep = new Api({rpc,signatureProvider});
  (async () => {
    try {
        
        const result = await hep.transact({
          actions: [{
              account: 'eosio',
              name: 'sellram',
              authorization: [{
                actor: accountName,  
                permission: 'active',
              }],
              data: {
                account: accountName,  
                bytes: bytes,  
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          res.send({result : result, status : "SUCCESS"});
          console.log({result : result});
    }catch(error){
      res.send({result : error, status : "FAILED"});
      console.log({result : error});
    }
     
  })();
}
async function sendTokens(req, res){
  const { senderPrivateKey, senderName, receiverName, quantity, memo } = req.body.datas;
  console.log(senderPrivateKey);
  console.log(senderName);
  console.log(receiverName);
  console.log(quantity);
  console.log(memo);
  const signatureProvider = new JsSignatureProvider([senderPrivateKey]);
  const hep = new Api({rpc,signatureProvider});
  (async () => {
    try {
        
        const result = await hep.transact({
            actions: [{
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: senderName,
                permission: 'active',
              }],
              data: {
                from: senderName,
                to: receiverName,
                quantity: quantity + ' HEP',
                memo: memo,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          console.log({result : result})
          res.send({result : result, status : "SUCCESS"});
    }catch(error){
      console.log({result : error, status : "FAILED"});
      res.send({result : error, status : "FAILED"});
      
    }
     
  })();
}
async function getAccountList(req, res){
  const { publicKey} = req.body.datas;
  
  (async () => {
    try {
      const accounts = await rpc.history_get_key_accounts(publicKey);
      res.send({accounts : accounts.account_names})
    }catch(error){
      console.error(error)
      res.send({accounts : "error"});
    }
     
  })();
}
async function startTransactions(req,res){
  console.log(req.body.datas)
  const { senderPrivateKey, auth_name, datas } = req.body.datas;
  console.log("응답받은 값")
  console.log(req.body.datas)
  const signatureProvider = new JsSignatureProvider([senderPrivateKey]);
  const hep = new Api({rpc,signatureProvider});
  let results = [];
  datas.forEach(function(data){
    (async () => {
   
      try {
          const result = await hep.transact({
              actions: [{
                account: data.action_account,
                name: data.action_name,
                authorization: [{
                  actor: auth_name,
                  permission: 'active',
                }],
                data: data.data,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            });
            console.log({result : result})
            results.push(result.transaction_id)
            
      }catch(error){
        console.log(error)
        res.send({result : error, status : "FAILED"});
      }
    })();
  });
  console.log(results.length)
  setTimeout(() => {
    if(results.length > 0){
      res.send({result : results, status : "SUCCESS"});
    }  
  },1000)
 
  
}
async function startTransaction(req,res){
  console.log(req.body.datas)
  const { senderPrivateKey, auth_name, data,action_account,action_name } = req.body.datas;
  console.log("응답받은 값")
  console.log(req.body.datas)
  console.log(action_name); // aciton name 잘 전달됨...
  const signatureProvider = new JsSignatureProvider([senderPrivateKey]);
  const hep = new Api({rpc,signatureProvider});
  (async () => {
    try {
        const result = await hep.transact({
            actions: [{
              account: action_account,
              name: action_name,
              authorization: [{
                actor: auth_name,
                permission: 'active',
              }],
              data: data,
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
          console.log({result : result})
          res.send({result : result, status : "SUCCESS"});
    }catch(error){
      console.log(error)
      res.send({result : error, status : "FAILED"});
    }
     
  })();
}

async function getProducerList(req, res){
  (async () => {
    try {
      let producerLength = 0;
      let producerData;
  
      while (producerLength <= 24) {
        producerData = await rpc.get_producers(true, '', 100);
        producerLength = producerData.rows.length;
      }
      producerData.rows.sort((a, b) => parseFloat(b.total_votes) - parseFloat(a.total_votes));
      res.send({producers : producerData.rows})
    }catch(error){
      console.error(error)
    }
     
  })();
}
async function createAccount(req,res){
    const {createName, publicKey} = req.body.datas;
    const signatureProvider = new JsSignatureProvider(['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3']);
    const hep = new Api({rpc,signatureProvider});
    (async () => {
        try {
            
            const result = await hep.transact({
                actions: [{
                    account: 'eosio',
                    name: 'newaccount',
                    authorization: [{
                      actor: 'eosio',  // 새 계정 생성자
                      permission: 'active',
                    }],
                    data: {
                      creator: 'eosio',  // 새 계정 생성자
                      name: createName,  // 새 계정 이름
                      owner: {
                        threshold: 1,
                        keys: [{
                          key: publicKey,  
                          weight: 1,
                        }],
                        accounts: [],
                        waits: [],
                      },
                      active: {
                        threshold: 1,
                        keys: [{
                          key: publicKey,
                          weight: 1,
                        }],
                        accounts: [],
                        waits: [],
                      },
                    },
                    
                  },
                  {
                    account: 'eosio',
                    name: 'buyrambytes',
                    authorization: [{
                      actor: 'eosio',
                      permission: 'active',
                    }],
                    data: {
                      payer: 'eosio',
                      receiver: createName,
                      bytes: 8192,
                    },
                  }]    
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            res.send({result : result, status : "SUCCESS"});
        }catch(error){
          console.log(error);
          res.send({result : error, status : "FAILED"});
        }
         
      })();
}

export async function GetNFT(req,res) {
  const {accountName, limit} = req.body.datas;
  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.nft',
      scope: accountName, 
      table: 'assets',
      limit: limit 
    });
    let my_nft = [];
    response.rows.forEach(function(nft){
      my_nft.push(nft.immutable_serialized_data[0].value[1])
    })
    res.send({result : my_nft})
  } catch (error) {
    console.error('Error:', error);
  }
}

//추후 지갑을 홈페이지에서 볼 때 사용할 것
// app.use(express.static(path.join(__dirname, 'explorer/build')));


