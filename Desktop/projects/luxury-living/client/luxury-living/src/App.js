import React, { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AddProjects from "./Components/Dashboard/AddProjects/AddProjects";
import AddReviews from "./Components/Dashboard/AddReviews/AddReviews";
import AddService from "./Components/Dashboard/AddService/AddService";
import DashboardHome from "./Components/Dashboard/DashboardHome/DashboardHome";
import Home from "./Components/Home/Home/Home";
import Login from "./Components/Login/Login/Login";
import PrivateRoute from "./Components/Login/Login/PrivateRoute/PrivateRoute";
import Payment from "./Components/Payment/Payment/Payment";

export const UserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] =  useState({})
  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
      <Switch>

        <Route exact path='/'>
          <Home/>
        </Route>

        <Route exact path='/home'>
          <Home/>
        </Route>

        <Route exact path='/dashboardhome'>
          <DashboardHome/>
        </Route>

        <Route exact path='/addprojects'>
          <AddProjects/>
        </Route>

        <Route exact path='/addReview'>
          <AddReviews/>
        </Route>

        <Route exact path='/addServices'>
          <AddService/>
        </Route>

        <PrivateRoute exact path='/book'>
          <Payment/>
        </PrivateRoute>

        <PrivateRoute exact path='/book/:serviceId'>
          <Payment/>
        </PrivateRoute>
        
        <PrivateRoute exact path='/login'>
          <Login/>
        </PrivateRoute>



      </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
