import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import ButtonPrimary from "../../component/basic/btn-primary";
import { IoIosArrowDown } from "react-icons/io";
import {
  AiOutlineSearch,
  AiOutlineAreaChart,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
} from "react-icons/ai";

Modal.setAppElement("#root");

const customModalStyles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "500px",
    height: "480px",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -70%)",
    borderRadius: "10px",
    borderColor: "rgb(0,0,0)",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    color: "white",
    backgroundColor: "#1A203C",
    justifyContent: "center",
    overflow: "auto",
  },
};

export default function TradingHome() {
  const mock_data = [
    {
      asset_id: "1099511627779",
      collection_name: "cryptoguynft",
      schema_name: "bodies",
      template_id: 1,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "yellow body",
      template_img: "QmQTHBEA6gYsemkcMNxnBkvNx49Jfk5kKvVhrgMEPKQmDn",
    },
    {
      asset_id: "1099511627784",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 2,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "blue body",
      template_img: "QmR6W9mzkPAU3jg7hAVJYhFX8b3xe5S3csi44f9zut7R7D",
    },
    {
      asset_id: "1099511627793",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 3,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "orange body",
      template_img: "QmRD4QSFHMx35R9v4HCKnLj4MAM21Yz5VkJ6xcwm8CJhRQ",
    },
    {
      asset_id: "1099511627794",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 7,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "blue mask",
      template_img: "QmexuD6bZqG3XCpXjbMNvuX3hdtGAjDZkrgPmaUZSFJY1h",
    },
    {
      asset_id: "1099511627795",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 8,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "red ribon",
      template_img: "QmSfrvAWNVLkwRHKkeg546ZTCKvzW4C9ueQNsMzEUzm8px",
    },
  ];

  const opponent_mock_data = [
    {
      asset_id: "1099511627778",
      collection_name: "cryptoguynft",
      schema_name: "bodies",
      template_id: 4,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "pink body",
      template_img: "QmTYCFPrkTJLJiiztwYwArfuQVQe7wpTrS4aLKfSbNgWsz",
    },
    {
      asset_id: "1099511627780",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 5,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "puple body",
      template_img: "QmfJX4DSoVCAnXFD2uMDbY5y2nogdrR4hURi1UqtjRwncy",
    },
    {
      asset_id: "1099511627781",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 6,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "green body",
      template_img: "QmNPjQZCzh3utVgtjSMjqnXBVMWCQke6fcauTNxY8fnTKY",
    },
    {
      asset_id: "1099511627782",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 9,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "pink belt",
      template_img: "QmNojDuUmsYnhDfZPdE7rS4U6skBEvzfjYzmx1yYA6auBm",
    },
    {
      asset_id: "1099511627783",
      collection_name: "cryptoguynft",
      schema_name: "bodypart",
      template_id: 10,
      ram_payer: "test3",
      backed_tokens: [],
      immutable_serialized_data: [],
      mutable_serialized_data: [],
      template_name: "green tie",
      template_img: "QmRPGR27s1L5VcBxV6LM3ZrYAZNBsLsoDPFhGvbNC5ao82",
    },
  ];

  const [nfts, setNfts] = useState(mock_data);
  const [choiceNfts, setChoiceNfts] = useState("");

  const [opponentNfts, setOpponentNfts] = useState(opponent_mock_data);
  const [opponentChoiceNfts, setOpponentChoiceNfts] = useState("");

  const handleChoiceNFT = (asset_id) => {
    console.log("handleChoiceNFT 호출");
    const choiceItem = nfts.find((item) => item.asset_id === asset_id);
    console.log(`choiceItem : `, choiceItem);
    setChoiceNfts(choiceItem);
  };

  const handleOpponentChoiceNFT = (asset_id) => {
    console.log("handleOpponentChoiceNFT 호출");
    const choiceItem = opponentNfts.find((item) => item.asset_id === asset_id);
    console.log(`choiceItem : `, choiceItem);
    setOpponentChoiceNfts(choiceItem);
  };

  const [opponentName, setOpponentName] = useState("");
  const handleOnChangeOpponentName = (e) => {
    console.log("handleOnChangeOpponentName 호출", e.target.value);
    setOpponentName(e.target.value);
  };

  const handleOffer = () => {
    console.log("handleOffer 호출");
    openWaitingModal();
    const my_assetId = parseInt(choiceNfts.asset_id, 10);
    const opponent_assetId = parseInt(opponentChoiceNfts.asset_id, 10);

    const new_data = {
      sender: "test3",
      recipient: "test2",
      sender_asset_ids: [my_assetId],
      recipient_asset_ids: [opponent_assetId],
      memo: "test3",
    };

    data_Ref.current.value = JSON.stringify(new_data);  
    if (btnRef.current) {
      console.log(`트랜잭션 발생 버튼 클릭시키기..`);
      btnRef.current.click();      
    }
  };

  const btnRef = useRef(null);
  const data_Ref = useRef(null);

  // 모달 창 관련 변수
  const [modalWaitingIsOpen, setModalWaitingIsOpen] = useState(false);
  const [modalSuccessIsOpen, setModalSuccessIsOpen] = useState(false);

  // 트랜잭션 대기 관련 모달..?
  function openWaitingModal() {
    setModalWaitingIsOpen(true);
  }

  function closeWaitingModal() {
    setModalWaitingIsOpen(false);
  }

  function afterWaitingModal() {
    console.log("트랜잭션 실행");
  }

  // 트랜잭션 성공 시 모달
  const ref_result = useRef();
  const ref_status = useRef();
  const [trxId, setTrxId] = useState("");
  const [shortId, setShortId] = useState("");
  function openSuccessModal(trx_id) {
    setModalSuccessIsOpen(true);
    const url_explorer = "http://cryptoexplorer.store/Transaction/";
    setTrxId(trx_id);
    setShortId(short_trx_id(trx_id));
  }

  function short_trx_id(keyString) {
    const maxLength = 10; // 원하는 최대 길이

    if (keyString.length <= maxLength) {
      return keyString;
    }

    const shortenedKey = `${keyString.substring(
      0,
      maxLength / 2
    )}...${keyString.substring(keyString.length - maxLength / 2)}`;
    return shortenedKey;
  }

  function closeSuccessModal() {
    setModalSuccessIsOpen(false);
    // navigate("/creator");
  }

  function afterSuccessModal() {}

  const handleCompleteTrx = () => {
    console.log("handleCompleteTrx 호출");

    console.log(`transaction id : `, ref_result.current.value);
    console.log(
      `transaction id2 : `,
      JSON.parse(ref_result.current.value).transaction_id
    );

    closeWaitingModal();
    openSuccessModal(JSON.parse(ref_result.current.value).transaction_id);
  };

  return (
    <>
      <input id="auth_name" type="hidden" value={"test3"} readOnly></input>
      <input ref={data_Ref} id="data" type="hidden" />
      <input
        id="action_account"
        type="hidden"
        value={"eosio.nft"}
        readOnly
      ></input>
      <input
        id="action_name"
        type="hidden"
        value={"createoffer"}
        readOnly
      ></input>
      <button id="transaction" ref={btnRef}></button>

      <button
        id="transaction_complete"
        className="sr-only"
        onClick={handleCompleteTrx}
      ></button>
      <input id="result" type="hidden" ref={ref_result}></input>
      <input id="status" type="hidden" ref={ref_status}></input>

      <Modal
        isOpen={modalWaitingIsOpen}
        onAfterOpen={afterWaitingModal}
        style={customModalStyles}
      >
        <div className="font-san w-full h-full flex flex-col justify-center items-center">
          <AiOutlineLoading3Quarters size={80} />
          <div className="mt-10 text-4xl">트랜잭션 생성 중</div>
          <div className="mt-10">지갑을 통해 트랜잭션을 확인해주세요. </div>
          {/* <button onClick={closeWaitingModal}>닫기</button> */}
        </div>
      </Modal>

      <Modal
        isOpen={modalSuccessIsOpen}
        onAfterOpen={afterSuccessModal}
        style={customModalStyles}
      >
        <div className="font-san w-full h-full flex flex-col justify-center">
          <div className="flex-grow flex flex-col justify-center items-center">
            <AiOutlineCheckCircle className="text-lime-500" size={80} />
            <div className="mt-10 text-4xl">트랜잭션 성공</div>
            <div className="mt-10">
              트랜잭션 ID :{" "}
              <a
                className=" text-orange-500 font-bold"
                href={`http://cryptoexplorer.store/Transaction/${trxId}`}
                target="_blank"
              >
                {shortId}
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="mt-10 border rounded-3xl w-11/12 h-9"
              onClick={closeSuccessModal}
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2">
        <div className="text-2xl font-bold">New Trade Offer</div>
        <ButtonPrimary
          text={"교환 제안"}
          css={"justify-self-end"}
          onClick={handleOffer}
        />
      </div>

      <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="col-span-2 lg:col-span-1">
          <div className="border-2 border-orange-400 rounded-md p-4 text-xl flex items-center justify-between">
            <div>My Wishlist</div>
            <IoIosArrowDown size={23} />
          </div>
          <div className="my-7 font-bold text-2xl">
            <div className="p-2">{"testAccount"}</div>
          </div>
          <div className="border-2 border-orange-400 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3">
            {choiceNfts !== "" ? (
              <div
                key={choiceNfts.asset_id}
                className="col-start-2 bg-card flex flex-col items-start rounded-xl p-5"
              >
                <img
                  src={"https://ipfs.io/ipfs/" + choiceNfts.template_img}
                  alt=""
                ></img>
                <div className="mt-2 text-sm font-bold">
                  {choiceNfts.collection_name}
                </div>
                <div className="mt-2 text-orange-400 font-bold">
                  {choiceNfts.template_name}
                </div>
                <div className="mt-2 font-bold">{`# ${choiceNfts.template_id}`}</div>
              </div>
            ) : null}
          </div>
          <div className="bg-card p-6 mt-6 rounded-xl">
            <div className="flex grow border border-orange-400 rounded-xl p-2 mt-3">
              <AiOutlineSearch size={25} />
              <span className="ml-3 text-slate-500">Search in NFTs</span>
            </div>
            <div className="mt-5">
              <select
                className="w-full bg-inherit text-center"
                placeholder="All collections"
              >
                <option className="bg-card" name="type" value="string">
                  All collections
                </option>
              </select>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-7">
            {nfts.map((item) => {
              return (
                <div
                  key={item.asset_id}
                  className="bg-card flex flex-col items-start rounded-xl p-5"
                  onClick={() => handleChoiceNFT(item.asset_id)}
                >
                  <img
                    src={"https://ipfs.io/ipfs/" + item.template_img}
                    alt=""
                  ></img>
                  <div className="mt-2 text-sm font-bold">
                    {item.collection_name}
                  </div>
                  <div className="mt-2 text-orange-400 font-bold">
                    {item.template_name}
                  </div>
                  <div className="mt-2 font-bold">{`# ${item.template_id}`}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className="invisible border-2 border-orange-400 rounded-md p-4 text-xl flex items-center justify-between">
            <div>Opponent Wishlist</div>
            <IoIosArrowDown size={23} />
          </div>
          <div className="my-7 font-bold text-2xl">
            <input
              type="text"
              className="w-full bg-inherit border-2 rounded-lg p-2 active:border-orange-400"
              placeholder="상대 계정이름을 입력해주세요"
              onChange={handleOnChangeOpponentName}
            ></input>
          </div>

          {opponentName !== "" ? (
            <OppenentUI
              opponentChoiceNfts={opponentChoiceNfts}
              opponentNfts={opponentNfts}
              handleOpponentChoiceNFT={handleOpponentChoiceNFT}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}


function OppenentUI({opponentChoiceNfts, opponentNfts, handleOpponentChoiceNFT}) {

  return (
    <>
      <div className="border-2 border-orange-400 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3">
        {opponentChoiceNfts !== "" ? (
          <div
            key={opponentChoiceNfts.asset_id}
            className="col-start-2 bg-card flex flex-col items-start rounded-xl p-5"
          >
            <img
              src={"https://ipfs.io/ipfs/" + opponentChoiceNfts.template_img}
              alt=""
            ></img>
            <div className="mt-2 text-sm font-bold">
              {opponentChoiceNfts.collection_name}
            </div>
            <div className="mt-2 text-orange-400 font-bold">
              {opponentChoiceNfts.template_name}
            </div>
            <div className="mt-2 font-bold">{`# ${opponentChoiceNfts.template_id}`}</div>
          </div>
        ) : null}
      </div>
      <div className="bg-card p-6 mt-6 rounded-xl">
        <div className="flex grow border border-orange-400 rounded-xl p-2 mt-3">
          <AiOutlineSearch size={25} />
          <span className="ml-3 text-slate-500">Search in NFTs</span>
        </div>
        <div className="mt-5">
          <select
            className="w-full bg-inherit text-center"
            placeholder="All collections"
          >
            <option className="bg-card" name="type" value="string">
              All collections
            </option>
          </select>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-7">
        {opponentNfts.map((item) => {
          return (
            <div
              key={item.asset_id}
              className="bg-card flex flex-col items-start rounded-xl p-5"
              onClick={() => handleOpponentChoiceNFT(item.asset_id)}
            >
              <img
                src={"https://ipfs.io/ipfs/" + item.template_img}
                alt=""
              ></img>
              <div className="mt-2 text-sm font-bold">
                {item.collection_name}
              </div>
              <div className="mt-2 text-orange-400 font-bold">
                {item.template_name}
              </div>
              <div className="mt-2 font-bold">{`# ${item.template_id}`}</div>
            </div>
          );
        })}
      </div>
    </>
  );
  
}
