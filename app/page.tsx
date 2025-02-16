"use client"
import SignIn from "@/app/(auth)/signin/page";
import Signup from "@/app/(auth)/signup/page";
import Cart from "@/app/(root)/Cart/page";
import Orders from "@/app/(root)/orders/page";
import Checkouts from "@/app/(root)/checkouts/page";
import Homepage from "@/app/(root)/page"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />}></Route>
          <Route path='/SignIn' element={<SignIn />}></Route>
          <Route path='/Signup' element={<Signup />}></Route>
          <Route path='/Cart' element={<Cart />}></Route>
          <Route path='/orders' element={<Orders />}></Route>
          <Route path='/checkouts' element={<Checkouts />}></Route>

        </Routes>
      </BrowserRouter>

    </main>

  );
}

