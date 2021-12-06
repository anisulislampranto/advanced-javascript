import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AddProjects from "./Components/Dashboard/AddProjects/AddProjects";
import AddReviews from "./Components/Dashboard/AddReviews/AddReviews";
import AddService from "./Components/Dashboard/AddService/AddService";
import Book from "./Components/Dashboard/Book/Book";
import DashboardHome from "./Components/Dashboard/DashboardHome/DashboardHome";
import Home from "./Components/Home/Home/Home";
import Login from "./Components/Login/Login/Login";
import Payment from "./Components/Payment/Payment/Payment";

function App() {
  return (
    <Router>
      <Switch>

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

        
        <Route exact path='/book'>
          <Payment/>
        </Route>

        <Route exact path='/book/:id'>
          <Payment/>
        </Route>
        
        <Route exact path='/login'>
          <Login/>
        </Route>



      </Switch>
    </Router>
  );
}

export default App;
