import React, { useState } from "react";

export default function TemplateAttAdd({ css, key_name, valueType,onChangeValue }) {
  const [typeValue, setTypeValue] = useState("");
  const handleChangeType = (e) => {
    console.log(`handleChangeType 호출 : ${e.target.name}, ${e.target.placeholder}, ${e.target.value}`);
    setTypeValue(e.target.value)
    onChangeValue(e.target.name, e.target.placeholder,e.target.value);
  };

  return (
    <>
      <div className={`${css} w-full flex`}>
        <div className="w-2/12 flex flex-col">
          <div className="text-sm">Title</div>
          <div className="mt-2">
            <input
              type="text"
              className="w-full p-2 border-solid border rounded-lg bg-body"
              placeholder={key_name}
              readOnly
            ></input>
          </div>
        </div>

        <div className="ml-8 w-8/12 flex flex-col">
          <div className="text-sm">Value</div>
          <div className="mt-2">
            <input
              type="text"
              className="w-full p-2 border-solid border rounded-lg bg-body"
              placeholder={valueType}
              name={key_name}
              value={typeValue}
              onChange={handleChangeType}
            ></input>
          </div>
        </div>

        <div className="ml-8 w-1/12 flex justify-center items-center mt-4">
          <label>
            <input className="form-checkbox" type="checkbox"></input>
            <span className="ml-3">Set field</span>
          </label>
        </div>
      </div>
    </>
  );
}
