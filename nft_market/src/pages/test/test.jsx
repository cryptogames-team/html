import { useState, useCallback } from "react";
import Modal from "react-modal";

export default function TestPage() {
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
      width: "20%",
      height: "100%",
      zIndex: "150",
      top : "0%",
      bottom : "0%",
      right : "0%",
      left : "80%",
      borderRadius: "10px",
      borderColor: "rgb(0,0,0)",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      color: "white",
      backgroundColor: "#1A203C",
      justifyContent: "center",
      overflow: "auto",
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  

 return (
  <>
    <Modal
      isOpen={isOpen}
      style={customModalStyles}
      closeTimeoutMS={1000}
    >
      <button onClick={togglePopup}>모달창 닫기</button>
      <div>
        테스트
      </div>      
      
    </Modal>
    <button onClick={togglePopup}>모달 테스트</button>
    <div>
      ddsssssssssssssssssssssssss
    </div>
    <div>
      ㅇㅇ
    </div>

  </>
 );
}
