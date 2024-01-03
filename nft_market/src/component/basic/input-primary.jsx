import React from 'react'
  
export default function InputPrimary({type, value, onChange, placeholder}) {
  return (
    <>
      <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border-solid border rounded-lg card-input-primary"
      >
      </input>
    </>
  );
  
}