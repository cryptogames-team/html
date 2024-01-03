import {
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlinePlusCircle,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { FaRegLightbulb } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { RxTriangleDown } from "react-icons/rx";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import CreatorHeader from "../../component/creator/creator-header";
import CardPrimary from "../../component/creator/card-primary";
import CategoryAttribute from "../../component/creator/category-attribute";
import ButtonPrimary from "../../component/basic/btn-primary";
import { useNavigate } from "react-router-dom";

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

export default function CreateCategory() {
  const navigate = useNavigate();

  const initialCategory = {
    category_name: "",
    category_att: [
      { id: uuidv4(), name: "name", type: "string", userType : "String"  },
      { id: uuidv4(), name: "img", type: "string", userType : "String"  },
    ],
  };

  const [category_info, setCategory_info] = useState(initialCategory);
  const [newAttList, setNewAttList] = useState([]);
  const ex_category = {
    category_name: "카테고리 이름",
    category_att: "카테고리 속성 (배열)",
  };
  const ex_newAttList = [
    { name: "name", type: "text"},
    { name: "img", type: "Image"},
  ];

  const data = {
    datas: {
      creater: "test2",
      collection_name: "abcdefg23341",
      schema_name: category_info.category_name,
      private_key: "5JuzUTGmEneRCG8eDDz3fMqaR1egoo7roeJ43erJ7sdJFwnxbS9",
      data_format: category_info.category_att,
    },
  };

  const handleChangeCategoryName = (e) => {
    console.log("handleChangeCategoryName 호출");
    setCategory_info(prev => ({...prev, category_name : e.target.value}));
  }

  const handleAddAtt = () => {
    console.log("handleAddAtt 호출");
    setNewAttList((prev) => {
      return [...prev, { id: uuidv4(), name: "", type: "string" }];
    });
  };

  const handleRemoveAtt = (e) => {
    console.log("handleRemoveAtt 호출");
    console.log("삭제 시 id2 값 :", e.target.value);
    setNewAttList((prev) => prev.filter((att) => att.id !== e.target.value));
  };

  const handleChangeAtt = (e, id) => {
    console.log("handleChangeAtt 호출 : ", e.target.value);
    console.log("handleChangeAtt 호출 : ", e.target.name);
    console.log("handleChangeAtt 호출 : ", id);

    setNewAttList((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, [e.target.name]: e.target.value };
        } else {
          return item;
        }
      });
    });
  };


  const handleCategorySubmit = () => {
    console.log("handleCategorySubmit 호출");
    console.log("newAttList : ", newAttList);

    if(newAttList.find(item => item.name === '')) {
      alert("속성의 이름을 입력해주세요")
      return;
    }

    if(category_info.category_name === '') {
      alert("카테고리의 이름을 입력해주세요")
      return;
    }

    openWaitingModal();

    const merge_att = [...initialCategory.category_att, ...newAttList]
    console.log(`merge_att : `, merge_att);

    const new_data = {
      authorized_creator: "test3",
      collection_name: "cryptoguynft",
      schema_name: category_info.category_name,
      schema_format: merge_att.map(item => {
        return {name : item.name, type : item.type}
      }),
    };

    console.log("new_data 출력 :", new_data);
    data_Ref.current.value = JSON.stringify(new_data);  

    if (btnRef.current) {
      console.log(`트랜잭션 발생 버튼 클릭시키기..`);
      btnRef.current.click();      
    }

  };

  const btnRef = useRef(null);
  const data_Ref = useRef(null);

  const ref_result = useRef();
  const ref_status = useRef();


  const handleCompleteTrx = () => {
    console.log("handleCompleteTrx 호출");
    console.log(`transaction id : `, JSON.parse(ref_result.current.value).transaction_id);

    closeWaitingModal();
    openSuccessModal(JSON.parse(ref_result.current.value).transaction_id);
  }

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
  const [trxId, setTrxId] = useState('');
  const [shortId, setShortId] = useState('');
  function openSuccessModal(trx_id) {
    setModalSuccessIsOpen(true);
    setTrxId(trx_id);
    setShortId(short_trx_id(trx_id));    
  }

  function short_trx_id(keyString) {
    const maxLength = 10; // 원하는 최대 길이
  
    if (keyString.length <= maxLength) {
      return keyString;
    }
  
    const shortenedKey = `${keyString.substring(0, maxLength / 2)}...${keyString.substring(keyString.length - maxLength / 2)}`;
    return shortenedKey;    
  }

  function closeSuccessModal() {
    setModalSuccessIsOpen(false);
    // navigate("/creator");
  }

  function afterSuccessModal() {
  }

  const handleTest = () => {
    console.log("handleTest 호출");
  
  }

  return (
    <>
      {/* <button onClick={handleTest}>테스트</button> */}
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
        value={"createschema"}
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



      <CreatorHeader
        title="Create Category"
        content="NFT와 NFT의 Collection을 만들기 전에, 카테고리를 만들어야
          합니다. 카테고리는 NFT와 NFT 템플릿의 속성을 정의합니다."
      />

      <CardPrimary css={"p-3"}>
        {/* NFT Category 제목 부분 */}
        <div className="flex items-center text-3xl">
          <AiOutlinePlusSquare className="h-full mr-3 text-orange-400" />
          <div>카테고리 데이터 등록</div>
        </div>

        {/* NFT Category 내용 부분 */}
        <div className="mt-7 flex flex-col items-center p-7 rounded-2xl bg-tip shadow-lg">
          <div className="flex items-center">
            <FaRegLightbulb className="mr-2 text-yellow-400" />
            <div className="text-xl">카테고리 만들기 팁</div>
          </div>
          <div className="mt-7">
            카테고리는 NFT의 속성과 NFT 템플릿의 속성들을 정의합니다.
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3">
          <div className="col-span-1 flex flex-col items-center">
            <div className="text-3xl text-center w-full">카테고리 이름</div>
            <div className="mt-7 px-7 w-full">
              <input
                type="text"
                className="w-full text-center p-3 rounded-lg bg-body"
                placeholder="Category Name"
                value={category_info.category_name}
                onChange={handleChangeCategoryName}
                required
              ></input>
            </div>
          </div>

          <div className="col-span-2 flex flex-col">
            <div className="grid grid-cols-12">
              <div className="text-center text-3xl col-span-5">속성 이름</div>
              <div className="text-center text-3xl col-span-5">속성 유형</div>
            </div>

            {category_info.category_att.map((item) => {
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 place-items-center">
                  <CategoryAttribute
                    key={`name_${item.id}`}
                    text={item.name}
                    css={"mt-7 p-5 w-10/12 col-span-5"}
                  />
                  <CategoryAttribute
                    key={`type_${item.id}`}
                    text={item.userType}
                    css={"mt-7 p-5 w-10/12 col-span-5"}
                  />
                </div>
              );
            })}

            {newAttList.map((item) => {
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 place-items-center">
                  <CategoryAttribute css={"mt-7 p-5 w-10/12 col-span-5"}>
                    <input
                      type="text"
                      placeholder="새 속성의 이름"
                      onChange={(e) => handleChangeAtt(e, item.id)}
                      name="name"
                      value={item.name}
                      className="border-0 w-full h-full text-center bg-card"
                    ></input>
                  </CategoryAttribute>

                  <CategoryAttribute css={"mt-7 p-5 w-10/12 col-span-5"}>
                    <select
                      className="bg-inherit text-center"
                      name="type"
                      value={item.type}
                      onChange={(e) => handleChangeAtt(e, item.id)}
                    >
                      <option className="bg-card" name="type" value="string">
                        String
                      </option>
                      <option className="bg-card" name="type" value="integer">
                        Integer Number
                      </option>
                      <option className="bg-card" name="type" value="bool">
                        Boolean
                      </option>
                    </select>
                  </CategoryAttribute>

                  <div>
                    <label htmlFor={`input_${item.id}`}>
                      <GiCancel
                        className="mt-7 col-span-2"
                        size={30}
                      ></GiCancel>
                    </label>
                    <input
                      id={`input_${item.id}`}
                      type="hideen"
                      className="sr-only"
                      readOnly
                      value={item.id}
                      onClick={handleRemoveAtt}
                    ></input>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-span-1"></div>

          <div
            className="bg-body col-span-2 mt-10 p-3 border border-orange-400 rounded-2xl"
            onClick={handleAddAtt}
          >
            <div className="flex justify-center items-center">
              <div className="text-xl">새로운 속성 추가</div>
              <AiOutlinePlusCircle size={25} className="ml-3" />
            </div>
          </div>

          <div className="col-span-1"></div>

          {/* 저장 버튼*/}
          <div className="col-span-2 mt-7 font-sans flex justify-end">
            <ButtonPrimary text={"등록"} onClick={handleCategorySubmit} />
          </div>
        </div>
      </CardPrimary>
    </>
  );
}
