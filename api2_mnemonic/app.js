const express = require('express');
const cors = require('cors');

const bip39 = require('bip39')
const hdkey = require('hdkey')
const wif = require('wif')
const ecc = require('eosjs-ecc')



const app = express();

app.use(cors());
app.use(express.json()); // JSON 데이터 파싱

app.set('port', process.env.PORT || 3100);


/*
  니모닉을 생성해준다.
*/
app.post('/mnemonic_create', (req, res) => {
    
    const mnemonic = bip39.generateMnemonic() // 니모닉 생성
    console.log(mnemonic)
    console.log(typeof mnemonic)


    const response = {
        mnemonic
      };
    res.json(response);
});


/*
  니모닉과 자식 숫자를 기반으로 eos 기반의 private, public 키를 만들어주는 API
  요청값으로 니모닉(mnemonic)과 자식 숫자(num_child)를 받는다.
*/
app.post('/key_create_from_mnemonic', (req, res) => {
  
  console.log("api 요청 : /key_create_from_mnemonic")  
  console.log(req.body)
  
  const { mnemonic, num_child } = req.body; // 니모닉과 자식 숫자를 받아온다.
  const mnemonic_string = mnemonic.join(', '); // 배열을 string으로 변환.
  const seed = bip39.mnemonicToSeedSync(mnemonic_string); // 니모닉으로 시드를 만들어준다.
  const master = hdkey.fromMasterSeed(Buffer.from(seed, 'hex')); // 시드를 기반으로 마스터 키를 만들어준다.
 
  const node = master.derive("m/44'/1207'/0/"+num_child.toString()) // 마스터 키로부터 노드를 구한다.
    // 노드 생성은 BIP 44를 따른다.key 구분 : private key(m), 목적 : bip 44(44'), 코인 숫자 :  1207'(heptagon 숫자), 잔돈 계정 없음 (0), 자식의 숫자(num_child)
  
  const privateKey = wif.encode(128, node._privateKey, false) // private key 생성
  const publicKey = ecc.PublicKey(node._publicKey).toString() // eos 기반 public key 생성

  const keyPairs = [
    {
      publicKey: publicKey,
      privateKey: privateKey
    }
  ]
  ;

  res.json({ keyPairs });
});

app.post('/mnemonic_confirm', (req, res) => {

  console.log("api 요청 : /mnemonic_confirm")  
  console.log(req.body)

  const { mnemonic} = req.body; // 니모닉을 받아온다.
  const isMnemonic = bip39.validateMnemonic(mnemonic); // 니모닉을 검증한다.
    
  console.log(isMnemonic)

  const response = {
      isMnemonic
    };
  res.json(response);
});


app.listen(app.get('port'), ()=>{
  console.log(app.get('port'), '번 포트에서 대기 중')
});



// 니모닉, public, priavte key 생성 예제
// app.get('/mnemonic_create', (req, res) => {
    
//     const mnemonic = bip39.generateMnemonic() // 니모닉 생성
//     // console.log(mnemonic)

//     // const test_mn = "mimic scan merit bunker coconut always captain lift student bonus random mom"
//     const seed = bip39.mnemonicToSeedSync(mnemonic) // 니모닉으로부터 seed 추출

//     const master = hdkey.fromMasterSeed(Buffer(seed, 'hex')) // seed로부터 마스터 키 추출
//     const node = master.derive("m/44'/1207'/0") // 마스터 키에서 node 추출. 마스터키의 private key, bip 44, 1207(heptagon 숫자), 첫번째 자식
//     console.log("publicKey: "+ecc.PublicKey(node._publicKey).toString())
//     console.log("privateKey: "+wif.encode(128, node._privateKey, false))

//     const node2 = master.derive("m/44'/1207'/1") // 마스터 키에서 node 추출. 마스터키의 private key, bip 44, 1207(heptagon 숫자), 두번째 자식
//     console.log("publicKey: "+ecc.PublicKey(node2._publicKey).toString())
//     console.log("privateKey: "+wif.encode(128, node2._privateKey, false))

//     res.send()

//     const response = {
//         mnemonic,
//         keyPairs: [
//           { publicKey: publicKey1, privateKey: privateKey1 },
//           { publicKey: publicKey2, privateKey: privateKey2 }
//         ]
//       };
    
//     res.json(response);
// });

