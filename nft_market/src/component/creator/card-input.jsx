import React, { useState, useContext, useEffect } from "react";

export default function CardInput({
  css,
  input_name,
  input_explain,
  type,
  name,
  value,
  onChange,
  placeholder,
  isReadOnly = false
}) {
  const [inputData, setInputData] = useState("");
  return (
    <>
      <div className={`${css} text-sm mx-3 `}>
        <div className="mb-2">{input_name}</div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 border-solid border rounded-lg card-input-primary"
          readOnly={isReadOnly}
        ></input>
        {input_explain ? (
          <div className="mt-2 text-xs">{input_explain}</div>
        ) : null}
      </div>
    </>
  );
}
