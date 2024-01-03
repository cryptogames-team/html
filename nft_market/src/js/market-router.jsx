import { postJSON } from './postJson';

// 마켓에 리스팅된 NFT들의 목록을 가져온다.
export async function marketHomeLoader() {
    console.log(`marketHomeLoader - 시작.. `);

    // const url = "http://221.148.25.234:3333/GetCol";
    // const data = {
    //   datas: {
    //     sort_type: "collection",
    //     data: ["cryptoguynft"],
    //     limit : 100
    //   },
    // };

    // const result = await postJSON(url, data);
    // console.log(`marketHomeLoader - Getcol 호출..`, result);

    // const parse_data = result.result.rows[0];    
    // const serialized_data = parse_data.serialized_data;

    // const collection_data = {
    //   collection_name: parse_data.collection_name,
    //   author: parse_data.author,
    //   market_fee: parse_data.market_fee,
    //   collection_description: serialized_data.find(item => item.key === "collection_description").value[1],
    //   display_name: serialized_data.find(item => item.key === "display_name").value[1],
    //   img_background: "https://ipfs.io/ipfs/"+serialized_data.find(item => item.key === "img_background").value[1],
    //   img_logo: "https://ipfs.io/ipfs/"+serialized_data.find(item => item.key === "img_logo").value[1],
    //   url: serialized_data.find(item => item.key === "url").value[1],
    // }


    const market_item_data = [
        {
            nft_img : "",
            nft_name : "",
            nft_collection : "",
            nft_id : "",
            nft_price : ""
        },
        {

        }
    ]

    console.log(`marketHomeLoader - 출력 전, market_item_data..`, market_item_data);
    return market_item_data;     
}