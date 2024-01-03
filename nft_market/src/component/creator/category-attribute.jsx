import React, { useState, useContext, useEffect } from "react";

export default function CategoryAttribute({ css, text, children }) {
  return (
    <>
      <div className={`${css} rounded-2xl flex justify-center items-center text-xl shadow-2xl`}>
        <div>
          {text}
        </div>
        {children}       
      </div>
    </>
  );
}
