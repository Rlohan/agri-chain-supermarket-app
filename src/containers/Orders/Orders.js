import React, { Component } from "react";
import "./Orders.css";
class Orders extends Component {
  render() {
    const items = Object.values(this.props.itemsPrice).map((item, index) => {
      let specialPrice = null;
      if (Object.keys(item.specialPrice).length > 0) {
        specialPrice = (
          <div>
            Special Offer: Buy {item.specialPrice.quantity} units for{" "}
             {this.props.currencySymbol} {item.specialPrice.price}
          </div>
        );
      }
      return (
        <div key={index} className="">
          <div className="" style={{ margin: "5px" }}>
            <div>
              Item: {item.itemName} (price/unit:   {this.props.currencySymbol} {item.price}/-)
            </div>
            {specialPrice}
            <div />
            <button
              className="btn btn-primary"
              onClick={() => this.props.addItemsHandler(index, item.itemName)}
            >
              Add Item
            </button>
            <button
              className="btn btn-danger"
              onClick={() =>
                this.props.removeItemsHandler(index, item.itemName)
              }
              disabled={this.props.orderedItems[index].quantity <= 0}
            >
              Remove Item
            </button>
          </div>
        </div>
      );
    });

    const orderedItems = this.props.orderedItems.map((item, index) => (
      <div key={index} className="row">
        <div className="col-md-6 col-sm-6 col-6 text-right">
          {item.itemName}
        </div>
        <div className="col-md-6 col-sm-6 col-6 text-left">{item.quantity}</div>
      </div>
    ));

    // let checkoutBtn = null;
    let checkoutBtn = (
      <div className="row">
        <div className="col-md-12">
          <button
            className="btn btn-primary"
            disabled={this.props.totalPrice <= 0}
            onClick={this.props.showCheckoutPage}
          >
            Checkout
          </button>
        </div>
      </div>
    );
    let checkoutPage = null;
    if (this.props.totalPrice > 0) {
      checkoutPage = (
        <div className="col-md-4 col-sm-4 margin-top20">
          <div>Cart:</div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-6 col-6 text-right">
              Item
            </div>
            <div className="col-md-6 col-sm-6 col-6 text-left">Quantity</div>
          </div>
          <div className="">{orderedItems}</div>
          <br />
          <div className="row">
            <div className="col-md-6 col-sm-8 col-6 text-right">
              Total Price:
            </div>
            <div className="col-md-6 col-sm-4 col-6 text-left">
              {this.props.currencySymbol} {this.props.totalPrice}
            </div>
          </div>
          <br />
          <br />
          {checkoutBtn}
        </div>
      );
    }
    let itemList = <div className="col-md-4 col-sm-8">{items}</div>;
    const blankDiv = (
      <div className="row" style={{ height: "130px" }}>
        <div className="col-md-12" />
      </div>
    );
    if (this.props.checkedOut) {
      itemList = <div className="col-md-4"></div>;
      checkoutPage = (
        <div className="col-md-4">
          {blankDiv}
          <div className="row">
            <div className="col-md-12">
              You have successfully placed the order!
            </div>
          </div>
          <div className="row" style={{ height: "10px" }}>
            <div className="col-md-12" />
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                className="btn btn-primary"
                disabled={this.props.totalPrice <= 0}
                onClick={this.props.showCart}
              >
                Order Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="">
        <div className="row">
          {itemList}
          {checkoutPage}
        </div>
      </div>
    );
  }
}

export default Orders;
