import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, createBrowserRouter, NavLink, Route, Router, RouterProvider, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Chat_list } from './chat_list/chat_list';
import { Chat } from './chat/chat';
import { PlayerMap } from './map/map';
import { Match } from './match/match';
import { NewAccount } from './newAccount/newAccount';
import { RootLayout } from './layouts/RootLayout';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {path: '/match/:playerId', element: <Match />},
      {path: '/match', element: <Match />},
      {path:'/chat_list', element: <Chat_list />},
      {path:'/chat/:chatId', element: <Chat />},
    ],
  },
  {path:'/', element: <Login />},
  {path:'/login', element: <Login />},
  {path:'/newAccount', element: <NewAccount />},
  {path:'/map', element: <PlayerMap />},
  {path:'*', element: <NotFound />},
]);

export default function App() {
  return <RouterProvider router={router} />;
  return <RouterProvider router={router} />;
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}