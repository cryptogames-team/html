import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../component/header';
import Footer from '../component/footer';
import { postJSON } from '../js/postJson';
  
export default function Root() {

  
  return (
    <>
      <div className="flex flex-col items-center">
        <Header />
        <div className="container mb-10 sm:px-0 px-3">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
  
}