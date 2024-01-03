import {
  AiOutlineSearch,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle
} from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { FaRegLightbulb } from "react-icons/fa";
import { PiNumberCircleOne, PiNumberCircleTwo, PiUpload } from "react-icons/pi";
import { GoGear } from "react-icons/go";

import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import CreatorHeader from "../../component/creator/creator-header";
import CardPrimary from "../../component/creator/card-primary";
import TemplateAttAdd from "../../component/creator/template-att-add";
import ButtonPrimary from "../../component/basic/btn-primary";
import CropImage from "../../component/basic/CropImage";
import ItemCategory from "../../component/creator/item-category";

async function postJSON(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("postJSON Success:", result);
    return result;
  } catch (error) {
    console.error("postJSON Error:", error);
  }
}

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

const imgModalStyles = {
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
    height: "700px",
    zIndex: "150",
    position: "absolute",
    top: "60%",
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

const selectCategoryModalStyles = {
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
    width: "800px",
    minHeight: "550px",
    zIndex: "150",
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -80%)",
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

export default function CreateTemplate() {
  const ex_template = {
    creater: "test2",
    collection_name: "crytoguysnft",
    schema_name: "bodies",
    max_supply: null,
    immutable_data: [
      {
        key: "name",
        value: ["string"],
      },
      {
        key: "img",
        value: ["image"],
      },
    ],
    private_key: "",
  };
  const [template_info, setTemplate_info] = useState(ex_template);

  const handleTemplateInfo = (e) => {
    console.log("handleTemplateInfo 호출");
    console.log("e.target.name : ", e.target.name);
    console.log("e.target.value : ", e.target.value);

    setTemplate_info((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  
  const handleImmutableData = (key, valueType, value) => {
    console.log(`handleImmutableData 호출 : ${key}, ${valueType}, ${value}`);

    setSelectCategory(prev => {
      return {...prev, format : prev.format.map(item => {
        if(item.name === key) {
          return {...item, value : value}
        } else {
          return item;
        }
      })}
    })
    
      // {format_key : key, format_value1 : valueType, format_value2 : value}
  };

  /* 
    카테고리 선택 관련
  */
  const [modalSelectCategory, setModalSelectCategory] = useState(false);

  function openSelectModal() {
    setModalSelectCategory(true);
  }
  function closeSelectModal() {
    setModalSelectCategory(false);
  }

  /* 
    카테고리 데이터 관련
  */

  const [category_info, setCategory_info] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");

  //카테고리(스키마) 정보 가져오기
  useEffect(() => {
    const collection_name = "cryptoguynft";
    const schema_name = "bodies";

    const url = "http://221.148.25.234:3333/GetSchema";
    const data = {
      datas: {
        collection_name: collection_name,
      },
    };

    postJSON(url, data).then((data) => {
      console.log("응답 후 데이터 : ", data); // JSON 객체이다. by `data.json()` call
      const schema_info = data.result.rows;
      console.log("schema 정보 : ", schema_info);
      setCategory_info(data.result.rows)
    });
  }, []);

  const handleSelectCategory = (schema_name) => {
    console.log("handleSelectCategory 호출", schema_name);
    console.log("handleSelectCategory 호출", category_info.find(item => item.schema_name === schema_name));
    setSelectCategory(category_info.find(item => item.schema_name === schema_name));
    closeSelectModal();  
  }

  const handleSubmitTemplate = async () => {
    console.log("handleSubmitTemplate 호출");

    if(selectCategory.format.find(item => item.value === undefined) || croppedTemImg === "") {
      alert("속성의 value 값을 입력해주세요.")
      return;
    }  

    openWaitingModal();

    // 이미지 ipfs에 등록
    const url = "http://221.148.25.234:3333/UploadIPFS";
    const data_tem_img = {
      img: croppedTemImg,
    };

    const url_img_tem =  await postJSON(url, data_tem_img); // 로고 이미지 ipfs에 저장
    const ipfs_url = "https://ipfs.io/ipfs/"; // ipfs의 url
    const path_ipfs_img_tem = ipfs_url+url_img_tem.result; // 로고 이미지의 url 값

    const new_data = {
      authorized_creator: "test3",
      collection_name: "cryptoguynft",
      schema_name: selectCategory.schema_name,
      transferable : true,
      burnable : true,
      max_supply : 100,
      immutable_data: selectCategory.format.map(item => {
        if(item.name === "img") {
          return {key : item.name , value : [item.type, path_ipfs_img_tem]}
        } else {
          return {key : item.name , value : [item.type, item.value]}
        }
      }
        ),
    };

    console.log("new_data 출력 :", new_data);
    data_Ref.current.value = JSON.stringify(new_data);  

    if (btnRef.current) {
      console.log(`트랜잭션 발생 버튼 클릭시키기..`);
      btnRef.current.click();      
    }

  };


  /* 
    트랜잭션 모달 관련
  */

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



  /* 
    템플릿 이미지 관련 
  */
  const [temImg, setTemImg] = useState(""); // 크롭되기 전 원본 이미지
  const [croppedTemImg, setCroppedTemImg] = useState(""); // 크롭후 이미지
  const [modalTemImage, setModalTemImage] = useState(false); // 템플릿 관련 모달 변수

  const closeTemImgCropModal = () => {
    setModalTemImage(false);
  };

  const openTemImgCropModal = () => {
    setModalTemImage(true);
  };

  // 템플릿 이미지의 파일 데이터를 받아서 crop 컴포넌트로 넘겨준다.
  const handleChangeTemImg = (e) => {
    console.log("handleChangeTemImg 호출");

    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setTemImg(reader.result); // 파일을 받아오면 파일의 데이터를 설정해준다.
        openTemImgCropModal(); // 이후 모달창을 띄어준다.
      };
    }
  };

  // 크롭된 이미지를 저장해준다.
  const handleSaveTemImg = (croppedImg) => {
    console.log("handleSaveTemImg 호출");
    setCroppedTemImg(croppedImg);
  };

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
        value={"createtempl"}
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


      <Modal isOpen={modalTemImage} style={imgModalStyles}>
        <CropImage
          title={"Crop Image"}
          content={
            "이미지를 업로드하고 사이트에서 직접 크기를 조정하여 템플릿의 이미지를 변경하세요."
          }
          img={temImg}
          width={"1"}
          height={"1"}
          onClose={closeTemImgCropModal}
          onSave={handleSaveTemImg}
        />
      </Modal>

      <Modal isOpen={modalSelectCategory} style={selectCategoryModalStyles}>
        <div className="flex flex-col items-center">
          <GiCancel className="self-end" size={25} onClick={closeSelectModal} />
          <div className="text-3xl font-bold my-2">Select Category</div>
          <div className="mt-5 text-sm flex flex-col p-7 rounded-2xl bg-tip">
            <div className="flex items-center">
              <FaRegLightbulb className="mr-2 text-yellow-400" />
              <div className="text-base">팁</div>
            </div>
            <div className="mt-3">
              카테고리는 NFT 및 NFT 템플릿의 속성을 정의하며 유형이나 릴리스 등
              NFT를 분류하는 방법으로도 사용할 수 있습니다.
            </div>
          </div>
          <div className="mt-7 self-start w-full flex items-center">
            <div className="md:flex hidden grow border rounded-xl p-2">
              <AiOutlineSearch size={25} />
              <span className="ml-3 text-slate-500">
                Search in Categories..
              </span>
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
          <div className="mt-7 grid grid-cols-4 w-full gap-3">
            {category_info.map((item) => (
              <ItemCategory
                onClick={() => handleSelectCategory(item.schema_name)}
                schema_name={item.schema_name}
                collection_name={"cryptoguynft"}
                att_count={item.format.length}
              ></ItemCategory>
            ))}
          </div>
        </div>
      </Modal>

      <CreatorHeader
        title="Create New Template"
        content="NFT는 템플릿을 참조하고 템플릿에 설정된 속성들을 반영합니다."
      />

      {/* 1. 카테고리 선택 */}
      <div className="mt-10 mb-3 p-3 flex items-center text-3xl">
        {selectCategory === "" ? (
          <>
            <PiNumberCircleOne
              size={40}
              className="h-full mr-3 text-orange-400"
            />
            <div>카테고리 선택</div>
          </>
        ) : (
          <>
            <AiOutlineCheckCircle
              size={40}
              className="h-full mr-3 text-green-400"
            />
            <div>선택 완료</div>
          </>
        )}
      </div>

      {selectCategory === "" ? (
        <>
          <CardPrimary css={"flex justify-center"}>
            <div
              className="p-7 flex flex-col items-center border-4 rounded-2xl border-orange-400"
              onClick={openSelectModal}
            >
              <GoGear className="mb-8 text-orange-400" size={50} />
              <div className="font-bold text-xl">카테고리 선택</div>
            </div>
          </CardPrimary>
        </>
      ) : (
        <>
          <CardPrimary css={"flex justify-center"}>
            <div
              className="p-7 flex flex-col items-center border-4 rounded-2xl border-orange-400"
              onClick={openSelectModal}
            >
              <div className="mt-1 font-bold text-xl text-orange-500">
                {selectCategory.schema_name}
              </div>
              <div className="mt-1 font-bold text-sm">{"콜렉션 이름"}</div>
              <div className="mt-1 text-sm">
                {selectCategory.format.length} Attributes
              </div>
            </div>
          </CardPrimary>
        </>
      )}

      {/* 2. 템플릿 생성 */}
      {selectCategory && (
        <div className="mt-10 mb-3 p-3 flex items-center text-3xl">
          <PiNumberCircleTwo
            size={40}
            className="h-full mr-3 text-orange-400"
          />
          <div>템플릿 생성</div>
        </div>
      )}

      {selectCategory && (
        <CardPrimary css={"flex flex-col"}>
          <div className="w-full grid grid-cols-3 gap-4">
            <div className="col-span-1 h-96 bg-body rounded-2xl ">
              <label
                className="w-full h-full flex flex-col justify-center items-center"
                htmlFor="img_template"
              >
                {croppedTemImg === "" ? (
                  <div className="flex flex-col justify-center items-center">
                    <div>
                      <PiUpload className="text-orange-400" size={64} />
                    </div>
                    <div className="font-san mt-5">
                      템플릿 이미지를 등록해주세요.
                    </div>
                    <div className="mt-2 text-xs">
                      형식: PNG, JPG, 최대 사이즈 : 7MB
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      className="w-80 h-80 rounded-2xl hover:"
                      src={croppedTemImg}
                    ></img>
                  </div>
                )}
              </label>
              <input
                id="img_template"
                className="sr-only"
                type="file"
                onChange={handleChangeTemImg}
              ></input>
            </div>

            <div className="ml-10 col-span-2 flex flex-col">
              <div>
                <div>최대 공급량</div>
                <div>
                  <input
                    type="text"
                    className="mt-3 w-4/12 p-2 text-sm border-solid border rounded-lg bg-body"
                    placeholder="입력 안할 시, 무제한 공급"
                    name="max_supply"
                    value={template_info.max_supply}
                    onChange={handleTemplateInfo}
                  ></input>
                </div>
              </div>
              <div className="mt-10 text-sm flex flex-col p-7 rounded-2xl bg-tip">
                <div className="flex items-center">
                  <FaRegLightbulb className="mr-2 text-yellow-400" />
                  <div className="text-base">탬플릿 만들기 팁</div>
                </div>
                <div className="mt-7">
                  템플릿의 주요 목적은 중복된 데이터(예: 이름, 이미지)를 한 번만
                  저장하여 RAM 비용을 절약하는 것입니다. 템플릿을 사용하면 민트
                  번호로만 구분된 시각적으로 동일한 NFT가 생성됩니다
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="mt-10 text-3xl font-bold">속성</div>
            <div className="mt-8">
              {selectCategory.format.map((item) => (
                <TemplateAttAdd
                  css={"mt-4"}
                  key_name={item.name}
                  valueType={item.type}
                  onChangeValue={handleImmutableData}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <ButtonPrimary text={"등록"} onClick={handleSubmitTemplate} />
          </div>
        </CardPrimary>
      )}
    </>
  );
}
