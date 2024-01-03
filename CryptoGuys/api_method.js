import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const rpc = new JsonRpc('http://14.63.34.160:8888');
console.log(process.env.MYSQLPW);
var conn = mysql.createConnection({ 
  host : '221.148.25.234',  
  user : 'root',
  password : '1207',
  database : 'cryptoguys'
}); 

conn.connect();

export function getAccountInfo(req,res){
    const { accountName } = req.body;
    console.log(accountName);
    (async () => {
      try{
        const account = await rpc.get_account(accountName);
        res.send({account : account,status : "SUCCESS"});
      }catch(error){
        res.send({error : error,status : "FAILED"});
        console.log(error)
      }
    })();
  }
  export function CheckAccount(req,res){
    const { accountName } = req.body;
    console.log(accountName);
    var sql = 'select * from user_info where account_name = ?';
    conn.query(sql,[accountName], function(err, rows, fields){
      if(rows.length > 0){
        res.send({result : true});
      }else{
        res.send({result : false});
      }
    });
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
        my_nft.push({template_id : nft.template_id,category : nft.schema_name})
      })
      res.send({result : my_nft})
    } catch (error) {
      console.error('Error:', error);
    }
}

export function GetAccountForDB(req,res){
  const {accountName} = req.body;
  var sql = 'select * from user_info where account_name = ?';
  conn.query(sql,[accountName], function(err, rows, fields)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }
      if(rows.length > 0){
        res.send({account_info : rows});    
      }else {
        var addAccountSql = 'INSERT INTO user_info (account_name, account_score) VALUES (? , ?)';
          conn.query(addAccountSql, [accountName , 0], function(err,result) {
              if (err) {
                  console.error('error connecting: ' + err.stack);
              }
              if (result) {
                var final_sql = 'select * from user_info where account_name = ?';
                conn.query(final_sql, [accountName], function(err, rows, fields) {
                  if (err) {
                      console.error('error connecting: ' + err.stack);
                  }
                  res.send({account_info : rows});    
              });
            } else {
              res.send({account_info : "server error"});
            }
              
          });
      }
      
  });
}

export function GetFriends(req,res){
  console.log("request receive");
  const {accountName} = req.body;
  var sql = 'select * from friends_table where account_name = ?';
  conn.query(sql,[accountName], function(err, rows, fields)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }
      var friendsInfo = [];
      var totalFriends = rows.length;
      if(totalFriends > 0){
        rows.forEach(function(friend){
          var friendAccountName = friend.friend_name;
          var friendInfoSql = 'select * from user_info where account_name = ?';
          conn.query(friendInfoSql, [friendAccountName], function(err, friendRows, fields) {
              if (err) {
                  console.error('error connecting: ' + err.stack);
              }
              if (friendRows.length > 0) {
                  friendsInfo.push(friendRows[0]);
                  
              }


              if (friendsInfo.length === totalFriends) {
                res.send({friends_info: friendsInfo});
              }   

              
              // 모든 친구 정보를 가져왔을 때 응답을 보냅니다.
              
          });
        })  
      }else {
        res.send({friends_info: []});
      }
      
  });
}
export function GetSenderRequestFriends(req,res){
  const {accountName} = req.body;
  var sql = 'select * from request_friend where account_name = ?';
  conn.query(sql,[accountName], function(err, rows, fields)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }
      res.send(rows)
  });
}

export function GetRecieverRequestFriends(req,res){
  const {accountName} = req.body;
  var sql = 'select * from request_friend where to_account_name = ?';
  conn.query(sql,[accountName], function(err, rows, fields)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }
      res.send(rows)
  });
}
export function RequestFriends(accountName,friendName){
  return new Promise((resolve, reject) => {
    var is_friend_sql = 'select * from friends_table where account_name = ? AND friend_name = ?';
    conn.query(is_friend_sql,[accountName,friendName],function(err,friendRows,fields){
      if(err){
        console.error(err.stack);
      }
      if(friendRows.length === 0){
        var is_request_sql = 'select * from request_friend where (account_name = ? AND to_account_name = ?) OR (account_name = ? AND to_account_name = ?)';
        conn.query(is_request_sql,[accountName,friendName,friendName,accountName],function(err,requestRows,fields){
          if(err){
            console.error(err.stack);
          }
          if(requestRows.length === 0){
            var sql = 'INSERT INTO request_friend (account_name,to_account_name) VALUES (? , ?)';
            conn.query(sql,[accountName,friendName], function(err,result)
            {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                }
                if(result){
                  console.log(result.insertId)
                  resolve(result.insertId);
                }else {
                  return result.insertId;
                }
            });
          }else {
            console.log("이미 요청 보냄")
            return 0;
          }
        });
      }else {
         return 0;
      }
    });
  });
 
}


export function CancelRequestFriends(requestID){
  var cancel_request_sql = 'DELETE FROM request_friend WHERE request_id = ?';
  conn.query(cancel_request_sql,[requestID],function(err,result){
    if(err){
      console.error(err.stack);
    }
    
  });
}
export function AcceptRequestFriends(requestID){
  var request_sql = 'SELECT * FROM request_friend WHERE request_id = ?';
  conn.query(request_sql,[requestID],function(err,rows, field){
    if(err){
      console.error(err.stack);
    }
    let account_name = rows[0].account_name;
    let to_account_name = rows[0].to_account_name;
    var cancel_request_sql = 'DELETE FROM request_friend WHERE request_id = ?';
    conn.query(cancel_request_sql,[requestID],function(err,result){
      if(err){
        console.error(err.stack);
      }
      if(result){
        var sql = 'INSERT INTO friends_table (account_name,friend_name) VALUES (? , ?)';
        conn.query(sql,[account_name,to_account_name], function(err,result)
        {
            if (err) {
                console.error('error connecting: ' + err.stack);
            }
        });
        conn.query(sql,[to_account_name,account_name], function(err,result)
        {
            if (err) {
                console.error('error connecting: ' + err.stack);
            }
            if(result){
              
            }
        });
      }else {

      }
    });

  });
}

export async function BuyBox(req,res){
  const {account,schema_name,template_id} = req.body.datas;
  const signatureProvider = new JsSignatureProvider(["5KcnyZ5HGm1vB52t8fuFq8CnCkzWEonF6QT8Uc71D6KdiSMikRH"]);
  const hep = new Api({rpc,signatureProvider});
    try {
      const mintAsset = await hep.transact({
          actions: [{
            account: 'eosio.nft',
            name: 'mintasset',
            authorization: [{
              actor: "test4",  
              permission: 'active',
            }],
            data: {
              authorized_minter : "test4",
              collection_name : "cryptoguynft",
              schema_name : schema_name,
              template_id : template_id,
              new_asset_owner : account,
              immutable_data : [],
              mutable_data : "",
              tokens_to_back : []  
            },
          }]
      }, {
          blocksBehind: 3,
          expireSeconds: 30,
      });
      res.send({result : "success", data : mintAsset})
    }catch(error){
          res.send({result : "fail"})
    }  

}

export function SetScore(req,res){
  const {accountName,getScore} = req.body.datas;
  var sql = 'select * from user_info where account_name = ?';
  conn.query(sql,[accountName], function(err, rows, fields)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }
      let final_score = rows[0].account_score + getScore;
      if(final_score <= 0){
        final_score = 0;
      }
      var update_sql = 'UPDATE user_info SET account_score = ? WHERE account_name = ?'
      conn.query(update_sql,[final_score,accountName], function(err, result){
        if (err) {
          console.error('error connecting: ' + err.stack);
        }
        if(result){
          res.send({result : 'SUCCESS'});
        }else {
          res.send({result : 'FAILED'});
        }
      });
      
  });
}

export function AddChat(from,to,message,time){
  var sql = 'INSERT INTO message (sender_name,receiver_name,message_content,message_time) VALUES (? , ?, ? ,?)';
  conn.query(sql,[from,to,message,time], function(err,result)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }

      //오류 res is not defined 주석 처리함
      /*
      if(result){
        res.send({result : 'SUCCESS'});
      }else {
        res.send({result : 'FAILED'});
      }*/
  });
}

export function GetChat(req,res){
  const {accountName,friendName} = req.body.datas;
  var sql = 'select * from message where (sender_name = ? AND receiver_name = ?) OR (sender_name = ? AND receiver_name = ?)';
  conn.query(sql,[accountName,friendName,friendName,accountName], function(err,rows,field)
  {
      if (err) {
          console.error('error connecting: ' + err.stack);
      }
      res.send(rows);
  });
}

export function GetRanker(req,res){
  // var sql = 'select * from user_info ORDER BY account_score DESC LIMIT 50';
  var sql = 'SELECT account_name, account_score, RANK() OVER (ORDER BY account_score DESC) FROM user_info limit 50';

  conn.query(sql, function (err, rows, fields) {
    if (err) {
      console.error(err.stack);
    }
    res.send(rows);
  });

}

export function GetRankByName(req,res) {
  const { account_name } = req.body;
  var sql = `
  SELECT account_name, account_score, user_rank
  FROM (
    SELECT account_name, account_score, RANK() OVER (ORDER BY account_score DESC) AS user_rank
    FROM user_info
  ) AS ranked_users
  WHERE account_name = ?
`;

  conn.query(sql, [account_name], function (err, rows, fields) {
    if (err) {
      console.error(err.stack);
    }
    res.send(rows);
  });
}
