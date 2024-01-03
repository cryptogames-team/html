import React from "react";

export default function ItemCategory({schema_name, collection_name, att_count, onClick}) {

  return (
    <>
      <div className="border-2 border-orange-400 rounded-2xl flex flex-col justify-center items-center w-full h-24" onClick={onClick}>
        <div className="mt-1 font-bold text-sm text-orange-500">{schema_name}</div>
        <div className="mt-1 font-bold text-xs">{collection_name}</div>
        <div className="mt-1 text-xs">{att_count} Attributes</div>
      </div>
    </>
  );
}
