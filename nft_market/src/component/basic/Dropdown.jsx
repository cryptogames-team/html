import React from "react";

export default function Dropdown({css, children, onMouseOver, onMouseOut}) {
  return (
    <>
      <div className={`${css} mt-5 absolute bg-white text-black rounded-xl p-5`} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        {children}
      </div>
    </>
  );
}
