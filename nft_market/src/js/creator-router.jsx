import React from 'react'
import { postJSON } from './postJson';

// Getcol api 를 사용해서, 콜렉션 이름을 통해서 콜렉션의 정보를 받아오면 된다.
// 유저의 이름은 로그인된 정보로부터 받아온다. (현재는 하드코딩함)
export async function creatorCollectionLoader({params}) {
    console.log(`creatorCollectionLoader - parms : `, params.collectionId);

    const url = "http://221.148.25.234:3333/GetCol";
    const data = {
      datas: {
        sort_type: "collection",
        data: ["cryptoguynft"],
        limit : 100
      },
    };

    const result = await postJSON(url, data);
    console.log(`creatorCollectionLoader - Getcol 호출..`, result);

    const parse_data = result.result.rows[0];    
    const serialized_data = parse_data.serialized_data;

    const collection_data = {
      collection_name: parse_data.collection_name,
      author: parse_data.author,
      market_fee: parse_data.market_fee,
      collection_description: serialized_data.find(item => item.key === "collection_description").value[1],
      display_name: serialized_data.find(item => item.key === "display_name").value[1],
      img_background: "https://ipfs.io/ipfs/"+serialized_data.find(item => item.key === "img_background").value[1],
      img_logo: "https://ipfs.io/ipfs/"+serialized_data.find(item => item.key === "img_logo").value[1],
      url: serialized_data.find(item => item.key === "url").value[1],
    }

    // const test_data = {
    //   collection_name: "cryptoguynft",
    //   author: "test3",
    //   market_fee: "1.00",
    //   collection_description: "크립토가이즈의 nft입니다.",
    //   display_name: "crypto guys의 nft 모음",
    //   img_background:
    //     "https://ipfs.io/ipfs/QmdrhpCxv8ho42RKycsPjTEoPanraQwj6XnD75dzzEUaUb",
    //   img_logo:
    //     "https://ipfs.io/ipfs/QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
    //   url: "http://cryptoexplorer.store/",
    // };

    console.log(`creatorCollectionLoader - 출력 전, collection_data..`, collection_data);
    return collection_data;     
}