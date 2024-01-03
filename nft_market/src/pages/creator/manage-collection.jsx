import React, { useEffect, useState } from 'react'
import { useNavigate, useLoaderData } from "react-router-dom";
import CreatorHeader from '../../component/creator/creator-header';
import CardInput from '../../component/creator/card-input';
import CardPrimary from '../../component/creator/card-primary';
import { postJSON } from '../../js/postJson';
import { AiOutlinePlusCircle } from "react-icons/ai";


export default function ManageCollection() {
  
  const collection_data = useLoaderData(); // 콜렉션의 정보를 가져온다. collection_name, author, market_fee 등등.
  console.log(`collection_info : `, collection_data);

  const [selectedTab, setSelectedTab] = useState('NFTs');

  const renderUI = () => {
    if(selectedTab === 'NFTs') {
      return <TabNFTs collection_name={collection_data.collection_name} />
    } else if(selectedTab === 'Templates') {
      return <TabTemplates collection_name={collection_data.collection_name}/>
    } else if(selectedTab === 'Categories') {
      return <TabCategories collection_name={collection_data.collection_name}/>      
    }
  }

  return (
    <>
      <CreatorHeader
        title={`Collection : ${collection_data.collection_name}`}
        content="컬렉션과 관련된 모든 것을 관리할 수 있습니다."
      />
      <CollectionInfo collection_data={collection_data} />

      <div className="mt-10 grid grid-cols-3">
        <SelectBtn text={"NFTs"} onClick={setSelectedTab} isClick={selectedTab === 'NFTs' ? true : false} />
        <SelectBtn text={"Templates"} onClick={setSelectedTab} isClick={selectedTab === 'Templates' ? true : false} />
        <SelectBtn text={"Categories"} onClick={setSelectedTab} isClick={selectedTab === 'Categories' ? true : false}/>        
      </div>

      <div className='p-5 mt-5 grid grid-cols-2 lg:grid-cols-6 gap-5'>
        {renderUI()}
      </div>

    </>
  );
}

// 로그인 처리 후, 계정명을 가져와야함.
function TabNFTs({collection_name}) {
  const navigate = useNavigate();
  
  console.log(`TabNFTs - collection name : `, collection_name);
  const [nftsInfo, setNftsInfo] = useState([]);
  const handleCreateNFT = () => {
    console.log("handleCreateNFT 호출");
  }
  const handleClickNFT = (user_name, asset_id) => {
    console.log("handleClickNFT 호출", user_name, asset_id);
    navigate(`/explorer/nft/${user_name}/${asset_id}`);
  }

  const user_name = "test3" // 로그인 처리 후, 계정명을 가져와야함. 
  useEffect(() => {
    const url = "http://221.148.25.234:3333/GetNFT";
    const data = {
      datas: {
        sort_type : "collection",
        data: [user_name, collection_name],
        limit : 100
      },
    };
    postJSON(url, data).then((data) => {
      console.log("응답 후 데이터 : ", data); // JSON 객체이다. by `data.json()` call
      const nftsInfo =  data.result.rows.map((item) => {
        return {
          user_name : user_name,
          asset_id : item.asset_id,
          collection_name : collection_name,
          schema_name : item.schema_name,
          nft_name : item.immutable_serialized_data.find(item => item.key === "name").value[1],
          nft_img : "https://ipfs.io/ipfs/"+item.immutable_serialized_data.find(item => item.key === "img").value[1],
        }
        
      });
      setNftsInfo(nftsInfo);
    });
  },[]); 


  return (
    <>
      <CreateBtn onClick={handleCreateNFT} text={"NFT 민팅하기"} />
      {nftsInfo.map((item) => {
        return (
          <NFTComponent item={item} handleClickNFT={handleClickNFT} />
        );
      })}
      
    </>
  );
}

function NFTComponent({ item, handleClickNFT}) {
  return (
    <div
      key={item.asset_id}
      className="bg-card flex flex-col items-start rounded-xl p-5"
      onClick={() => handleClickNFT(item.user_name, item.asset_id)}
    >
      <img src={item.nft_img} alt=""></img>
      <div className="mt-2 text-sm font-bold">{item.collection_name}</div>
      <div className="mt-2 text-orange-400 font-bold">{item.nft_name}</div>
      <div className="mt-2 font-bold text-slate-500">{`# ${item.asset_id}`}</div>
    </div>
  );
}

function TabTemplates({collection_name}) {
  console.log(`TabTemplates - collection name : `, collection_name);
  const [templatesInfo, setTemplatesInfo] = useState([]);
  const handleCreateTemplate = () => {
    console.log("handleCreateTemplate 호출");
  }
  const handleClickTemplate = (template_id) => {
    console.log("handleClickTemplate 호출", template_id);
  }

  useEffect(() => {
    const url = "http://221.148.25.234:3333/GetTempl";
    const data = {
      datas: {
        sort_type: "collection",
        data: [collection_name],
        limit : 100
      },
    };
    postJSON(url, data).then((data) => {
      console.log("응답 후 데이터 : ", data); // JSON 객체이다. by `data.json()` call
      const templatesInfo =  data.result.rows.map((item) => {
        return {
          template_id : item.template_id,
          collection_name : collection_name,
          schema_name : item.schema_name,
          template_name : item.immutable_serialized_data.find(item => item.key === "name").value[1],
          template_img : "https://ipfs.io/ipfs/"+item.immutable_serialized_data.find(item => item.key === "img").value[1],
          issued_supply : item.issued_supply,
        }
        
      });
      setTemplatesInfo(templatesInfo);
    });
  },[]); 


  return (
    <>
      <CreateBtn onClick={handleCreateTemplate} text={"템플릿 생성하기"} />
      {templatesInfo.map((item) => {
        return (
          <TemplateComponent item={item} handleClickTemplate={handleClickTemplate} />
        );
      })}
      
    </>
  );
}

function TemplateComponent({ item, handleClickTemplate}) {
  return (
    <div
      key={item.asset_id}
      className="bg-card flex flex-col items-start rounded-xl p-5"
      onClick={() => handleClickTemplate(item.template_id)}
    >
      <img src={item.template_img} alt=""></img>
      <div className="mt-2 text-sm font-bold">{item.collection_name}</div>
      <div className="mt-2 text-orange-400 font-bold">{item.template_name}</div>
      <div className="mt-2 font-bold">{`# ${item.template_id}`}</div>
      <div className="mt-2 font-bold text-slate-500">{`# ${item.issued_supply} NFTs`}</div>
    </div>
  );
}

function TabCategories({collection_name}) {
  console.log(`TabCategories - collection name : `, collection_name);
  const [categoriesInfo, setCategoriesInfo] = useState([]);
  const handleCreateCategory = () => {
    console.log("handleCreateCategory 호출");
  }
  const handleClickCategory = (schema_name) => {
    console.log("handleClickCategory 호출", schema_name);
  }

  useEffect(() => {
    const url = "http://221.148.25.234:3333/GetSchema";
    const data = {
      datas: {
        sort_type: "collection",
        data: [collection_name],
        limit : 100
      },
    };
    postJSON(url, data).then((data) => {
      console.log("응답 후 데이터 : ", data); // JSON 객체이다. by `data.json()` call
      const categoriesInfo =  data.result.rows.map((item) => {
        return {
          collection_name : collection_name,
          schema_name : item.schema_name,
          schema_format : item.format,
          att_count : item.format.length
        }
        
      });
      setCategoriesInfo(categoriesInfo);
    });
  },[]); 


  return (
    <>
      <CreateBtn onClick={handleCreateCategory} text={"카테고리 생성하기"} />
      {categoriesInfo.map((item) => {
        return (
          <CategoryComponent item={item} handleClickCategory={handleClickCategory} />
        );
      })}
    </>
  );  
}

function CategoryComponent({ item, handleClickCategory}) {
  return (
    <>
      <div
        key={item.schema_name}
        className="border-2 bg-card border-orange-400 flex flex-col items-center rounded-xl p-5"
      >
        <div className="text-orange-400 text-xl font-bold">
          {item.schema_name}
        </div>
        <div className="mt-2 text-xl font-bold">
          {item.collection_name}
        </div>
        <div className='mt-2'>
          {`${item.att_count} Attributes`}
        </div>        
      </div>
    </>
  );
}


function CollectionInfo({ collection_data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="bg-card p-3 rounded-xl flex justify-center">
        <img
          src={collection_data.img_logo}
          className="p-10 rounded-xl object-cover"
        ></img>
      </div>
      <CardPrimary
        css={"col-span-1 lg:col-span-2"}
        card_name={"Collection Details"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardInput
            input_name={"Collection Name *"}
            name={"collection_name"}
            type={"text"}
            value={collection_data.collection_name}
            isReadOnly={true}
          />
          <CardInput
            input_name={"Display Name *"}
            name={"display_name"}
            type={"text"}
            value={collection_data.display_name}
            isReadOnly={true}
          />
          <CardInput
            input_name={"Website URL *"}
            name={"url"}
            type={"text"}
            value={collection_data.url}
            isReadOnly={true}
          />
          <CardInput
            input_name={"Market Fee *"}
            name={"fee"}
            type={"num"}
            value={collection_data.market_fee}
            isReadOnly={true}
          />
          <CardInput
            input_name={"Collection Description"}
            name={"collection_name"}
            css={"col-span-2"}
            type={"text"}
            value={collection_data.collection_description}
            isReadOnly={true}
          />
        </div>
      </CardPrimary>
    </div>
  );
}

function SelectBtn({text, isClick, onClick}) {
  const handleClick = () => {
    console.log("handleClick 호출");
    onClick(text);  
  }

  return (
    <button
      className={`${
        isClick === true ? "border-b-2 border-white text-white" : "border-b border-slate-500 text-slate-500"
      } hover:text-white font-bold pb-2`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

function CreateBtn({ onClick, text }) {
  return (
    <>
      <div
        onClick={onClick}
        className="border-2 border-orange-400 rounded-2xl flex flex-col items-center justify-center"
      >
        <div>
          <AiOutlinePlusCircle size={70} className="text-orange-400" />
        </div>
        <div className="mt-5 font-bold">{text}</div>
      </div>
    </>
  );
}

