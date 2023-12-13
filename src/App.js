import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Details from './pages/Details/Details';
import All from './pages/AllProducts/AllProduct';
import Home from './pages/Home/Home';
import ErrorTest from './pages/Error/ErrorTest';

function App  ()  {
 return (
   <div className="wrapper">
     <Router>
       <Routes>
         <Route path="/" exact element={<Home />} />
         <Route path="/all" exact element={<All />} />
         <Route path="/details/:id" element={<Details />} />
         <Route path="*" exact element={<ErrorTest />} />
       </Routes>
     </Router>
   </div>
 );
};

   export default App;