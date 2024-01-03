import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

export default function CreatorHeader({ title, content }) {
  return (
    <>
      <div className="flex sm:flex-row flex-col mt-10">
        <div className="grow">
          <div className="text-2xl font-bold">
            {title}
          </div>
          <div className="py-2">
            {content}

          </div>
        </div>
        <div className="sm:mt-0 my-5">
          <div className="flex py-2">
            <div className="grow">
              <span className="font-bold pl-1">RAM : </span>
              <span className="pl-1">6.79 KB / 36.3KB</span>
            </div>
            <div className="flex text-orange-400 font-bold pl-5">
              <div>Buy More</div>
              <AiOutlinePlusCircle size={25} className="ml-1 h-full" />
            </div>
          </div>
          <div className="w-full text-black border rounded-2xl border-orange-400">
            <div className="font-bold flex justify-center w-3/12 border rounded-2xl border-orange-400 bg-orange-400">
              25%
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
