import React from "react";
import { Link } from "react-router-dom";

export default function ItemCollection({img_logo, img_background, collection_name, display_name}) {
  const handleManageCollection = () => {
    console.log("handleManageCollection 호출");
  };

  return (
    <>
      <div
        className="border-2 border-orange-400 rounded-2xl flex flex-col overflow-hidden h-64"
        onClick={handleManageCollection}
      >
        <div className="grow relative overflow-hidden">
          <img src={img_background} className="h-full w-full object-cover"></img>
          <div className="absolute inset-x-0 bottom-0 flex items-center p-3 bg-gray-400 m-5 rounded-lg opacity-75 overflow-hidden">
            <img
              className="h-10 rounded-full opacity-100"
              src={img_logo}
            ></img>
            <div className="ml-5">
              <div className="font-bold text-sm">{collection_name}</div>
              <div className="text-xs">{display_name}</div>
            </div>
          </div>
        </div>
        <Link to={`/creator/collection/${collection_name}`} className="text-center bg-gray-700 py-2">Collection 관리</Link>
      </div>
    </>
  );
}
