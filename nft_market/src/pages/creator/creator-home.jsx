import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { AiOutlinePlusCircle } from "react-icons/ai";
import CreatorHeader from "../../component/creator/creator-header";
import ItemCollection from "../../component/creator/item-collection";
import { postJSON } from "../../js/postJson";



export default function CreatorHome() {
  const navigate = useNavigate();

  const [collectionList, setCollectionList] = useState([]);

  const handleClickCreateCollection = () => {
    navigate("/creator/create-collection");
  };

  useEffect(() => {
    const url = "http://221.148.25.234:3333/GetCol";
    const data = {
      datas: {
        sort_type : "user",
        data: ["test3", 100],
        limit : 100
      },
    };
    postJSON(url, data).then((data) => {
      console.log("응답 후 데이터 : ", data); // JSON 객체이다. by `data.json()` call

      const collectionInfo =  data.result.rows.map((item) => {
        return {
          id: uuidv4(),
          collection_name: item.collection_name,
          img_logo: "https://ipfs.io/ipfs/"+item.serialized_data.find(item => item.key === "img_logo").value[1],
          img_background: "https://ipfs.io/ipfs/"+item.serialized_data.find(item => item.key === "img_background").value[1],
          display_name: item.serialized_data.find(item => item.key === "display_name").value[1],
        }
        
      });
      setCollectionList(collectionInfo);
    });
  }, []);


  return (
    <>
    {/* <button onClick={handle}>테스트 버튼</button> */}
      <CreatorHeader
        title="My Collections"
        content="모든 NFT는 컬렉션 내에 있습니다. 이는 동일한 프로젝트의 일부이거나 동일한 작성자가 만든 NFT 그룹입니다."
      />

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-7">
        <div
          onClick={handleClickCreateCollection}
          className="border-2 border-orange-400 rounded-2xl flex flex-col items-center justify-center h-64"
        >
          <div>
            <AiOutlinePlusCircle size={100} className="text-orange-400" />
          </div>
          <div className="mt-5">NFT Collection 만들기</div>
        </div>

        {collectionList.map((item) => (
          <ItemCollection
            key={item.id}
            img_logo={item.img_logo}
            img_background={item.img_background}
            collection_name={item.collection_name}
            display_name={item.display_name}
          />
        ))}
      </div>
    </>
  );
}
