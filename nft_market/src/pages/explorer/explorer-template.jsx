import React, { useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineAreaChart,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FaBurn } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import ButtonPrimary from "../../component/basic/btn-primary";
import Modal from "react-modal";

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

Modal.setAppElement("#root");

export default function ExplorerTemplate() {
  const template_info = useLoaderData(); // 콜렉션의 정보를 가져온다. collection_name, author, market_fee 등등.
  console.log(`template_info : `, template_info);

  const handleMintNFT = () => {
    console.log("handleMintNFT 호출");
    openWaitingModal();

    const new_data = {
      authorized_minter: "test3",
      collection_name: "cryptoguynft",
      schema_name: "bodies",
      template_id: 1,
      new_asset_owner: "test3",
      mutable_data: "",
      immutable_data: [],
      tokens_to_back: [],
    };
    
    data_Ref.current.value = JSON.stringify(new_data);  
    if (btnRef.current) {
      console.log(`트랜잭션 발생 버튼 클릭시키기..`);
      btnRef.current.click();      
    }
  
  }



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
        value={"mintasset"}
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

      <div className="mt-3 text-xs font-bold">
        {`Explorer > ${template_info.collection_name} > ${template_info.template_name}`}
      </div>
      <div className="mt-5 text-2xl font-bold">
        <span>Template : </span>
        <span className="text-orange-400">{`${template_info.template_name}`}</span>
      </div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 bg-card rounded-xl p-5">
          <img
            className="mt-10"
            src={template_info.template_img}
          ></img>
        </div>
        <div className="col-span-3 bg-card rounded-xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="col-span-2 font-bold text-2xl">
            <div>{template_info.template_name}</div>
          </div>

          <div className="font-bold">
            <div className="text-slate-500">템플릿 ID</div>
            <div className="p-1">{`# ${template_info.template_id}`}</div>
          </div>
          <div className="font-bold">
            <div className="text-slate-500">콜렉션</div>
            <div className="p-1">{`${template_info.collection_name}`}</div>
          </div>
          <div className="font-bold">
            <div className="text-slate-500">발행량</div>
            <div className="p-1">{`${template_info.issued_supply}`}</div>
          </div>
          <div className="font-bold">
            <div className="text-slate-500">카테고리</div>
            <div className="p-1">{`${template_info.schema_name}`}</div>
          </div>
          <div className="col-span-2 font-bold">
            <div className="text-slate-500">소각 가능 여부</div>
            <div className="p-1">
              {template_info.burnable === 1 ? (
                <div className="flex items-center">
                  <FaBurn />
                  <div className="ml-2">소각 가능</div>
                </div>
              ) : (
                "소각 불가능"
              )}
            </div>
          </div>
          <div className="col-span-2 font-bold">
            <div className="text-slate-500">교환 가능 여부</div>
            <div className="p-1">
              {template_info.transferable === 1 ? (
                <div className="flex items-center">
                  <BiTransfer />
                  <div className="ml-2">교환 가능</div>
                </div>
              ) : (
                "교환 불가능"
              )}
            </div>
          </div>

          <div className="col-span-2 bg-mint p-5 rounded-xl grid grid-cols-1 lg:grid-cols-2">
            <div>
              <div className="text-slate-500">최저 제안 가격</div>
              <div className="text-lime-500 font-bold p-1">-</div>
            </div>
            <ButtonPrimary
              text={"민팅하기"}
              css={"justify-self-end self-center"}
              onClick={handleMintNFT}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 bg-card rounded-xl p-5">
        <div className="font-bold">Template Attributes</div>
        <table className="w-full mt-7 table-auto border-2 border-slate-500 rounded-lg border-collapse">
          <tbody>
            {template_info.immutable_serialized_data.map((item) => {
              return (
                <tr>
                  <td className="p-4 border border-slate-500 font-bold">
                    {item.key}
                  </td>
                  <td className="p-4 border border-slate-500 font-bold">
                    {item.value[1]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
