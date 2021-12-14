import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AddProjects from "./Components/Dashboard/AddProjects/AddProjects";
import AddReviews from "./Components/Dashboard/AddReviews/AddReviews";
import AddService from "./Components/Dashboard/AddService/AddService";
import DashboardHome from "./Components/Dashboard/DashboardHome/DashboardHome";
import MakeAdmin from "./Components/Dashboard/MakeAdmin/MakeAdmin";
import ManageServices from "./Components/Dashboard/ManageServices/ManageServices";
import Home from "./Components/Home/Home/Home";
import Login from "./Components/Login/Login/Login";
import PrivateRoute from "./Components/Login/Login/PrivateRoute/PrivateRoute";
import Payment from "./Components/PaymentAndCheckout/PaymentAndCheckout/PaymentAndCheckout";
import Bookings from "./Components/Dashboard/Bookings/Bookings";
import OrderLists from "./Components/Dashboard/OrderLists/OrderLists";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

export const UserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
  });
  document.title="Luxury Apartment";

  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/home">
            <Home />
          </Route>

          <Route exact path="/login">
            <Login></Login>
          </Route>

          <PrivateRoute exact path="/dashboardhome">
            <DashboardHome />
          </PrivateRoute>

          <PrivateRoute exact path="/manageservices">
            <ManageServices />
          </PrivateRoute>

          <PrivateRoute exact path="/makeadmin">
            <MakeAdmin />
          </PrivateRoute>

          <PrivateRoute exact path="/addprojects">
            <AddProjects />
          </PrivateRoute>

          <PrivateRoute exact path="/addReview">
            <AddReviews />
          </PrivateRoute>

          <PrivateRoute exact path="/addServices">
            <AddService />
          </PrivateRoute>

          <PrivateRoute exact path="/book">
            <Payment />
          </PrivateRoute>

          <PrivateRoute exact path="/book/:serviceId">
            <Payment />
          </PrivateRoute>

          <PrivateRoute exact path="/bookings">
            <Bookings />
          </PrivateRoute>

          <PrivateRoute exact path="/orderlist">
            <OrderLists />
          </PrivateRoute>

        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
