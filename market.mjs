import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'
import express, { json } from 'express';
import bodyParser from 'body-parser';
import { converBase64ToImage } from 'convert-base64-to-image'
import session from 'express-session';
import MemoryStore from 'memorystore';
import path from 'path';
const MemoryStores = MemoryStore(session);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();
const rpc = new JsonRpc('http://14.63.34.160:8888');


const projectId = '2VFV02FYJg0P0ur5RYSJChpaC24';
const projectSecret = '3dab32310066727b7a3491165142dc01';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
const maxAge = 1000 * 60 * 5;
// app.use(bodyParser.json());
// 이미지 전송이 안되어 수정함. - 철희
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(session({
  secret: 'heptagon',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStores({ checkPeriod: maxAge }),
  cookie: {
    maxAge,
  },
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용할 HTTP 메소드 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더 설정
  next();
});
app.use(express.static(path.join(__dirname, 'nft_market/build')));

app.get('*', function (요청, 응답) {
  응답.sendFile(path.join(__dirname, '/nft_market/build/index.html'));
});
//NFT 불러오기
app.post('/GetNFT', (req, res) => {
  GetNFT(req, res)
});
//NFT 컬렉션 생성
app.post('/CreateCol', (req, res) => {
  CreateCol_new(req, res)
});
app.post('/Login', (req, res) => {
  Login(req, res)
});
app.post('/LogOut', (req, res) => {
  LogOut(req, res)
});
app.post('/IsLogin', (req, res) => {
  IsLogin(req, res)
});
//NFT 컬렉션 불러오기
app.post('/GetCol', (req, res) => {
  GetCol(req, res)
});
app.post('/GetSenderOffer', (req, res) => {
  GetSenderOffer(req, res)
});
app.post('/GetRecieverOffer', (req, res) => {
  GetRecieverOffer(req, res)
});
// 마켓 관련 정보 가져오기
app.post('/GetMarket', (req, res) => {
  GetMarket(req, res)
});
// 마켓 관련 내 정보 가져오기
app.post('/GetMyMarket', (req, res) => {
  GetMyMarket(req, res)
});
//NFT 스키마 생성
app.post('/CreateSchema', (req, res) => {
  CreateSchema(req, res)
});
//NFT 스키마 불러오기
app.post('/GetSchema', (req, res) => {
  GetSchema(req, res)
});
//NFT 템플릿 생성
app.post('/CreateTempl', (req, res) => {
  CreateTempl(req, res)
});
//NFT 템플릿 불러오기
app.post('/GetTempl', (req, res) => {
  GetTempl(req, res)
});
//NFT 발행
app.post('/MintAsset', (req, res) => {
  MintAsset(req, res)
});
//크립토 게임즈 NFT 발행
app.post('/jjy', (req, res) => {
  jjy(req, res)
});
//오퍼 생성
app.post('/CreateOffer', (req, res) => {
  CreateOffer(req, res)
});
//오퍼 수락
app.post('/AcceptOffer', (req, res) => {
  AcceptOffer(req, res)
});
//오퍼 취소
app.post('/CancelOffer', (req, res) => {
  CancelOffer(req, res)
});
//오퍼 거절
app.post('/DeclineOffer', (req, res) => {
  DeclineOffer(req, res)
});
//마켓 등록
app.post('/UploadMarket', (req, res) => {
  UploadMarket(req, res)
});
//마켓 구매
app.post('/BuyNFT', (req, res) => {
  BuyNFT(req, res)
});
//마켓 등록 취소
app.post('/CancelMarket', (req, res) => {
  CancelMarket(req, res)
});
//ipfs 이미지 등록
app.post('/UploadIPFS', (req, res) => {
  UploadIPFS(req, res)
});
//ipfs 이미지 등록
app.post('/UploadIPFS_byPath', (req, res) => {
  UploadIPFS_byPath(req, res)
});

app.listen(3333, '0.0.0.0', () => {
  console.log('Server is running : port 3333')
})

function IsLogin(req, res) {
  console.log("확인")
  if (req.session.user) {
    res.send({ result: true, accountName: req.session.user.accountName })
    console.log("로그인 되있음")
  } else {
    res.send({ result: false })
    console.log("로그인 안되있음")
  }
}
function LogOut(req, res) {
  console.log("확인")
  if (req.session.user) {
    req.session.destroy(() => {
      res.send({ result: true })
    });
  } else {
    res.send({ result: false })
    console.log("로그인 안되있음")
  }
}
function Login(req, res) {
  const accountName = req.body;
  console.log("dd")
  if (req.session.user) {
    console.log("로그인함 이미")
    res.send({ result: false })
  } else {
    req.session.user = accountName;
    req.session.save(() => {
      console.log("로그인")
      res.send({ result: true })
    })
  }
}
//NFT 컬렉션 생성
async function CreateCol(req, res) {
  if (req.session.user) {

  } else {
    res.send({ status: "NOTLOGIN" })
  }
  const { creater, collection_name, fee, private_key, data } = req.body.datas;
  console.log(req.body.datas)
  console.log(data);
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const createOffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'createcol',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            author: creater,
            collection_name: collection_name,
            allow_notify: true,
            authorized_accounts: [],
            notify_accounts: [],
            market_fee: fee,
            data: data
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      const addColAuth = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'addcolauth',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            collection_name: collection_name,
            account_to_add: creater
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: createOffer, status: "SUCCESS" })
    } catch (error) {
      console.log(error);
      res.send({ result: error, status: "FAILED" })
    }
  })();
}

// 이미지 파싱 후, ipfs에 저장하는 로직 추가
// img_logo, img_background룰 ipfs에 저장하고 그 키 값 data에 저장한다.
async function CreateCol_new(req, res) {
  const { creater, collection_name, fee, private_key, data, img_logo, img_background } = req.body.datas;
  console.log(creater, collection_name, fee, private_key, data)

  const path_ipfs_img_logo = await upload_ipfs(img_logo);
  const path_ipfs_img_background = await upload_ipfs(img_background);

  const ipfs_url = "https://ipfs.io/ipfs/";

  console.log("로고 이미지 경로 출력 : ", path_ipfs_img_logo);
  console.log("배경 이미지 경로 출력 : ", path_ipfs_img_background);
  const data_value = [...data,
  { key: "img_logo", value: ['string', ipfs_url + path_ipfs_img_logo] },
  { key: "img_background", value: ['string', ipfs_url + path_ipfs_img_background] }
  ]

  console.log("data_value : ", data_value);

  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const createOffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'createcol',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            author: creater,
            collection_name: collection_name,
            allow_notify: true,
            authorized_accounts: [],
            notify_accounts: [],
            market_fee: fee,
            data: data_value
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      const addColAuth = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'addcolauth',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            collection_name: collection_name,
            account_to_add: creater
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: createOffer, status: "SUCCESS" })
    } catch (error) {
      console.log(error);
      res.send({ result: error, status: "FAILED" })
    }
  })();
}

//ipfs에 base64 형식의 데이터를 저장해준다.
async function upload_ipfs(img) {

  console.log("upload_ipfs 호출")

  const pathToSaveImage = './nft_market/img/image.png' //base 64의 파일 정보를 저장할 경로를 지정해준다.
  converBase64ToImage(img, pathToSaveImage) // 해당 경로에 base64를 이미지 파일로 저장시켜준다.
  const readFile = fs.readFileSync(pathToSaveImage); // 사진 파일을 데이터의 형태로 가져온다.

  const uploadResult = await client.add(readFile)
  return uploadResult.path; // ipfs의 경로를 출력한다..  
}
async function GetSenderOffer(req, res) {

  const { accountName, limit } = req.body.datas;
  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.nft',
      scope: 'eosio.nft',
      table: 'offers',
      index_position: 2,
      key_type: 'name',
      lower_bound: accountName,
      upper_bound: accountName,
      limit: limit
    });
    res.send({ result: response })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }

}

async function GetMarket(req, res) {

  const { sort_type, bound, page, perPage } = req.body.datas;

  // 페이지 번호에 따라 시작과 끝을 계산
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage - 1;

  // 검색 유형을 정해준다. 1 : sale id, 2 : collection, 3 : seller, 4 : asset name, 5 : buyer, 6 : is sale, 7 : schema, 8: asset_id
  let index = 0;
  let key_type = "";
  if (sort_type === "sale_id") {
    index = 1;
    key_type = "i64";
  } else if (sort_type === "seller") {
    index = 3;
    key_type = "name";
  } else if (sort_type === "asset name") {
    index = 4;
    key_type = "name";
  } else if (sort_type === "buyer") {
    index = 5;
    key_type = "name";
  } else if (sort_type === "isSale") {
    index = 6;
    key_type = "i64";
  } else {
    res.send({ result: "sort_type 오류 입니다." })
  }

  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.market',
      scope: 'eosio.market',
      table: 'sales',
      index_position: index,
      key_type: key_type,
      lower_bound: bound[0],
      upper_bound: bound[1],
      limit: 10000
    });

    const data = response.rows.slice(startIndex, endIndex + 1); // 페이지에 해당하는 데이터 추출

    res.send({ result: data })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }


}
async function GetMyMarket(req, res) {

  const { accountName, limit } = req.body.datas;
  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.market',
      scope: 'eosio.market',
      table: 'sales',
      index_position: 3,
      key_type: 'name',
      lower_bound: accountName,
      upper_bound: accountName,
      limit: limit
    });
    res.send({ result: response })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }

}
async function GetRecieverOffer(req, res) {

  const { accountName, limit } = req.body.datas;
  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.nft',
      scope: 'eosio.nft',
      table: 'offers',
      index_position: 3,
      key_type: 'name',
      lower_bound: accountName,
      upper_bound: accountName,
      limit: limit
    });
    res.send({ result: response })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }

}
//NFT 컬렉션 불러오기
// sort type : user, data[0] : 계정 이름, data[1] : limit (가져올 데이터 수)
// sort type : collection, data[0] : collection 이름, data[1] : limit (가져올 데이터 수)
// async function GetCol(req, res) {

//   const { sort_type, data, limit } = req.body.datas;

//   let index;
//   let bound = data[0];
//   if (sort_type === "user") {
//     index = 2;
//   } else if (sort_type === "collection") {
//     index = 3;
//   }

//   console.log(`getCol, sort_type : ${sort_type} , data : ${data}`)

//   try {
//     const response = await rpc.get_table_rows({
//       json: true,
//       code: 'eosio.nft',
//       scope: 'eosio.nft',
//       table: 'collections',
//       index_position: index,
//       key_type: 'name',
//       lower_bound: bound,
//       upper_bound: bound,
//       limit: limit
//     });
//     res.send({ result: response })
//     console.log(response)
//   } catch (error) {
//     console.log(error)
//     res.send({ result: error })
//   }
// }


async function GetCol(req, res) {

  const { sort_type, bound, page, perPage } = req.body.datas;

  let index;
  if (sort_type === "user_name") {
    index = 2;
  } else if (sort_type === "collection") {
    index = 3;
  } else if(sort_type === "all") {

  }

    // 페이지 번호에 따라 시작과 끝을 계산
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage - 1;

  console.log(`getCol, sort_type :`, req.body.datas)

  try {
    let response;
    if(sort_type === "all") {
      response = await rpc.get_table_rows({
        json: true,
        code: 'eosio.nft',
        scope: 'eosio.nft',
        table: 'collections',
        limit: 10000
      });
      const data = response.rows.slice(startIndex, endIndex + 1); // 페이지에 해당하는 데이터 추출

      res.send({ result: data })

    } else {
      response = await rpc.get_table_rows({
        json: true,
        code: 'eosio.nft',
        scope: 'eosio.nft',
        table: 'collections',
        index_position: index,
        key_type: 'name',
        lower_bound: bound[0],
        upper_bound: bound[1],
        limit: 10000
      });
      const data = response.rows.slice(startIndex, endIndex + 1); // 페이지에 해당하는 데이터 추출

      res.send({ result: data })
    }
  
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }

}



//NFT 스키마 생성
async function CreateSchema(req, res) {
  const { creater, collection_name, schema_name, data_format, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const createSchema = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'createschema',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            authorized_creator: creater,
            collection_name: collection_name,
            schema_name: schema_name,
            schema_format: data_format
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      console.log(createSchema)
      res.send({ result: createSchema })
    } catch (error) {
      console.log(error)
      res.send({ result: error })
    }
  })();
}
//NFT 스키마 불러오기
// sort type : collection, data[0] : collection 이름, data[1] : limit (가져올 데이터 수)
// sort type : schema, data[0] : collection 이름, data[1] : schema 이름, data[2] : limit (가져올 데이터 수)
// async function GetSchema(req, res) {

//   const { sort_type, data, limit } = req.body.datas;


//   if (sort_type === "collection") {
//     try {
//       const response = await rpc.get_table_rows({
//         json: true,
//         code: 'eosio.nft',
//         scope: data[0],
//         table: 'schemas',
//         limit: limit
//       });
//       res.send({ result: response })
//       console.log(response)
//     } catch (error) {
//       res.send({ result: error })
//     }

//   } else if (sort_type === "schema") {
//     let index = 1;
//     try {
//       const response = await rpc.get_table_rows({
//         json: true,
//         code: 'eosio.nft',
//         scope: data[0],
//         table: 'schemas',
//         index_position: index,
//         key_type: 'name',
//         lower_bound: data[1],
//         upper_bound: data[1],
//         limit: limit
//       });
//       res.send({ result: response })
//       console.log(response)
//     } catch (error) {
//       console.log(error)
//       res.send({ result: error })
//     }
//   }

//   console.log(`getCol, sort_type : ${sort_type} , data : ${data}`)

// }

async function GetSchema(req, res) {

  const { sort_type, scope, bound, page, perPage } = req.body.datas;

  console.log("GetSchema 로그 : ", req.body.datas);

  // 페이지 번호에 따라 시작과 끝을 계산
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage - 1;

  // 검색 유형을 정해준다. 1 : schema, collection - scope만 적용됨. 
  let index = 0;
  let key_type = "";
  if (sort_type === "schema") {
    index = 1;
    key_type = "name";
  } else if (sort_type === "collection") {
    index = 0;
    key_type = "name";
  } else {
    res.send({ result: "sort_type 오류 입니다." })
  }

  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.nft',
      scope: scope,
      table: 'schemas',
      index_position: index,
      key_type: key_type,
      lower_bound: bound[0],
      upper_bound: bound[1],
      limit: 10000
    });

    const data = response.rows.slice(startIndex, endIndex + 1); // 페이지에 해당하는 데이터 추출

    res.send({ result: data })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }

}

//NFT 템플릿 생성
async function CreateTempl(req, res) {
  const { creater, collection_name, schema_name, max_supply, immutable_data, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const createTempl = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'createtempl',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            authorized_creator: creater,
            collection_name: collection_name,
            schema_name: schema_name,
            transferable: true,
            burnable: true,
            max_supply: max_supply,
            immutable_data: immutable_data
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: createTempl })
    } catch (error) {
      res.send({ result: error })
    }
  })();
}

//NFT 템플릿 불러오기
async function GetTempl(req, res) {
  const { sort_type, scope, bound, page, perPage } = req.body.datas;

  console.log("GetTempl 로그 : ", req.body.datas);

  // 페이지 번호에 따라 시작과 끝을 계산
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage - 1;

  // 검색 유형을 정해준다. 1 : template, 2 : schema, collection - scope만 적용됨. 
  let index = 0;
  let key_type = "";
  if (sort_type === "template") {
    index = 1;
    key_type = "i64";
  } else if (sort_type === "schema") {
    index = 2;
    key_type = "name";
  } else if (sort_type === "collection") {
    index = 0;
    key_type = "name";
  } else {
    res.send({ result: "sort_type 오류 입니다." })
  }

  try {
    const response = await rpc.get_table_rows({
      json: true,
      code: 'eosio.nft',
      scope: scope,
      table: 'templates',
      index_position: index,
      key_type: key_type,
      lower_bound: bound[0],
      upper_bound: bound[1],
      limit: 10000
    });

    const data = response.rows.slice(startIndex, endIndex + 1); // 페이지에 해당하는 데이터 추출

    res.send({ result: data })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }
}


//NFT 발행
async function MintAsset(req, res) {
  const { creater, collection_name, schema_name, template_id, immutable_data, mutable_data, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const mintAsset = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'mintasset',
          authorization: [{
            actor: creater,
            permission: 'active',
          }],
          data: {
            authorized_minter: creater,
            collection_name: collection_name,
            schema_name: schema_name,
            template_id: template_id,
            new_asset_owner: creater,
            immutable_data: immutable_data,
            mutable_data: mutable_data,
            tokens_to_back: []
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: mintAsset })
    } catch (error) {
      res.send({ result: error })
    }
  })();
}
//NFT 불러오기
async function GetNFT(req, res) {
  const { sort_type, scope, bound, page, perPage } = req.body.datas;

  console.log("GetNFT 로그 : ", req.body.datas);

  // 페이지 번호에 따라 시작과 끝을 계산
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage - 1;

  // 검색 유형을 정해준다. 1 : nft, 2 : collection, 3 : schema, 4 : template, user_name - scope만 적용됨. 
  let index = 0;
  let key_type = "";
  if (sort_type === "nft") {
    index = 1;
    key_type = "i64";
  } else if (sort_type === "collection") {
    index = 2;
    key_type = "name";
  } else if (sort_type === "schema") {
    index = 4;
    key_type = "name";
  } else if (sort_type === "template") {
    index = 5;
    key_type = "i64";
  } else if (sort_type === "user_name") {
    index = null;
    key_type = "name";
  } else {
    res.send({ result: "sort_type 오류 입니다." })
  }

  try {
    let response;
    if(sort_type !== "user_name") {
      response = await rpc.get_table_rows({
        json: true,
        code: 'eosio.nft',
        scope: scope,
        table: 'assets',
        index_position: index,
        key_type: key_type,
        lower_bound: bound[0],
        upper_bound: bound[1],
        limit: 10000
      });
    } else {
      response = await rpc.get_table_rows({
        json: true,
        code: 'eosio.nft',
        scope: scope,
        table: 'assets',
        limit: 10000
      });
    }
    
    const data = response.rows.slice(startIndex, endIndex + 1); // 페이지에 해당하는 데이터 추출

    res.send({ result: data })
    console.log(response)
  } catch (error) {
    console.log(error)
    res.send({ result: error })
  }
}

//오퍼 생성
async function CreateOffer(req, res) {
  const { sender, recipient, sender_asset_ids, recipient_asset_ids, memo, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const createoffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'createoffer',
          authorization: [{
            actor: sender,
            permission: 'active',
          }],
          data: {
            sender: sender,
            recipient: recipient,
            sender_asset_ids: sender_asset_ids,
            recipient_asset_ids: recipient_asset_ids,
            memo: memo
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: createoffer })
    } catch (error) {
      res.send({ result: error })
    }
  })();
}
//오퍼 수락
async function AcceptOffer(req, res) {
  const { user_name, offer_id, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const acceptOffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'acceptoffer',
          authorization: [{
            actor: user_name,
            permission: 'active',
          }],
          data: {
            offer_id: offer_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: acceptOffer })
    } catch (error) {
      res.send({ result: error })
    }
  })();
}
//오퍼 취소
async function CancelOffer(req, res) {
  const { user_name, offer_id, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const cancelOffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'canceloffer',
          authorization: [{
            actor: user_name,
            permission: 'active',
          }],
          data: {
            offer_id: offer_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: cancelOffer })
    } catch (error) {
      res.send({ result: error })
    }
  })();
}
//오퍼 거절
async function DeclineOffer(req, res) {
  const { user_name, offer_id, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const declineOffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'declineoffer',
          authorization: [{
            actor: user_name,
            permission: 'active',
          }],
          data: {
            offer_id: offer_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      res.send({ result: declineOffer })
    } catch (error) {
      res.send({ result: error })
    }
  })();
}
//마켓 등록
async function UploadMarket(req, res) {
  const { uploader, asset_id, collection_name, schema_name, price, private_key } = req.body.datas;

  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });
  (async () => {
    try {
      const createOffer = await hep.transact({
        actions: [{
          account: 'eosio.nft',
          name: 'createoffer',
          authorization: [{
            actor: uploader,
            permission: 'active',
          }],
          data: {
            sender: uploader,
            recipient: "eosio.market",
            sender_asset_ids: [asset_id],
            recipient_asset_ids: [],
            memo: "uploadmarket"
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      const response = await rpc.get_table_rows({
        json: true,
        code: 'eosio.nft',
        scope: 'eosio.nft',
        table: 'config',
        limit: 2
      });
      const upload = await hep.transact({
        actions: [{
          account: 'eosio.market',
          name: 'uploadmarket',
          authorization: [{
            actor: uploader,
            permission: 'active',
          }],
          data: {
            seller: uploader,
            col_name: collection_name,
            schema_name: schema_name,
            asset_id: asset_id,
            price: price,
            offer_id: response.rows[0].offer_counter - 1
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });

      res.send({ result: upload })

    } catch (error) {

      console.log({ result: error });
    }

  })();
}
//마켓 구매
async function BuyNFT(req, res) {
  const { offer_id, buyer, seller, asset_id, price, sale_id, buyer_private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([buyer_private_key,
    "5K8Usi9sYmkBSBpLsHeqEGQ8K3vAxBoUWrTnxRfLmDfeAwys93Q"]);
  const hep = new Api({ rpc, signatureProvider });

  try {
    const buyNFT = await hep.transact({
      actions: [{
        account: 'eosio.nft',
        name: 'acceptoffer',
        authorization: [{
          actor: "eosio.market",  // CPU 스테이킹을 할 계정
          permission: 'active',
        }],
        data: {
          offer_id: offer_id
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("acceptoffer")
    const transferAsset = await hep.transact({
      actions: [{
        account: 'eosio.nft',
        name: 'transfer',
        authorization: [{
          actor: "eosio.market",  // CPU 스테이킹을 할 계정
          permission: 'active',
        }],
        data: {
          from: "eosio.market",
          to: buyer,
          asset_ids: [asset_id],
          memo: "buyNFT"
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("transferasset")
    const cancelmarket = await hep.transact({
      actions: [{
        account: 'eosio.market',
        name: 'deletemarket',
        authorization: [{
          actor: "eosio.market",  // CPU 스테이킹을 할 계정
          permission: 'active',
        }],
        data: {
          sale_id: sale_id
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    const transferToken = await hep.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: buyer,
          permission: 'active',
        }],
        data: {
          from: buyer,
          to: seller,
          quantity: price,
          memo: "buyNFT"
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    res.send({ result: "SUCCESS" })
  } catch (error) {
    res.send({ result: error })
    console.log(error)
  }
}
//마켓 등록 취소
async function CancelMarket(req, res) {
  const { offer_id, sale_id, cancel_user_name, private_key } = req.body.datas;
  const signatureProvider = new JsSignatureProvider([private_key]);
  const hep = new Api({ rpc, signatureProvider });

  try {
    const cancelOffer = await hep.transact({
      actions: [{
        account: 'eosio.nft',
        name: 'canceloffer',
        authorization: [{
          actor: cancel_user_name,  // CPU 스테이킹을 할 계정
          permission: 'active',
        }],
        data: {
          offer_id: offer_id
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    const cancelmarket = await hep.transact({
      actions: [{
        account: 'eosio.market',
        name: 'cancelmarket',
        authorization: [{
          actor: cancel_user_name,  // CPU 스테이킹을 할 계정
          permission: 'active',
        }],
        data: {
          sale_id: sale_id
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    res.send({ result: "SUCCESS" })
  } catch (error) {
    res.send({ result: error })
    console.log(error)
  }
}
//ipfs 이미지 등록
async function UploadIPFS(req, res) {
  // console.log("ipfs 로그", req.body)
  const { img } = req.body;
  console.log(typeof img)
  // const img_data = fromString(img, 'base64')
  const pathToSaveImage = './nft_market/img/image.png'
  const path = converBase64ToImage(img, pathToSaveImage) //returns path /public/image.png 
  const readFile = fs.readFileSync(pathToSaveImage); // ipfs에 올릴 사진

  const uploadResult = await client.add(readFile)
  console.log(uploadResult.path)
  res.send({ result: uploadResult.path })
}

//경로를 통해 ipfs에 이미지 등록
async function UploadIPFS_byPath(req, res) {
  console.log("UploadIPFS_byPath 호출 ",req.body)
  const { img_path } = req.body;
  
  const pathToSaveImage = `./nft_market/img/collection/${img_path}.png`
  const readFile = fs.readFileSync(pathToSaveImage); // ipfs에 올릴 사진

  const uploadResult = await client.add(readFile)
  console.log(uploadResult.path)
  res.send({ result: uploadResult.path })
}