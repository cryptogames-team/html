import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { CiGrid41 } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { BsHandbag } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

import { useEffect, useState } from "react";
import ButtonPrimary from "./basic/btn-primary";
import Dropdown from "./basic/Dropdown";
import { postJSON } from "../js/postJson";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";



export default function Header() {


  // 로그인 관련 로직
  const [isLogin, setIsLogin] = useState(false);
  const ex_userInfo = {
    accountName : "계정 이름",
    publicKey : "공개키",
    balance : "잔액"
  }
  const [userInfo, setUserInfo] = useState(ex_userInfo);
  

  // 지갑을 통해 계정 정보 가져온 이후 실행되는 함수
  const handleLoginComplete = () => {
    console.log("handleLoginComplete 호출");

    const userNameInput = document.getElementById('UserName'); // 계정 이름
    const userKeyInput = document.getElementById('UserKey'); // 공개 키

    // Check if the element exists and get its value
    if (userNameInput && userKeyInput) {

      const nameValue = userNameInput.value;
      const keyValue = userKeyInput.value;

      console.log(`계정 이름 : ${nameValue}, 공개 키 : ${keyValue}`);
      const url = "http://221.148.25.234:3333/Login";
      const data = { accountName: nameValue};

      postJSON(url, data).then((data) => {
        console.log(data); // JSON 객체이다. by `data.json()` call
        setUserInfo(prev => ({...prev, accountName : nameValue, publicKey : keyValue}))
        setIsLogin(true);  
      });
    }    
  }

  useEffect(() => {

    const url = "http://221.148.25.234:3333/isLogin";
    const data = {};

    postJSON(url, data).then((data) => {
      console.log(data); // JSON 객체이다. by `data.json()` call
      const {result, accountName} = data;
      if(result === true) {
        setUserInfo(prev => ({...prev, accountName : accountName}))
        setIsLogin(true);  
      }
    });  
  }, []);

  

  // 메뉴바 관련 로직
  const [isDropBtnMouseOver, setIsDropBtnMouseOver] = useState(false);
  const [isDropDownMouseOver, setIsDropDownMouseOver] = useState(false);


  const handleDropBtnMouseOver = () => {
    setIsDropBtnMouseOver(true);  
  }
  const handleDropBtnMouseOut = () => {
    setTimeout(() => {
      setIsDropBtnMouseOver(false);  
    }, 700)
  }
  const handleDropDownMouseOver = () => {
    setIsDropDownMouseOver(true);  
  }
  const handleDropDownMouseOut = () => {
    setIsDropDownMouseOver(false);  
  }

  const handle = () => {
    console.log("handle 호출");

    const url = "http://221.148.25.234:3101/isLogin";
    const data = {};

    postJSON(url, data).then((data) => {
      console.log("테스트 로그",data); // JSON 객체이다. by `data.json()` call      
    });  
  
  }


   // 메뉴바 누를 시 나타나는 모달 관련 로직
   const [isOpen, setIsOpen] = useState(false); 
  

  return (
    <>
      <header className="border-b-2 border-gray-700 flex justify-center p-4 w-full h-24">
        <div className="flex container items-center">
          <Link to={"/"} className="md:grow-0 grow text-2xl font-bold">
            NFT 거래소
          </Link>

          <nav className="mx-6 md:flex hidden items-center justify-start space-x-4">
            <Link to={"explorer"}>Explorer</Link>
            <Link to={"market"}>Market</Link>
            <Link to={"trading"}>Trading</Link>
            <Link to={"creator"}>NFT Creator</Link>
          </nav>

          <div className="md:flex hidden grow border rounded-xl w-2/5 p-2 mx-3">
            <AiOutlineSearch size={25} />
          </div>

          <AiOutlineSearch size={25} className="md:hidden mx-3" />

          <AiOutlineShoppingCart size={25} className="mx-3" />

          {/* <button onClick={handle}>테스트 버튼</button> */}

          {isLogin === true ? (
            <>
              <div className=" relative">
                <div className="flex items-center">
                  <div className="md:flex hidden flex-col mx-3">
                    <div className="font-bold text-sm">
                      {userInfo.accountName}
                    </div>
                    <div className="text-xs text-lime-400">
                      {userInfo.balance}
                    </div>
                  </div>
                  <AiOutlineMenu
                    size={25}
                    className="ml-3"
                    onMouseOver={handleDropBtnMouseOver}
                    onMouseOut={handleDropBtnMouseOut}
                  />
                </div>

                {isDropBtnMouseOver || isDropDownMouseOver ? (
                  <Dropdown
                    onMouseOver={handleDropDownMouseOver}
                    onMouseOut={handleDropDownMouseOut}
                    css={"mr-10 flex flex-col w-56 -translate-x-32"}
                  >
                    <div className="flex my-3">
                      <CgProfile size={27} />
                      <Link to={""} className="mx-3 font-bold">
                        Profile
                      </Link>
                    </div>
                    <div className="flex my-3">
                      <AiOutlineSetting size={27} />
                      <Link to={""} className="mx-3 font-bold">
                        Setting
                      </Link>
                    </div>
                    <div className="flex items-center my-3">
                      <BiLogOut size={27} />
                      <button className="mx-3 font-bold">Logout</button>
                    </div>
                  </Dropdown>
                ) : null}
              </div>
            </>
          ) : (
            <button id="login">Login</button>
          )}

          <button onClick={() => setIsOpen(prev => !prev)}>
            <AiOutlineMenu size={25} className="ml-3" />
          </button>
        </div>
      </header>

      <MenuModal isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <input type="hidden" id="UserName" value="undefined"></input>
      <input type="hidden" id="UserKey" value="undefined"></input>
      <button id="login_complete" onClick={handleLoginComplete}></button>
    </>
  );
}


function MenuModal({isOpen, setIsOpen}) {

  const navigate = useNavigate();


   const togglePopup = () => {
     setIsOpen(prev => !prev);
   };
 
   const menuModalStyles = {
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
       width: "25%",
       height: "100%",
       zIndex: "150",
       top : "0%",
       bottom : "0%",
       right : "0%",
       left : "75%",
       borderRadius: "10px",
       borderColor: "rgb(0,0,0)",
       boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
       color: "white",
       backgroundColor: "#1A203C",
       justifyContent: "center",
       overflow: "auto",
     },
   };

   const handlePageMove = (page) => {
     console.log("handle 호출");
     navigate(`/${page}`)   
     setIsOpen(prev => !prev);
   }

  return (
    <>
      <Modal isOpen={isOpen} style={menuModalStyles} closeTimeoutMS={1000}>
        <div className="h-full flex flex-col">
          <GiCancel className="self-end" size={25} onClick={togglePopup} />
          <div className="my-3 flex">
            <img
              className="rounded-full"
              width={"70px"}
              src="https://atomichub-ipfs.com/ipfs/QmZNtS2AkpwqF4vfG4wr7JK4jVEsNKWyAcn63iWJ2tnap6"
            ></img>
            <div className="ml-3 flex flex-col">
              <div className="flex-grow font-bold text-lg">test3</div>
              <div className="flex-grow font-bold text-slate-500">
                내 프로필 확인하기
              </div>
            </div>
          </div>

          <div className="my-5 flex flex-col py-4 px-4 bg-slate-700 rounded-xl">
            <div className="text-slate-500 font-bold">보유 잔액</div>
            <div className=" text-lime-400 font-bold text-2xl">15 Hep</div>
          </div>

          <div className="grow mt-7">
            <div className="flex items-center">
              <CiGrid41 className="text-white" size={35} />

              <div
                className="flex flex-col ml-3"
                onClick={() => handlePageMove("profile")}
              >
                <div className="text-xl font-bold">Inventory</div>
                <div className="text-slate-500 text-sm">
                  수집한 NFT를 볼 수 있고 관리할 수 있습니다.
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center">
              <BsHandbag className="text-white" size={35} />
              <div className="flex flex-col ml-3">
                <div className="text-xl font-bold">My Market</div>
                <div className="text-slate-500 text-sm">
                  마켓에 올린 NFT들의 리스트를 볼 수 있습니다.
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center">
              <AiOutlineSetting className="text-white" size={35} />
              <div className="flex flex-col ml-3">
                <div className="text-xl font-bold">계정 설정</div>
                <div className="text-slate-500 text-sm">
                  계정을 관리할 수 있습니다.
                </div>
              </div>
            </div>
          </div>

          <div className="self-end flex items-center p-2">
            <FiLogOut size={35} />
            <div className="ml-3 text-xl font-bold">Logout</div>
          </div>
        </div>
      </Modal>
    </>
  );
}
