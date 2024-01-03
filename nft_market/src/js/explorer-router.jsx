import React from 'react'
import { postJSON } from './postJson';




// 페이지 라우팅 시, 작동하는 메서드. 라우팅 결과 페이지에서 useLoaderData()를 통해 해당 리턴값을 활용한다.
// db 사용해야하므로 해당 값은 db api를 통해 가져올 것.
// 우선 해당 collectionId 값을 통해 api요청을 하고 데이터를 잘 가져왔다는 가정아래 진행할 것.
export async function explorerCollectionLoader({params}) {
    // console.log(`parms : `, params.collectionId);

    // const url = "http://221.148.25.234:3333/GetCol";
    // const data = {
    //   datas: {
    //     user_name: params.collectionId,
    //   },
    // };

    // const result = await postJSON(url, data);
    // console.log(`결과 값 : `, result);

    console.log(`loader 호출..`);

    const test_data = {
      collection_name: "cryptoguynft",
      author: "test3",
      market_fee: "1.00",
      collection_description: "크립토가이즈의 nft입니다.",
      display_name: "crypto guys의 nft 모음",
      img_background:
        "https://ipfs.io/ipfs/QmdrhpCxv8ho42RKycsPjTEoPanraQwj6XnD75dzzEUaUb",
      img_logo:
        "https://ipfs.io/ipfs/QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
      url: "http://cryptoexplorer.store/",
    };

    return test_data;     
}


export async function explorerTemplateLoader({params}) {
    console.log(`explorerTemplateLoader - parms : `, params);

    const url = "http://221.148.25.234:3333/GetTempl";
    const data = {
      datas: {
        sort_type: "template",
        data: ["cryptoguynft", params.templateId],
        limit : 100
      },
    };

    const result = await postJSON(url, data);
    console.log(`explorerTemplateLoader - 결과 값 : `, result);

    const parse_data = result.result.rows[0];

    const template_data = {
        template_id : parse_data.template_id,
        collection_name : params.collectionId,
        issued_supply : parse_data.issued_supply,
        schema_name : parse_data.schema_name,
        max_supply : parse_data.max_supply,
        burnable : parse_data.burnable,
        transferable : parse_data.transferable,
        template_img : "https://ipfs.io/ipfs/" +parse_data.immutable_serialized_data.find(item => item.key === "img").value[1],
        template_name :  parse_data.immutable_serialized_data.find(item => item.key === "name").value[1],
        immutable_serialized_data : parse_data.immutable_serialized_data
    }

    console.log(`explorerTemplateLoader - template_data`, template_data);
    return template_data;     
}


export async function explorerNFTLoader({params}) {
  console.log(`explorerNFTLoader - parms : `, params);

  const url = "http://221.148.25.234:3333/GetNFT";
  const data = {
    datas: {
      sort_type: "nft",
      data: [params.accountName, params.nftId],
      limit : 1
    },
  };

  const result = await postJSON(url, data);
  console.log(`explorerNFTLoader - 결과 값 : `, result);

  const parse_data = result.result.rows[0];

  const nft_data = {
      asset_id : parse_data.asset_id,
      collection_name : parse_data.collection_name,
      schema_name : parse_data.schema_name,
      template_id : parse_data.template_id,

      nft_name : parse_data.immutable_serialized_data.find(item => item.key === "name").value[1],
      nft_img : "https://ipfs.io/ipfs/" + parse_data.immutable_serialized_data.find(item => item.key === "img").value[1],
      immutable_serialized_data : parse_data.immutable_serialized_data,
  }

  console.log(`explorerNFTLoader - NFT_data`, nft_data);
  return nft_data;     
}