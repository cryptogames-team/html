import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
const rpc = new JsonRpc('http://14.63.34.160:8888');
let connectedClients = new Map();
export async function BuyNFTBox(senderPrivateKey, account_name, count,socket_id,ws){
    const signatureProvider = new JsSignatureProvider([senderPrivateKey]);
    const hep = new Api({rpc,signatureProvider});
    (async () => {
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
            const client_data = {type : "buy_box", result : "SUCCESS"};
            const client_data_string = JSON.stringify(client_data);
            sendToClient(socket_id,client_data_string);
            ws.send(client_data_string);
      }catch(error){
        const client_data = {type : "buy_box", result : "FAILED"};
        const client_data_string = JSON.stringify(client_data);
        console.log(error);
        sendToClient(socket_id,client_data_string);
        ws.send(client_data_string);
        
      }
       
    })();
  }
  function sendToClient(clientId, message) {
    const ws = connectedClients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
  export function getAccountInfo(req,res){
    const { accountName } = req.body;
    (async () => {
      try{
        const account = await rpc.get_account(accountName);
        res.send({account : account,status : "SUCCESS"});
      }catch(error){
        res.send({error : error,status : "Failed"});
        console.log(error);
      }
    })();
  }
  
  export async function accountTransaction(req,res){
      const {accountName} = req.body.datas;
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
  
  export function voteProducer(req,res){
    let { voterPrivateKey, voterName, producerName } = req.body.datas;
    if (typeof producerName === 'string') {
      producerName = JSON.parse(producerName)
    }
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
      }catch(error){
        res.send({result : error, status : "FAILED"});
        console.log(error);
      }
  
    })();
  }
  export async function resourceStaking(req, res){
      const { privateKey, accountName, cpuQuantity, netQuantity} = req.body.datas;
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
        }catch(error){
          res.send({result : error, status : "FAILED"});
          console.log(error);
        }
      })();
  }
  export async function unstakeResource(req, res){
    const { privateKey, accountName, cpuQuantity, netQuantity} = req.body.datas;
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
      }catch(error){
        res.send({result : error, status : "FAILED"});
        console.log(error);
      }
       
    })();
  }
  export async function buyRam(req, res){
      const { privateKey, accountName, quantity} = req.body.datas;
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
        }catch(error){
          res.send({result : error, status : "FAILED"});
          console.log(error);
        }
         
      })();
  }
  export async function sellRam(req, res){
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
      }catch(error){
        res.send({result : error, status : "FAILED"});
        console.log(error);
      }
    })();
  }
  export async function sendTokens(req, res){
    const { senderPrivateKey, senderName, receiverName, quantity, memo } = req.body.datas;
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
            res.send({result : result, status : "SUCCESS"});
      }catch(error){
        res.send({result : error, status : "FAILED"});
        console.log(error);
      }
       
    })();
  }
  export async function getAccountList(req, res){
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
  export async function startTransactions(req,res){
    const { senderPrivateKey, auth_name, datas } = req.body.datas;
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
              results.push(result.transaction_id)
              
        }catch(error){
          console.log(error)
          res.send({result : error, status : "FAILED"});
        }
      })();
    });
    setTimeout(() => {
      if(results.length > 0){
        res.send({result : results, status : "SUCCESS"});
      }  
    },1000)
   
    
  }
  export async function startTransaction(req,res){
    const { senderPrivateKey, auth_name, data,action_account,action_name } = req.body.datas;
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
            res.send({result : result, status : "SUCCESS"});
      }catch(error){
        console.log(error)
        res.send({result : error, status : "FAILED"});
      }
       
    })();
  }
  
  export async function getProducerList(req, res){
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
  export async function createAccount(req,res){
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
  
  
  