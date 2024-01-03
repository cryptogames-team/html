import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineAreaChart,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import {
  PiPaintBrushBold,
  PiPercentBold,
  PiCalendarCheckLight,
} from "react-icons/pi";

import { useLoaderData, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../component/basic/btn-primary";
import { postJSON } from "../../js/postJson";
import { getJSON } from "../../js/getJson";


export default function ExplorerCollection() {
  const collection_info = useLoaderData(); // 콜렉션의 정보를 가져온다. collection_name, author, market_fee 등등.
  console.log(`collection_info : `, collection_info);

  const initSelectBtn = [
    { name: "Stats", isClick: true, menu: <MenuStats /> },
    { name: "NFTs", isClick: false, menu: <MenuNFTs /> },
    { name: "Template", isClick: false, menu: <MenuTemplate /> },
    { name: "Categories", isClick: false, menu: <MenuCategories /> },
    { name: "Accounts", isClick: false, menu: <MenuAccounts /> },
  ];
  const [selectBtn, setSelectBtn] = useState(initSelectBtn);
  const handleSelectBtn = (selectBtn) => {
    console.log("handleSelectBtn 호출", selectBtn);
    setSelectBtn((prev) => {
      return prev.map((item) => {
        if (selectBtn === item) {
          return { ...item, isClick: true };
        } else {
          return { ...item, isClick: false };
        }
      });
    });
  };

  

  return (
    <>
     

      <div className=" bg-slate-500">
        <img
          className="w-full h-1/6"
          src={collection_info.img_background}
        ></img>
      </div>

      <div className="flex">
        <ExplorerCollectionProfile collection_info={collection_info} />

        <div className="w-3/4 mt-5 flex flex-col p-7">
          <div className="w-full grid grid-cols-2">
            <div className="text-3xl font-bold">
              {collection_info.collection_name}
            </div>
            <ButtonPrimary
              css={"font-bold justify-self-end"}
              text={"관리하기"}
            />
          </div>

          <div className="mt-10">
            <div className="font-bold">About the collection</div>
            <div className="mt-4">{collection_info.collection_description}</div>
          </div>

          <div className="rounded-xl mt-10 grid grid-cols-5 justify-items-stretch text-center bg-card gap-x-1">
            {selectBtn.map((item) => {
              return (
                <div
                  key={item.name}
                  onClick={() => handleSelectBtn(item)}
                  className={`rounded-xl p-3 hover:bg-white hover:text-black ${
                    item.isClick === true ? "bg-white text-black" : ""
                  }`}
                >
                  {item.name}
                </div>
              );
            })}
          </div>

          <div className="mt-7">
            {selectBtn.find((item) => item.isClick === true).menu}
          </div>
        </div>
      </div>
    </>
  );
}

function MenuStats() {
  return (
    <>
      <div>
        <div className="text-xl font-bold">Hot NFTs 🔥</div>

        <div className="mt-5 text-xl font-bold">Top Sales</div>

        <div className="mt-5 text-xl font-bold">Market Volume</div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="mt-5 text-xl font-bold">Top Sellers ⚡️</div>
          <div className="mt-5 text-xl font-bold">Top Buyers 💰️</div>
        </div>
      </div>
    </>
  );
}

function MenuNFTs() {
  return (
    <>
      <div>
        <div className="text-xl font-bold">Asset in the Collection</div>
        <SearchForm placeholderText={"Search..."} />
      </div>
    </>
  );
}

function MenuTemplate() {
  const navigate = useNavigate();

  const collection_info = useLoaderData(); // 콜렉션의 정보를 가져온다. collection_name, author, market_fee 등등.
  console.log(`MenuCategories : collection_info : `, collection_info);

  const [template_info, setTemplate_info] = useState([]);

  useEffect(() => {
    const url = "http://221.148.25.234:3333/GetTempl";
    const data = {
      datas: {
        sort_type: "collection",
        data: collection_info.collection_name,
      },
    };

    postJSON(url, data).then((data) => {
      console.log("결과값 : ", data); // JSON 객체이다. by `data.json()` call
      const template_data = data.result.rows.map((item) => {
        return {
          collection_name : collection_info.collection_name,
          schema_name : item.schema_name,
          template_id : item.template_id,
          template_name : item.immutable_serialized_data.find(item => item.key === "name").value[1],
          template_img : "https://ipfs.io/ipfs/"+item.immutable_serialized_data.find(item => item.key === "img").value[1],
          issued_supply : item.issued_supply
        }
      })
      setTemplate_info(template_data);
    });
  }, []);

  const handleOnClickTemplate = (collectionName, templateId) => {
    console.log("handleOnClickTemplate 호출 : ", collectionName, templateId);
    navigate(`/explorer/template/${collectionName}/${templateId}`);
  };


  return (
    <>
      <div>
        <div className="text-xl font-bold">Template in the Collection</div>
        <SearchForm placeholderText={"Search..."} />
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {template_info.map((item) => {
            return (
              <div
                key={item.template_id}
                className="bg-card flex flex-col items-start rounded-xl p-5"
                onClick={() =>
                  handleOnClickTemplate(item.collection_name, item.template_id)
                }
              >
                <img src={item.template_img} alt=""></img>
                <div className="mt-2 text-sm font-bold">
                  {item.collection_name}
                </div>
                <div className="mt-2 text-orange-400 font-bold">
                  {item.template_name}
                </div>
                <div className="mt-2 font-bold">{`# ${item.template_id}`}</div>
                <div className="mt-2 font-bold text-slate-500">{`${item.issued_supply} NFTs`}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function MenuCategories() {
  const collection_info = useLoaderData(); // 콜렉션의 정보를 가져온다. collection_name, author, market_fee 등등.
  console.log(`MenuCategories : collection_info : `, collection_info);
  const [catetory_info, setCatetory_info] = useState([]);

  useEffect(() => {
    const url = "http://221.148.25.234:3333/GetSchema";
    const data = {
      datas: {
        sort_type: "collection",
        data: collection_info.collection_name,
      },
    };

    postJSON(url, data).then((data) => {
      console.log("결과값 : ", data); // JSON 객체이다. by `data.json()` call
      const schema_data = data.result.rows.map((item) => {
        return {
          collection_name : collection_info.collection_name,
          schema_name : item.schema_name,
        }
      })
      setCatetory_info(schema_data);
    });
  }, []);

  return (
    <>
      <div>
        <div className="text-xl font-bold">Categories in the Collection</div>
        <SearchForm placeholderText={"Search..."} />
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {catetory_info.map((item) => {
            return (
              <div
                key={item.schema_name}
                className="border-2 bg-card border-orange-400 flex flex-col rounded-xl p-5"
              >
                <div className="text-orange-400 text-xl font-bold text-center">
                  {item.schema_name}
                </div>
                <div className="mt-5 text-xl font-bold text-center">
                  {collection_info.collection_name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function MenuAccounts() {
  return (
    <>
      <div>
        <div className="text-xl font-bold">
          Accounts holding this Collection
        </div>
        <SearchForm placeholderText={"Search..."} />
      </div>
    </>
  );
}

function SearchForm({ placeholderText }) {
  return (
    <div className="mt-7 self-start w-full flex items-center">
      <div className="md:flex hidden grow border rounded-xl p-2">
        <AiOutlineSearch size={25} />
        <input
          type="text"
          className="w-full text-white ml-3 bg-body focus:outline-0 active:border-0 border-0"
          placeholder={placeholderText}
        ></input>
      </div>
      <div className="ml-3">
        <select
          className="bg-inherit text-center border rounded-xl p-2"
          name="type"
        >
          <option className="bg-card" name="type" value="string">
            최신순
          </option>
          <option className="bg-card" name="type" value="string">
            오래된 순
          </option>
          <option className="bg-card" name="type" value="integer">
            알파벳순(A-Z)
          </option>
          <option className="bg-card" name="type" value="bool">
            알파벳 역순(A-Z)
          </option>
        </select>
      </div>
    </div>
  );
}

function ExplorerCollectionProfile({ collection_info }) {
  return (
    <>
      <div className="w-1/4 flex flex-col rounded-2xl py-10 bg-card">
        <div className="flex flex-col items-center">
          <div className="my-5 w-48">
            <img className="rounded-full" src={collection_info.img_logo}></img>
          </div>
          <div className="font-bold text-lg ">
            {collection_info.collection_name}
          </div>
          <div className="mt-1">{collection_info.display_name}</div>
          <div className="mt-1">
            <a
              className="text-orange-500 "
              target="blank"
              href={collection_info.url}
            >
              Visit Website
            </a>
          </div>
        </div>

        <div className="mt-6 border-b-2 px-5">
          <div className="flex flex-col">
            <div className="flex">
              <AiOutlineAreaChart
                className="text-lime-400"
                size={25}
              ></AiOutlineAreaChart>
              <span className="ml-3">24h Volume</span>
            </div>
            <div className="text-lime-400 text-xl font-bold">27,330 Hep</div>
          </div>

          <div className="flex flex-col my-6">
            <div className="flex">
              <AiOutlineAreaChart
                className="text-lime-400"
                size={25}
              ></AiOutlineAreaChart>
              <span className="ml-3">Total Volume</span>
            </div>
            <div className="text-lime-400 text-xl font-bold">
              236,142,973 Hep
            </div>
          </div>
        </div>

        <div className="mt-10 ml-3 flex flex-col">
          <div className="flex items-center">
            <PiPaintBrushBold size={20}></PiPaintBrushBold>
            <div className="ml-2">Created by :</div>
            <div className="ml-2 font-bold">{collection_info.author}</div>
          </div>
          <div className="flex items-center mt-2">
            <PiPercentBold size={20}></PiPercentBold>
            <div className="ml-2">Royalty Fee :</div>
            <div className="ml-2 font-bold">{collection_info.market_fee}</div>
          </div>
          <div className="flex items-center mt-2">
            <PiCalendarCheckLight size={20}></PiCalendarCheckLight>
            <div className="ml-2">Created on :</div>
            <div className="ml-2 font-bold">2023. 10. 19. 오후 6:24</div>
          </div>
        </div>
      </div>
    </>
  );
}
