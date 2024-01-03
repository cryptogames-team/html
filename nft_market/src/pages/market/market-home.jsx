import React, { useEffect, useState } from 'react'
import {
  AiOutlineSearch,
  AiOutlineShoppingCart
} from "react-icons/ai";
import {
  TbTilde
} from "react-icons/tb";
import {
  VscRefresh
} from "react-icons/vsc";
  
export default function MarketHome() {

  const [saleItems, setSaleItems] = useState([]);
  useEffect(() => {

    const test_item_data = [
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmQTHBEA6gYsemkcMNxnBkvNx49Jfk5kKvVhrgMEPKQmDn",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 1
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmR6W9mzkPAU3jg7hAVJYhFX8b3xe5S3csi44f9zut7R7D",
        collection_name: "test_collection",
        nft_name : "test_nft2",
        nft_price : 200
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmexuD6bZqG3XCpXjbMNvuX3hdtGAjDZkrgPmaUZSFJY1h",
        collection_name: "test_collection",
        nft_name : "test_nft3",
        nft_price : 340
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmSfrvAWNVLkwRHKkeg546ZTCKvzW4C9ueQNsMzEUzm8px",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 410
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmRPGR27s1L5VcBxV6LM3ZrYAZNBsLsoDPFhGvbNC5ao82",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 511
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmaEA3XknGi6z8dQN1zGCMY8VN1BrUTrvtpGvHe5rPQ9co",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 681
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmR99ZfKz9SeSbZ9xBePK4xSkj7Ftp7Ei3HNHRjUBr75Z7",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 1792
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmQ3Mr25iS6rL1n79qr927xY4MeTcPkcCXAVCrgfASetDb",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 71
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmXyveZRJgJ7KeKtwMH6j7xg7FZAXXM4ESKT6p8XNDmdiN",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 5
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmV66vbDcai58KpeAdCjmr56eJFBqP6SZTFRW5DiWcUawx",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 7
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmNV6xK1NgWjaVzFRenRSbgAAvk3xo7X3V1EN3MU7bVL5J",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 87
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmX31i5aK7RSSxHR311oyhjzMVMdE6J8cXvsGrYGATh86D",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 46
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmST3A7CTGGkz7f8AEUP5Jm7RMmNC1wZY7X6FYhxeQXVKa",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 49
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmbQfbVY8NnvN3JEoRGa9s5ndzB6vZUhUFy25LJUCWXb1A",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 68
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmQdKcTPJZmi5f3AiXx8vYxyfctvHZ85ZQFqHrmUjQxb2z",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 71
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmX31i5aK7RSSxHR311oyhjzMVMdE6J8cXvsGrYGATh86D",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 19
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmXyveZRJgJ7KeKtwMH6j7xg7FZAXXM4ESKT6p8XNDmdiN",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 21
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmR99ZfKz9SeSbZ9xBePK4xSkj7Ftp7Ei3HNHRjUBr75Z7",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 140
      },
      {
        sales_id : 1,
        nft_img : "https://ipfs.io/ipfs/"+"QmRPGR27s1L5VcBxV6LM3ZrYAZNBsLsoDPFhGvbNC5ao82",
        collection_name: "test_collection",
        nft_name : "test_nft",
        nft_price : 87
      },
    ]
    setSaleItems(test_item_data);
  
  }, []);


  return (
    <>
      <div className="flex">
        <div className="w-96 h-fit bg-card p-5 hidden lg:flex lg:flex-col rounded-xl">
          <div className="text-xl font-bold">Filter by</div>
          <SearchCollectionFilter />
          <PriceFilter />
        </div>

        <div className="w-full p-5">
          <MainFilters />
          <div className='mt-7'>
            <div className='font-bold text-xl'>Listings</div>
            
            <div className='mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4'>
              {
                saleItems.map(item => {
                  return <MarketItemComponent item={item} />
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}

/*
좌측 필터 관련 컴포넌트
*/

// 20개 정도 보여주고, Load More을 눌렀을 때 데이터를 추가적으로 가져오도록 한다.
function SearchCollectionFilter() {

  const [searchedCollections, setSearchedCollections] = useState([]);

  useEffect(() => {

    const test_datas =[
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
      {
        collection_img : "https://ipfs.io/ipfs/"+"QmVeQW8tSyzHpDiygRJ54rj5kEGAEfNyRQvkbkwAZ4gjqq",
        collection_name : "cryptoguynft",
        collection_display_name : "crypto guys의 nft 모음"
      },
    ]

    setSearchedCollections(test_datas)  
  }, []);


  return (
    <div className="mt-10">
      <div className="text-xs font-bold">Collections</div>
      <div className="mt-2 text-sm">
        <div className="flex border border-slate-400 items-center p-2 rounded-md">
          <AiOutlineSearch size={20} />
          <input
            className="ml-2 bg-inherit w-full focus:outline-none"
            placeholder="Search Collections..."
          ></input>
        </div>
      </div>

      <div className='mt-4 bg-body p-2 rounded-md overflow-auto max-h-96 '>
        {
          searchedCollections.map(item => {
            return <SearchedCollectionItem collection_info={item} />
          })
        }
        <div className='mx-4 mt-4 flex justify-center border-2 rounded-xl p-2'>
          <VscRefresh size={25} />
          <div className='ml-2 font-bold'>Load More</div>
        </div>        
      </div>
    </div>
  );
}

// 검색된 콜렉션 리스트의 아이템들
function SearchedCollectionItem({ collection_info }) {
  return (
    <div className="flex p-2 my-1">
      <img
        src={collection_info.collection_img}
        className=" rounded-full"
        width={40}
      ></img>
      <div className="ml-3 flex flex-col text-xs justify-center">
        <div className="font-bold">{collection_info.collection_name}</div>
        <div className="mt-1 text-slate-500">{collection_info.collection_display_name}</div>
      </div>
    </div>
  );
}

// 가격 관련 컴포넌트
function PriceFilter() {
  return (
    <div className="mt-10">
      <div className="text-xs font-bold">Price</div>
      <div className="mt-2 flex items-center text-xs">
        <div className="flex border border-slate-400 items-center p-2 rounded-md">
          <input
            className="bg-inherit w-full focus:outline-none"
            type="num"
            placeholder="Min price"
          ></input>
          <div className="ml-2">Hep</div>
        </div>
        <TbTilde size={35} className="mx-2" />
        <div className="flex border border-slate-400 items-center p-2 rounded-md">
          <input
            className="bg-inherit w-full focus:outline-none"
            type="num"
            placeholder="Max price"
          ></input>
          <div className="ml-2">Hep</div>
        </div>
      </div>
    </div>
  );
}


/*
우측 메인화면
*/

// 메인화면의 필터들
function MainFilters() {
  return (
    <>
      <div className="text-2xl font-bold">Hep Market</div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4 p-2 rounded-2xl flex border border-slate-400">
          <button className="flex-grow bg-orange-400 p-1 rounded-2xl">
            Listing
          </button>
          <button className="mx-2 flex-grow p-1 rounded-2xl">Auctions</button>
          <button className="flex-grow p-1 rounded-2xl">History</button>
        </div>
        <div className="lg:col-span-6 flex flex-grow border border-slate-400 items-center p-2 rounded-2xl">
          <AiOutlineSearch size={20} />
          <input
            className="ml-2 bg-inherit w-full focus:outline-none"
            placeholder="Search for NFT or Templates..."
          ></input>
        </div>

        <select
          className="lg:col-span-2 bg-inherit text-center border border-slate-400 rounded-2xl p-2"
          name="type"
        >
          <option className="bg-card" name="type" value="string">
            최신순
          </option>
          <option className="bg-card" name="type" value="string">
            오래된 순
          </option>
          <option className="bg-card" name="type" value="integer">
            알파벳순(A-Z)
          </option>
          <option className="bg-card" name="type" value="bool">
            알파벳 역순(A-Z)
          </option>
        </select>
      </div>
    </>
  );
}

// 마켓에 올라온 아이템의 컴포넌트
function MarketItemComponent({item}) {
  return (
    <>
      <div
        key={item.sales_id}
        className="bg-card flex flex-col items-start rounded-xl col-span-2 lg:col-span-1 overflow-hidden"
      >
        <div className="px-5">
          <img className="mt-4" src={item.nft_img} alt=""></img>
          <div className="mt-2 text-sm font-bold">{item.collection_name}</div>
          <div className="mt-2 text-orange-400 font-bold">{item.nft_name}</div>
          <div className="mt-2 text-lime-400 font-bold">
            {item.nft_price} Hep
          </div>
        </div>
        <div className="mt-2 flex w-full">
          <button className="flex-grow bg-slate-700 p-2">구매하기</button>
          <button className="bg-slate-700 ml-1 p-2">
            <AiOutlineShoppingCart />
          </button>
        </div>
      </div>
    </>
  );
}
