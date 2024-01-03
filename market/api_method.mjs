import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
const rpc = new JsonRpc('http://14.63.34.160:8888');
import fs  from 'fs';
import { fileURLToPath } from 'url';
import  {create}  from 'ipfs-http-client'
import  {Buffer}  from 'buffer'
import dotenv from 'dotenv';
import { converBase64ToImage } from 'convert-base64-to-image'

dotenv.config();
const auth = 'Basic ' + Buffer.from(process.env.projectId + ':' + process.env.projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});