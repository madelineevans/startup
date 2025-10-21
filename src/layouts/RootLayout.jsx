import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer.jsx';

export function RootLayout() {
    return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100 roboto-flex">
      {/* Shared Header
      <header className="container-fluid px-4 d-flex justify-content-center align-items-center gap-2 py-3">
        <img src="/pickle_logo.png" alt="logo" style={{ height: "90px" }} />
        <h1 className="fascinate-inline-regular">PicklePlayer</h1>
      </header> */}

      <main className="container-fluid px-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5 pb-5">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}