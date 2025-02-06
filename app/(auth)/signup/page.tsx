// import React from "react";

// export default function SignUp() {

//     return (
//         <form >

//             <div className="form-container">
//                 <div className="form-card">
//                     <h1>Sign Up</h1>

//                     <div className="mb-3">
//                         <label>First name</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="First name"
//                         //onChange={(e) => setFirstName(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label>Last name</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Last name"
//                         //onChange={(e) => setLastName(e.target.value)}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label>Email address</label>
//                         <input
//                             type="email"
//                             className="form-control"
//                             placeholder="Enter email"
//                         //onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label>Password</label>
//                         <input
//                             type="password"
//                             className="form-control"
//                             placeholder="Enter password"
//                         //onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>

//                     <div className="d-grid">
//                         <button type="submit" className="btn btn-primary">
//                             Sign Up
//                         </button>
//                     </div>
//                     <p className="form-link">
//                         Already registered <a href="/SignIn">sign?</a>
//                     </p>
//                 </div>
//             </div>
//         </form>

//     );
// }
"use client"
import SignUp from "@/app/components/Signup";


export default function SignIn() {
    return (
        <SignUp />
    );
}

