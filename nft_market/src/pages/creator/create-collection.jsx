import React, { useState, useContext, useEffect, useRef } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import {
  BsTrash
} from "react-icons/bs";
import Modal from "react-modal";
import CreatorHeader from "../../component/creator/creator-header";
import InputPrimary from "../../component/basic/input-primary";
import CardInput from "../../component/creator/card-input";
import CardPrimary from "../../component/creator/card-primary";
import ButtonPrimary from "../../component/basic/btn-primary";
import CropImage from "../../component/basic/CropImage";
import { useNavigate } from "react-router-dom";

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

const mock_data = {
  datas: {
    creater: "test2",
    collection_name: "abcdefg22341",
    fee: "2",
    private_key: "5JuzUTGmEneRCG8eDDz3fMqaR1egoo7roeJ43erJ7sdJFwnxbS9",
    data: [
      { key: "display_name", value: ["string", "전시용 이름"] },
      { key: "collection_description", value: ["string", "컬렉션 설명"] },
      { key: "url", value: ["string", "www.example.com"] }
    ],
    img_logo : "이미지",
    img_background : "이미지2",
  },
};

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

Modal.setAppElement("#root");



export default function CreateCollection() {
  const initialCollection = {
    collection_name: "dd",
    display_name: "dd2",
    url: "dd3",
    market_fee: "dd4",
    collection_description: "dd5",
    img_logo: "dd6",
    img_background: "dd7",
  };
  const navigate = useNavigate();

  // 콜렉션 관련 입력 받을 정보

  const [collectionInput, setCollectionInput] = useState("");
  const handleCollectionSubmit = (e) => {
    e.preventDefault();
    console.log("handleCollectionSubmit 호출");
    console.log("collectionInput 확인 : ", collectionInput);
    // openWaitingModal();
    submitCollectionData();
  };

  const btnRef = useRef(null);
  const data_Ref = useRef(null);

  async function submitCollectionData() {

    openWaitingModal();

    // 1. ipfs를 통해 키값 받아오기.
    const url = "http://221.148.25.234:3333/UploadIPFS";
    const data_logo_img = {
      img: collectionInput.img_logo,
    };
    const data_logo_background = {
      img: collectionInput.img_background,
    };

    const url_img_logo =  await postJSON(url, data_logo_img); // 로고 이미지 ipfs에 저장
    const url_img_background =  await postJSON(url, data_logo_background); // 배경 이미지 ipfs에 저장

    const ipfs_url = "https://ipfs.io/ipfs/"; // ipfs의 url
    const path_ipfs_img_logo = ipfs_url+url_img_logo.result; // 로고 이미지의 url 값
    const path_ipfs_img_background = ipfs_url+url_img_background.result; // 배경 이미지의 url 값


    // 2. data 형식에 맞게 데이터 재조립...

    // input에 들어가야할 데이터, 테스트용 하드코딩
    const new_data = {
      author: "test3",
      collection_name: "cryptoguynft",
      allow_notify: true,
      authorized_accounts: [],
      notify_accounts: [],
      market_fee: 0,
      data: [
        {
          key: "display_name", 
          value: ["string", "crypto guys의 nft"],
        },
        {
          key: "collection_description",
          value: ["string", "crypto guys의 게임 플레이를 위한 nft 모음입니다."],
        },
        { key: "url", value: ["string", collectionInput.url] },
        { key: "img_logo", value: ["string", path_ipfs_img_logo] },
        { key: "img_background", value: ["string", path_ipfs_img_background] },
      ],
    };

    // const new_data = {
    //   author: "test3",
    //   collection_name: collectionInput.collection_name,
    //   allow_notify: true,
    //   authorized_accounts: [],
    //   notify_accounts: [],
    //   market_fee: collectionInput.market_fee,
    //   data: [
    //     {
    //       key: "display_name", 
    //       value: ["string", collectionInput.display_name],
    //     },
    //     {
    //       key: "collection_description",
    //       value: ["string", collectionInput.collection_description],
    //     },
    //     { key: "url", value: ["string", collectionInput.url] },
    //     { key: "img_logo", value: ["string", path_ipfs_img_logo] },
    //     { key: "img_background", value: ["string", path_ipfs_img_background] },
    //   ],
    // };

    console.log(`new_data 출력 : `, new_data);
    data_Ref.current.value = JSON.stringify(new_data);  

    if (btnRef.current) {
      console.log(`트랜잭션 발생 버튼 클릭시키기..`);
      btnRef.current.click();      
    }
  
  }
  
  const ref_result = useRef();
  const ref_status = useRef();

  const handleCompleteTrx = () => {
    console.log("handleCompleteTrx 호출");

    console.log(`transaction id : `, ref_result.current.value);
    console.log(`transaction id2 : `, JSON.parse(ref_result.current.value).transaction_id);

    closeWaitingModal();
    openSuccessModal(JSON.parse(ref_result.current.value).transaction_id);
  }

  const handleCollectionInputChange = (e) => {
    console.log("handleCollectionInputChange 호출");

    let { name, value } = e.target;
    name = name.trim();
    value = value.trim();
    console.log("name : ", name, ", value : ", value);

    setCollectionInput({ ...collectionInput, [name]: value });
  };

  /*
  로고 이미지 관련 변수들
  */

  // 로고 이미지 관련
  const [logoImg, setLogoImg] = useState("");

  // 크롭된 이미지를 저장해준다.
  const handleSaveLogoImg = (croppedImg) => {
    console.log("handleSaveLogoImg 호출");
    setCollectionInput({ ...collectionInput, img_logo: croppedImg });
  };

  // 로고 이미지의 파일 데이터를 받아서 crop 컴포넌트로 넘겨주는 로직
  const handleLogoImgChange = async (e) => {
    console.log("handleLogoImgChange 호출");
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setLogoImg(reader.result); // 파일을 받아오면 파일의 데이터를 설정해준다.
        openLogoImageCrop(); // 이후 모달창을 띄어준다.
      };
    }
  };

  /*
  백그라운드 이미지 관련 변수들
  */

  const [backgroundImg, setBackgroundImg] = useState("");
  const [bgImgName, setBgImgName] = useState('');

  // 크롭된 이미지를 저장해준다.
  const handleSeavBackgroundImg = (croppedImg) => {
    console.log("handleSeavBackgroundImg 호출");
    setCollectionInput({ ...collectionInput, img_background: croppedImg });
  };

  // 파일을 첨부한 뒤, 모달창을 띄어준다.
  const handleBackgroundImgChange = (e) => {
    console.log("handleBackgroundImgChange 호출");
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setBackgroundImg(reader.result); // 파일을 받아오면 파일의 데이터를 설정해준다.
        openBackgroundImageCrop(); // 이후 모달창을 띄어준다.
        setBgImgName(e.target.files[0].name); 
      };
    }
  };

  // 배경 이미지 파일을 삭제했을 때
  const handleOnRemoveBgImg = () => {
    console.log("handleOnRemoveBgImg 호출");
    
    setBgImgName("");
    setBackgroundImg("");
    setCollectionInput({ ...collectionInput, img_background: "" });  
  }

  // 모달 창 관련 변수
  const [modalWaitingIsOpen, setModalWaitingIsOpen] = useState(false);
  const [modalSuccessIsOpen, setModalSuccessIsOpen] = useState(false);
  const [modalLogoImage, setModalLogoImage] = useState(false);
  const [modalBackgroundImage, setModalBackgroundImage] = useState(false);

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
    const url_explorer = "http://cryptoexplorer.store/Transaction/";
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
    navigate("/creator");
  }

  function afterSuccessModal() {
  }

  // 로고 이미지 crop 모달
  function openLogoImageCrop() {
    setModalLogoImage(true);
  }

  function closeLogoImageCrop() {
    setModalLogoImage(false);
  }

  function aferLogoImageCrop() {}

  // 백그라운드 이미지 crop 모달
  function openBackgroundImageCrop() {
    setModalBackgroundImage(true);
  }

  function closeBackgroundImageCrop() {
    setModalBackgroundImage(false);
  }

  function aferBackgroundImageCrop() {}

  const handleTest = async () => {
    // openWaitingModal();
    closeWaitingModal();
    openSuccessModal("1234444444444444444444444444444444444444444444444444444444");
    // openLogoImageCrop();
    // console.log("collection 데이터", collectionInput.img_logo);
    // const url = "http://221.148.25.234:3333/UploadIPFS";
    // const data = { img: collectionInput.img_logo };

    // postJSON(url, data).then((data) => {
    //   console.log(data); // JSON 객체이다. by `data.json()` call
    // });
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
        value={"createcol"}
        readOnly
      ></input>
      <button id="transaction" ref={btnRef}></button>

      <button id="transaction_complete" className="sr-only" onClick={handleCompleteTrx}></button>
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

      <Modal
        isOpen={modalLogoImage}
        onAfterOpen={aferLogoImageCrop}
        style={imgModalStyles}
      >
        <CropImage
          title={"Crop image"}
          content={
            "이미지를 업로드하고 사이트에서 직접 크기를 조정하여 컬렉션 로고를 변경하세요."
          }
          img={logoImg}
          width={"1"}
          height={"1"}
          onClose={closeLogoImageCrop}
          onSave={handleSaveLogoImg}
        />
      </Modal>

      <Modal
        isOpen={modalBackgroundImage}
        onAfterOpen={aferBackgroundImageCrop}
        style={imgModalStyles}
      >
        <CropImage
          title={"Crop image"}
          content={
            "이미지를 업로드하고 사이트에서 직접 크기를 조정하여 컬렉션 배경을 변경하세요."
          }
          img={backgroundImg}
          width={"3.84"}
          height={"1"}
          onClose={closeBackgroundImageCrop}
          onSave={handleSeavBackgroundImg}
        />
      </Modal>

      <CreatorHeader
        title="Create New Collection"
        content="먼저 컬렉션을 만드세요. 그런 다음 자신의 컬렉션에 NFT를 생성할 수 있습니다."
      />

      {/* NFT Collection 입력 부분 */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* NFT Collection Logo 입력 부분*/}
        <CardPrimary
          css={"col-span-1 flex flex-col justify-center items-center"}
        >
          <label
            className="w-full h-full flex flex-col justify-center items-center"
            htmlFor="img_logo"
          >
            {collectionInput.img_logo === undefined ? (
              <div className="flex flex-col justify-center items-center">
                <div>
                  <AiOutlineCloudUpload className="text-orange-400" size={64} />
                </div>
                <div className="font-san mt-5">로고 이미지를 등록해주세요.</div>
                <div className="mt-2 text-xs">
                  형식: PNG, JPG, 최대 사이즈 : 7MB
                </div>
              </div>
            ) : (
              <div>
                <img
                  className="w-80 h-80 rounded-2xl hover:"
                  src={collectionInput.img_logo}
                ></img>
              </div>
            )}
          </label>
          <input
            id="img_logo"
            className="sr-only"
            type="file"
            onChange={handleLogoImgChange}
          ></input>
        </CardPrimary>

        {/* Collection Details 입력 부분*/}
        <CardPrimary
          css={"col-span-2 flex flex-col"}
          card_name={"Collection Details"}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardInput
              input_name={"Collection Name *"}
              input_explain={"1~5 & a~z, 공백 없이"}
              name={"collection_name"}
              type={"text"}
              value={collectionInput.collection_name}
              onChange={handleCollectionInputChange}
              placeholder="e.g.: cryptogames"
            />

            <CardInput
              input_name={"Display Name *"}
              name={"display_name"}
              type={"text"}
              value={collectionInput.display_name}
              onChange={handleCollectionInputChange}
              placeholder="e.g.: Crypto Game"
            />
            <CardInput
              input_name={"Website URL *"}
              name={"url"}
              type={"text"}
              value={collectionInput.url}
              onChange={handleCollectionInputChange}
              placeholder="e.g.: https://cryptoexplore.com"
            />

            <CardInput
              input_name={"Market Fee(0% ~ 6%) *"}
              name={"market_fee"}
              type={"number"}
              value={collectionInput.market_fee}
              onChange={handleCollectionInputChange}
              placeholder="e.g.: 2"
            />

            <CardInput
              input_name={"Collection Description"}
              name={"collection_description"}
              type={"text"}
              value={collectionInput.collection_description}
              onChange={handleCollectionInputChange}
              placeholder="e.g.: 컬렉션에 대한 설명을 적어주세요."
              input_explain={"(최대 3000자)"}
            />
          </div>
        </CardPrimary>

        <div className="col-span-0 lg:col-span-1"></div>

        {/* Collection Images 입력 부분*/}
        <CardPrimary
          css={"col-span-2 flex flex-col"}
          card_name={"Collection Images"}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="mx-3">
              <div className="mb-2">Background Image *</div>
              <div>
                <div className="flex items-center w-full border-solid border rounded-lg bg-body">
                  <label
                    htmlFor="img_background"
                    className="text-sm py-2 px-7 rounded-lg bg-card"
                  >
                    SELECT FILE
                  </label>

                  {collectionInput.img_background === undefined ||
                  collectionInput.img_background === "" ? null : (
                    <div className="grow flex items-center ml-2">
                      <div className="grow">{bgImgName}</div>
                      <BsTrash
                        className="mr-3"
                        size={20}
                        onClick={handleOnRemoveBgImg}
                      />
                    </div>
                  )}
                </div>

                <input
                  id="img_background"
                  className="sr-only"
                  type="file"
                  onChange={handleBackgroundImgChange}
                ></input>
              </div>
              <div className="mt-2 text-xs">
                형식: PNG, JPG, 최대 사이즈 : 7MB
              </div>
            </div>
          </div>
        </CardPrimary>

        <div className="col-span-1"></div>

        {/* Accounts 입력 부분*/}
        <CardPrimary css={"col-span-2 flex flex-col"} card_name={"Accounts"}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <CardInput
              input_name={"Authorized Accounts *"}
              name={"account_name"}
              type={"text"}
              value={collectionInput.account_name}
              onChange={handleCollectionInputChange}
              placeholder="계정이름을 적어주세요."
            />
          </div>
        </CardPrimary>

        <div className="col-span-1"></div>

        {/* 저장 버튼*/}
        <div className="col-span-2 mt-7 font-sans flex justify-end">
          <ButtonPrimary text={"등록"} onClick={handleCollectionSubmit} />
        </div>
      </div>
    </>
  );
}
