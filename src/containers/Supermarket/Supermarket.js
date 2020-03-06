import React, { Component, createRef } from "react";
import "./Supermarket.css";
import Orders from "../Orders/Orders";
import Header from "../../components/Header/Header";

class Supermarket extends Component {
  constructor(props) {
    super(props);
    this.emailEl = createRef();
    this.passwordEl = createRef();
    localStorage.setItem("registeredUsers", JSON.stringify([]));
  }
  state = {
    itemsPrice: {
      A: {
        itemName: "A",
        price: 50,
        specialPrice: {
          quantity: 3,
          price: 130
        }
      },
      B: {
        itemName: "B",
        price: 30,
        specialPrice: {
          quantity: 2,
          price: 45
        }
      },
      C: {
        itemName: "C",
        price: 20,
        specialPrice: {}
      },
      D: {
        itemName: "D",
        price: 15,
        specialPrice: {}
      }
    },
    orderedItems: [
      { itemName: "A", quantity: 0 },
      { itemName: "B", quantity: 0 },
      { itemName: "C", quantity: 0 },
      { itemName: "D", quantity: 0 }
    ],
    totalPrice: 0,
    showCheckout: false,
    checkedOut: false,
    loggedIn: false,
    disableButton: true,
    buttonText: "Log In",
    switchButton: "Switch to Sign Up",
    signUpState: false,
    currencySymbol: "₹"
  };

  addItemsHandler = (index, itemName) => {
    const orderedItems = [...this.state.orderedItems];
    const itemsPrice = { ...this.state.itemsPrice };
    orderedItems[index].quantity = orderedItems[index].quantity + 1;
    const totalPrice = this.calculateTotalPrice(orderedItems, itemsPrice);
    this.setState({
      orderedItems: orderedItems,
      totalPrice: totalPrice
    });
  };
  removeItemsHandler = (index, itemName) => {
    const orderedItems = [...this.state.orderedItems];
    const itemsPrice = { ...this.state.itemsPrice };
    orderedItems[index].quantity =
      orderedItems[index].quantity > 0 ? orderedItems[index].quantity - 1 : 0;

    const totalPrice = this.calculateTotalPrice(orderedItems, itemsPrice);
    this.setState({
      orderedItems: orderedItems,
      totalPrice: totalPrice
    });
  };
  calculateTotalPrice = (orderedItems, itemsPrice) => {
    let totalPrice = 0;
    orderedItems.forEach(item => {
      let discountedPrice = 0;
      let pricePerUnit = 0;
      let quantity = item.quantity;
      let specialQuantity = itemsPrice[item.itemName].specialPrice.quantity;
      let specialPrice = itemsPrice[item.itemName].specialPrice.price;
      if (
        (item.itemName === "A" || item.itemName === "B") &&
        (item.quantity >= specialQuantity ||
          item.quantity % specialQuantity === 0)
      ) {
        pricePerUnit = specialPrice / specialQuantity;
        if (item.quantity % specialQuantity === 0) {
          discountedPrice = pricePerUnit * item.quantity;
          quantity =
            item.quantity - (item.quantity / specialQuantity) * specialQuantity;
        } else {
          discountedPrice = specialPrice * Math.floor(item.quantity / 3);
          quantity =
            item.quantity -
            Math.floor(item.quantity / specialQuantity) * specialQuantity;
        }
      }
      //else {
      //   //pricePerUnit = itemsPrice[item.itemName].price;
      //   discountedPrice = 0;
      // }
      totalPrice +=
        itemsPrice[item.itemName].price * quantity + discountedPrice;
    });
    return totalPrice;
  };
  showCheckoutHandler = () => {
    const ans = window.confirm("Are you sure that you want to checkout?");
    if (ans) {
      this.setState(prvState => {
        return {
          checkedOut: !prvState.checkedOut
        };
      });
    }
  };
  showCart = () => {
    const orderedItems = [...this.state.orderedItems];
    orderedItems.forEach(item => {
      item.quantity = 0;
    });
    this.setState({
      checkedOut: false,
      totalPrice: 0,
      orderedItems: orderedItems
    });
  };

  checkValidForm = () => {
    const password = this.passwordEl.current.value;
    const email = this.emailEl.current.value;
    if (password !== "" && email !== "") {
      this.setState({
        disableButton: false
      });
    } else {
      this.setState({
        disableButton: true
      });
    }
  };
  handleSignUp = () => {
    const password = this.passwordEl.current.value;
    const email = this.emailEl.current.value;
    const users = [];
    users.push({ email: email, password: password });
    this.setState({
      loggedIn: true,
      registeredUsers: users
    });
  };
  handleSignIn = (e, loginState) => {
    e.preventDefault();
    const password = this.passwordEl.current.value;
    const email = this.emailEl.current.value;
    const users = JSON.parse(localStorage.getItem("registeredUsers"));
    console.log(users);
    const validUser = users.find(user => {
      return user.email === email;
    });
    if (validUser && this.state.signUpState) {
      alert("This email is already registered!");
      return;
    }
    if (validUser) {
      if (validUser.password !== password) {
        alert("Password is incorrect.");
        return;
      }
      this.setState({
        loggedIn: true
      });
    } else {
      if (!this.state.signUpState) {
        alert("User is not registered! Please Sign Up to continue.");
      }
      if (this.state.signUpState) {
        users.push({ email: email, password: password });
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        this.passwordEl.current.value = "";
        this.emailEl.current.value = "";
        this.setState({
          disableButton: true
        });
        alert("User Sign Up successful. Please login to continue.");
      }
    }
  };
  handleSignOut = () => {
    this.showCart();
    this.setState({
      loggedIn: false,
      disableButton: true
    });
  };
  switchSignUp = e => {
    e.preventDefault();
    this.passwordEl.current.value = "";
    this.emailEl.current.value = "";
    if (this.state.switchButton.includes("Sign Up")) {
      this.setState({
        buttonText: "Sign Up",
        switchButton: "Switch to Log In",
        signUpState: true,
        disableButton: true
      });
    } else {
      this.setState({
        buttonText: "Log In",
        switchButton: "Switch to Sign Up",
        signUpState: false
      });
    }
  };
  render() {
    let signInBtnClasses = ["btn", "btn-danger"];
    let signInBtnStyle = {
      cursor: "not-allowed"
    };
    if (!this.state.disableButton) {
      signInBtnClasses = ["btn", "btn-primary"];
      signInBtnStyle = {};
    }
    let loginPage = (
      <>
        <div className="row">
          <div className="col-md-12" />
        </div>
        <div className="row">
          <form
            className="form-horizontal offset-sm-3 col-sm-9 offset-md-3 col-md-6"
            onSubmit={this.handleSignIn}
          >
            <div className="form-group row">
              <label
                className="control-label col-sm-3 col-md-3"
                htmlFor="fname"
              >
                Email:
              </label>
              <div className="col-sm-9 col-md-9">
                <input
                  ref={this.emailEl}
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  onBlur={this.checkValidForm}
                />
              </div>
            </div>
            <div className="row">
              <label
                className="col-form-label col-sm-3 col-md-3"
                htmlFor="lname"
              >
                Password:
              </label>
              <div className="col-sm-9 col-md-9">
                <input
                  ref={this.passwordEl}
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  onKeyUp={this.checkValidForm}
                  minLength="6"
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="offset-md-3 col-md-9 offset-sm-3 col-sm-9">
                <div className="row">
                  <div className="col-sm-4 col-md-3">
                    <button
                      className={signInBtnClasses.join(" ")}
                      disabled={this.state.disableButton}
                      style={signInBtnStyle}
                    >
                      {this.state.buttonText}
                    </button>
                  </div>
                  <div className="col-sm-8 col-md-5">
                    <button
                      className="btn btn-info"
                      onClick={this.switchSignUp}
                    >
                      {this.state.switchButton}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    );
    if (this.state.loggedIn) {
      loginPage = (
        <Orders
          addItemsHandler={this.addItemsHandler}
          removeItemsHandler={this.removeItemsHandler}
          showCheckoutPage={this.showCheckoutHandler}
          showCart={this.showCart}
          {...this.state}
        />
      );
    }
    return (
      <div className="container-fluid text-center">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Header
              showButton={this.state.loggedIn}
              signOut={this.handleSignOut}
            />
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
        {loginPage}
      </div>
    );
  }
}

export default Supermarket;
