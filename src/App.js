import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import SingleListing from './pages/SingleListing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  
  return (
    <div className='app'>
    <Suspense fallback={null}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/edit-listing/:listingId' element={<EditListing />} />
          <Route path='/category/:categoryName/:listingId' element={<SingleListing />} />
        </Routes>
      </Router>
      <ToastContainer />
    </Suspense>
    </div>
  );
}

export default App;
