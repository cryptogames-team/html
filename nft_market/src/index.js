import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from './pages/Root';
import Home from './pages/Home';
import ErrorPage from './pages/error-page';
import TestPage from "./pages/test/test";

import CreatorIndex from './pages/creator/creator-index';
import CreatorHome from './pages/creator/creator-home';
import CreateCollection from './pages/creator/create-collection';
import CreateCategory from './pages/creator/create-category';
import CreateTemplate from './pages/creator/create-template';
import ExplorerIndex from './pages/explorer/explorer-index';
import ExplorerHome from './pages/explorer/explorer-home';
import ExplorerCollection from './pages/explorer/explorer-collection';

import {
  explorerCollectionLoader,
  explorerTemplateLoader,
  explorerNFTLoader,
} from './js/explorer-router';
import {
  creatorCollectionLoader
} from './js/creator-router';


import ExplorerTemplate from './pages/explorer/explorer-template';
import TradingIndex from './pages/trading/trading-index';
import TradingHome from './pages/trading/trading-home';
import ManageCollection from './pages/creator/manage-collection';
import MarketIndex from './pages/market/market-index';
import MarketHome from './pages/market/market-home';
import ExplorerNFT from './pages/explorer/explorer-nft';
import ProfileIndex from './pages/profile/profile-index';
import ProfileHome from './pages/profile/profile-home';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "creator",
        element: <CreatorIndex />,
        children: [
          { index: true, element: <CreatorHome /> },
          { path: "create-collection", element: <CreateCollection /> },
          { path: "create-category", element: <CreateCategory /> },
          { path: "create-template", element: <CreateTemplate /> },
          { path: "collection/:collectionId", element: <ManageCollection />, loader : creatorCollectionLoader },
        ],
      },
      {
        path: "market",
        element: <MarketIndex />,
        children: [
          { index: true, element: <MarketHome /> },
          // { path: "collection/:collectionId", element: <ExplorerCollection />, loader : explorerCollectionLoader,},
          // { path: "template/:collectionId/:templateId", element: <ExplorerTemplate />, loader : explorerTemplateLoader,},
        ],
      },
      {
        path: "explorer",
        element: <ExplorerIndex />,
        children: [
          { index: true, element: <ExplorerHome /> },
          { path: "collection/:collectionId", element: <ExplorerCollection />, loader : explorerCollectionLoader},
          { path: "template/:collectionId/:templateId", element: <ExplorerTemplate />, loader : explorerTemplateLoader},
          { path: "nft/:accountName/:nftId", element: <ExplorerNFT />, loader : explorerNFTLoader},
        ],
      },
      {
        path: "trading",
        element: <TradingIndex />,
        children: [
          { index: true, element: <TradingHome /> },
          { path: "collection/:collectionId", element: <ExplorerCollection />, loader : explorerCollectionLoader,},
          { path: "template/:collectionId/:templateId", element: <ExplorerTemplate />, loader : explorerTemplateLoader,},
        ],
      },
      {
        path: "profile",
        element: <ProfileIndex />,
        children: [
          { index: true, element: <ProfileHome /> },
        ],
      },
    ],
    errorElement : <ErrorPage />
  },
  {
    path: "test",
    element: <TestPage />
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <RouterProvider router={router} />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
