import React, { useState } from 'react'
import { useLoaderData, useNavigate } from "react-router-dom";
import ButtonPrimary from '../../component/basic/btn-primary';
import Modal from "react-modal";
import { GiCancel } from "react-icons/gi";

export default function ExplorerNFT() {
  const nft_info = useLoaderData(); // nft의 정보를 가져온다.
  console.log(`nft_info : `, nft_info);


  const [modalListingIsOpen, setModalListingIsOpen] = useState(false);
  const handleMarketModalOpen = () => {
    console.log("handleMarketModalOpen 호출");
    setModalListingIsOpen(true);  
  }

  const handleMarketModalClose = () => {
    console.log("handleMarketModalClose 호출");
    setModalListingIsOpen(false);    
  }

  
  return (
    <>
      <NFTMarketModal nft_info={nft_info} modalIsOpen={modalListingIsOpen} modalClose={handleMarketModalClose} />

      <div className="mt-7 text-xs font-bold">
        {`Explorer > ${nft_info.collection_name} > ${nft_info.nft_name}`}
      </div>

      <div className="mt-5 text-2xl font-bold">
        <span>NFT : </span>
        <span className="text-orange-400">{`${nft_info.nft_name},`}</span>
      </div>

      <NFTInfo nft_info={nft_info} marketModalBtn={handleMarketModalOpen} />
      <NFTAttritute nft_info={nft_info} />
      
    </>
  );
}

function NFTInfo({nft_info, marketModalBtn}) {
  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 bg-card rounded-xl p-5">
          <img className="mt-10" src={nft_info.nft_img}></img>
        </div>
        <div className="col-span-3 bg-card rounded-xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="col-span-2 font-bold text-2xl">
            <div>{nft_info.nft_name}</div>
          </div>

          <div className="font-bold">
            <div className="text-slate-500">템플릿 ID</div>
            <div className="p-1">{`# ${nft_info.asset_id}`}</div>
          </div>
          <div className="font-bold">
            <div className="text-slate-500">콜렉션</div>
            <div className="p-1 ">{`${nft_info.collection_name}`}</div>
          </div>
          <div className="font-bold">
            <div className="text-slate-500">카테고리</div>
            <div className="p-1 text-orange-400">{`${nft_info.schema_name}`}</div>
          </div>
          <div className="font-bold">
            <div className="text-slate-500">템플릿</div>
            <div className="p-1 text-orange-400">{`# ${nft_info.template_id}`}</div>
          </div>

          <div className="col-span-2 bg-mint p-5 rounded-xl grid grid-cols-1 lg:grid-cols-2">
            <div>
              <div className="text-slate-500">최저 제안 가격</div>
              <div className="text-lime-500 font-bold p-1">-</div>
            </div>
            <ButtonPrimary
              text={"마켓 등록"}
              css={"justify-self-end self-center"}
              onClick={marketModalBtn}
            />
          </div>          
        </div>
      </div>
  )  
}

function NFTAttritute({ nft_info }) {
  return (
    <div className="mt-5 bg-card rounded-xl p-5">
      <div className="font-bold">NFT Attributes</div>
      <table className="w-full mt-7 table-auto border-2 border-slate-500 rounded-lg border-collapse">
        <tbody>
          {nft_info.immutable_serialized_data.map((item) => {
            return (
              <tr>
                <td className="p-4 border border-slate-500 font-bold">
                  {item.key}
                </td>
                <td className="p-4 border border-slate-500 font-bold">
                  {item.value[1]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NFTMarketModal({nft_info, modalIsOpen, modalClose}) {
  const customModalStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "650px",
      height: "750px",
      zIndex: "150",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -55%)",
      borderRadius: "10px",
      borderColor: "rgb(0,0,0)",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      color: "white",
      backgroundColor: "#1A203C",
      justifyContent: "center",
      overflow: "auto",
    },
  };
  const navigate = useNavigate();

  const handleGoMarket = () => {
    console.log("handleGoMarket 호출");
    navigate(`/market`);      
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} style={customModalStyles}>
        <div className="flex flex-col items-center">
          <GiCancel size={25} className="self-end" onClick={modalClose} />
          <div className="font-bold text-2xl">마켓에 NFT 등록하기</div>
          <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 w-full gap-7">
            <div className="lg:col-span-4">
              <NFTComponent item={nft_info} />
            </div>
            <div className="lg:col-span-8">
              <div className="lg:col-span-4 p-2 rounded-2xl flex border border-slate-400">
                <button className="flex-grow bg-orange-400 p-1 rounded-2xl">
                  Listing
                </button>
                <button className="mx-2 flex-grow p-1 rounded-2xl">
                  Auctions
                </button>
              </div>

              <ListingPrice />
              <div className="mt-4 bg-body rounded-lg p-3">
                <div className="font-bold text-lg">
                  <span>수수료 :</span>
                  <span className="ml-3  text-orange-400">4.00%</span>
                </div>

                <div className="mt-4 flex p-1 items-center">
                  <table className="w-full table-auto border-2 border-slate-500 rounded-lg border-collapse">
                    <tbody>
                      <tr>
                        <td className="p-4 border border-slate-500 font-bold text-orange-400">
                          2.00%
                        </td>
                        <td className="p-4 border border-slate-500">
                          <div className="font-bold text-sm">
                            NFT 거래소 수수료
                          </div>
                          <div className="mt-2 text-xs">
                            NFT 거래소의 유지 및 개선을 위한 요금입니다.
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 border border-slate-500 font-bold text-orange-400">
                          2.00%
                        </td>
                        <td className="p-4 border border-slate-500">
                          <div className="font-bold text-sm">
                            로열티 수수료
                          </div>
                          <div className="mt-2 text-xs">
                            거래시, NFT 창작자가 받는 로열티 수수료 입니다.
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <ButtonPrimary text={"등록하기"} css={"mt-6 w-full"} onClick={handleGoMarket} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );  
}

function NFTComponent({ item}) {
  return (
    <div
      key={item.asset_id}
      className="bg-card flex flex-col items-start rounded-xl p-5 shadow-2xl"
    >
      <img src={item.nft_img} alt=""></img>
      <div className="mt-2 text-sm font-bold">{item.collection_name}</div>
      <div className="mt-2 text-orange-400 font-bold">{item.nft_name}</div>
    </div>
  );
}

function ListingPrice({ params }) {
  return (
    <div className="mt-4 bg-body rounded-lg p-3">
      <div className="font-bold text-lg">가격 제시</div>

      <div className="mt-4 flex p-1 items-center">
        <div className="font-bold">판매가</div>
        <div className="ml-4 flex-grow border border-slate-400 rounded-md">
          <input
            className="bg-inherit w-full p-2"
            type="num"
            placeholder="단위 : Hep"
          ></input>
        </div>
      </div>
      <div className="mt-4 flex p-1 items-center">
        <div className="font-bold">순수익</div>
        <div className="ml-4 flex-grow border border-slate-400 rounded-md">
          <input
            className="bg-inherit w-full p-2"
            type="num"
            placeholder="단위 : Hep"
          ></input>
        </div>
      </div>
    </div>
  );
}