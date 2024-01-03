const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)

const app = express();

const maxAge = 1000 * 60 * 5;
// 세션 설정
app.use(session({
  secret: 'heptagon',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod:maxAge }),
  cookie: {
    maxAge,
  },
}));

app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', 'http://192.168.137.1:63859');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용할 HTTP 메소드 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');  
  next();
});

app.use(express.json()); // JSON 데이터 파싱

// 로그인 라우트
app.post('/login', (req, res) => {
  // 여기에서 로그인 로직을 구현하고 세션을 설정합니다.
  console.log(`body 정보 : `,req.body);
  const {accountName, publicKey} = req.body; // 유저의 이름과 public key를 응답받는다.
  
  req.session.accountName = accountName;     // 세션에 계정명 저장
  req.session.publicKey = publicKey;     // 세션에 공개키 저장
  console.log("세션 id : ", req.sessionID)
  
  res.send({result_status : "success", data : {msg: `로그인 성공. 세션에 데이터(${accountName}, ${publicKey}) 저장 성공`}});
});

// 세션 확인 라우트
app.post('/isLogin', (req, res) => {
  // 세션에 저장된 유저명 확인
  console.log("세션 id : ", req.sessionID)
  console.log("isLogin 호출!")
  try {
    if(req.session) {
      
      const {accountName, publicKey} = req.session;
      if(!accountName || !publicKey) {
        
        throw new Error("세션에 accountName, publicKey 없음")
      } 

      res.send({ result_status: "success", data: { msg: "계정 이름, 공개키 조회 성공", accountName: accountName, publicKey: publicKey } });
    } else {
      
      throw new Error("세션값 없음")
    }
    
  } catch (error) {
    
    res.send({result_status : "fail", data : {msg : error.message}});  
  }
});


// 세션 삭제 라우트
app.post('/logout', (req, res) => {
    // 세션을 파괴하여 만료시킴
    req.session.destroy((error) => {
        if (error) {
          res.send({result_status : "fail", data : {msg : error}});    
        }
        res.send({result_status : "success", data : {msg : "로그아웃 성공"}});
    });
});



// 서버 시작
const PORT = 3101;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
