import { fileURLToPath } from 'url';
import path from 'path';
import https from 'https';
import express from 'express';
import session from 'express-session';
import  MemoryStore from 'memorystore';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/cryptoexplorer.store/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/cryptoexplorer.store/fullchain.pem')
}

const server = https.createServer(options,app);
const MemoryStores = MemoryStore(session);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const maxAge = 1000 * 60 * 5;
app.use(session({
  secret: 'heptagon',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStores({ checkPeriod:maxAge }),
  cookie: {
    maxAge,
  },
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용할 HTTP 메소드 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더 설정
  next();
});

app.listen(4000, '0.0.0.0', () => {
    console.log('Server is running : port 4000')
  })
  app.use(express.static(path.join(__dirname, 'explorer/build')));

  app.get('*', function (요청, 응답) {
  응답.sendFile(path.join(__dirname, '/explorer/build/index.html'));
});


app.post('/login', (req, res) => {
  console.log("dd")
  const { UserKey, UserName } = req.body;
  
  // 세션에 데이터 저장
  req.session.UserKey = UserKey;
  req.session.UserName = UserName;
  res.send({ result: 'Logged in successfully' });
});
app.post('/userdata', (req, res) => {
  console.log("cc");
  console.log("유저키 : " + req.session.UserKey)
  const UserKey = req.session.UserKey;
  const UserName = req.session.UserName;
  
  if(UserKey&&UserName){
    res.send({ Status : true,UserKey: UserKey, UserName: UserName });
  }else {
    res.send({Status : false})
  }
  
});