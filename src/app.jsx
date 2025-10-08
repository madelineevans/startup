import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Chat_list } from './chat_list/chat_list';
import { Chat } from './chat/chat';
import { Map } from './map/map';
import { Match } from './match/match';
import { NewAccount } from './newAccount/newAccount';

export default function App() {
  return (
    <BrowserRouter>
      <main className="container-fluid px-4">
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/newAccount' element={<NewAccount />} />
          <Route path='/chat_list' element={<Chat_list />} />
          <Route path='/map' element={<Map />} />
          <Route path='/match' element={<Match />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}