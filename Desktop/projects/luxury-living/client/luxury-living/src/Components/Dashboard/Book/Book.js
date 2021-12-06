// import React, { useState } from "react";
// import Payment from "../../Payment/Payment/Payment";
// import Navigation from "../../Shared/Navigation/Navigation";
// import Sidebar from "../Sidebar/Sidebar";

// const Book = () => {
// const [name, setName] = useState('');
// const [email, setEmail] = useState('');
// const [title, setTitle] = useState('');
// const [success, setSuccess]= useState('');

// const handleSubmit = () => {
//     const formData = new FormData();


// }


//   return (
//     <div>
//       <Navigation />
//       <div className='container-fluid row'>
//         <div className="col-md-2 sidebar">
//           <Sidebar />
//         </div>
//         <div className='col-md-10' style={{position: 'absolute', right:0}}>
//             <div>
//                     <h1>Book Service</h1>
//                     <form onSubmit={handleSubmit}>
                        
//                         <div className="form-group">
//                             <label for="exampleInputName1"> Name </label>
//                             <input onBlur={e => setName(e.target.value)} type="text" name="name" className="form-control"  placeholder="Enter Your Name" />
//                         </div>
//                         <div className="form-group">
//                             <label for="exampleInputEmail1"> Email</label>
//                             <input onBlur={e => setEmail(e.target.value)} type="text" name="email" className="form-control"  placeholder="Enter Your Email" />
//                         </div>

//                         <div className="form-group">
//                             <label for="exampleInputEmail1"> Service title </label>
//                             <input onBlur={e => setTitle(e.target.value)} type="text" name="title" className="form-control"  placeholder="Enter Service Title" />
//                         </div>
                        
//                         <Payment/>

//                         <button type="submit" class="btn btn-primary my-3">Submit</button>
//                     </form>
//                     {success && <p style={{ color: 'green' }}>{success}</p>}
                        
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Book;
