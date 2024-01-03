import {
    useNavigate 
  } from "react-router-dom";

import Header from "../component/header";
import Footer from "../component/footer";

import { AiOutlinePlusCircle } from 'react-icons/ai';

export default function Creator() {

    const navigate = useNavigate();
    
    const handleClickCreateCollection = () => {
        navigate("/creator/create-collection");
    }

    return (
        <>
            <Header />
                <div className="bg-gray-800 text-white flex justify-center">
                    <div className="container">
                        <div className="flex flex-wrap mt-10">

                            <div className="grow">
                                <div className="py-2 text-xl font-bold">My Collection</div>
                                <div className="py-2">All NFTs live within collections. These are groups of NFTs that are part of the same project, or made by the same author.</div>
                            </div>
                            <div>
                                <div className="flex py-2">
                                    <div>
                                        <span className="pl-1">RAM : </span>
                                        <span className="pl-1">6.79 KB / 36.3KB</span>
                                    </div>
                                    <div>
                                        <button className="ml-7 p-1">구매하기</button>                                        
                                    </div>
                                    
                                </div>
                                <div className="w-full py-2">
                                    게이지 표시
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
                            <div onClick={handleClickCreateCollection} className="bg-gray-700 rounded-2xl flex flex-col items-center justify-center h-64">
                                <div>
                                    <AiOutlinePlusCircle size={100}/>
                                </div>
                                <div className="mt-5">
                                    NFT Collection 만들기
                                </div>
                            </div>
                            <div className="">
                                테스트 1
                            </div>
                            <div className="">
                                테스트 2
                            </div>

                        </div>
                    </div>
                </div>
            <Footer />
        </>
    )    
}