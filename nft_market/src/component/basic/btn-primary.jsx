import React from 'react'
  
export default function ButtonPrimary({text, onClick, css, id}) {
  return (
    <>
      <button
        id = {`${id === undefined ? '' : id}`}
        className={`${css} w-44 h-11 text-bold rounded-3xl bg-orange-400`}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
  
}