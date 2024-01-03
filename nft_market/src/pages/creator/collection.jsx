

import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useState } from "react";

export default function CreateCollection() {
    const [collectionName, setCollectionName] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [url, setUrl] = useState(null);
    const [marketFee, setMarketFee] = useState(null);
    const [collectionDescription, setcollectionDescription] = useState(null);

    const handleCollectionName = () => {

    }


    return (
        <>
  
            <div className="bg-gray-800 text-white flex justify-center">
                <div className="container">

                    {/* NFT 생성 관련 헤더 */}
                    <div className="flex flex-wrap mt-10">
                        <div className="grow">
                            <div className="py-2 font-sans text-xl font-bold">Collection : <span>콜렉션 이름</span></div>
                            <div className="font-sans py-2">Collection에 관련된 모든 것을 관리할 수 있습니다.</div>
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

                    {/* NFT Collection 입력 부분 */}
                    <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* NFT Collection Logo 입력 부분*/}
                        <div className="col-span-1 bg-gray-700 rounded-2xl border-gray-400 flex flex-col justify-center items-center">
                            <div>
                                <AiOutlineCloudUpload size={64}/>
                            </div>
                            <div className="font-san mt-5">
                                Upload Collection Logo
                            </div>
                        </div>

                        {/* Collection Details 입력 부분*/}
                        <div className="col-span-2 font-sans bg-gray-700 rounded-2xl flex flex-col">
                            <div className="p-10">
                                <div className="text-xl mb-7">
                                    Collection Details
                                </div>

                                <div className="flex">
                                    <div className="mx-3 flex-1">
                                        <div className="mb-2">
                                            Collection Name *
                                        </div>
                                        <input className="w-full p-2 border-solid border rounded-lg bg-gray-700" placeholder="e.g.: cryptogames"></input>
                                        <div className="mt-2 text-xs">
                                            12 Characters, 1~5 & a~z with no spaces.
                                        </div>
                                    </div>

                                    <div className="mx-3 flex-1">
                                        <div className="mb-2">
                                            Display Name *
                                        </div>
                                        <input className="w-full p-2 border-solid border rounded-lg bg-gray-700" placeholder="e.g.: Crypto Game"></input>
                                    </div>
                                </div>

                                <div className="mt-6 flex">
                                    <div className="mx-3 flex-1">
                                        <div className="mb-2">
                                            Website URL *
                                        </div>
                                        <input className="w-full p-2 border-solid border rounded-lg bg-gray-700" placeholder="e.g.: https://cryptoexplore.com"></input>
                                    </div>

                                    <div className="mx-3 flex-1">
                                        <div className="mb-2">
                                            Market Fee(0% ~ 6%) *
                                        </div>
                                        <input className="w-full p-2 border-solid border rounded-lg bg-gray-700" placeholder="e.g.: 2"></input>
                                    </div>
                                </div>

                                <div className="mt-6 flex">
                                    <div className="mx-3 flex-1">
                                        <div className="mb-2">
                                            Collection Description
                                        </div>
                                        <input className="w-full p-2 border-solid border rounded-lg bg-gray-700" placeholder="e.g.: Type Someting to describe your collection"></input>
                                        <div className="mt-2 text-xs">
                                            (Maximum 3000 characters)
                                        </div>
                                    </div>
                                </div>

                            
                            </div>
                        </div>
                    </div>

                    <div>
                        탭 메뉴
                    </div>

                </div>
            </div>
        </>
    )    
}