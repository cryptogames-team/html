
import fs  from 'fs';
import { converBase64ToImage } from 'convert-base64-to-image'
import  {create}  from 'ipfs-http-client'
import  {Buffer}  from 'buffer'

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
async function UploadIPFS(){
    console.log("이미지 생성 중");
    let i;
    for(i = 1; i <= 8; i++){
        const pathToSaveImage = './character_img/character0' + i + ".png"
        console.log(pathToSaveImage)
        const readFile = fs.readFileSync(pathToSaveImage); // ipfs에 올릴 사진
    
        const uploadResult = await client.add(readFile)
        console.log(i + "의 해시값은 : " + uploadResult.path)
    } 
}

UploadIPFS();