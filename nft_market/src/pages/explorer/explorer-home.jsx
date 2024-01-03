import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ExplorerHome() {
  const navigate = useNavigate();

  const handleClickCreateCollection = () => {
    navigate("/explorer/collection/test3");
  };

  const handleClickTemplate = () => {
    navigate("/explorer/template/test3/1");
  };

  return (
    <>
      <div>익스플로러 홈화면</div>
      <button onClick={handleClickCreateCollection}>콜렉션 이동</button>
      <button onClick={handleClickTemplate}>템플릿 이동</button>
    </>
  );
}
