let store;

try {
  store = JSON.parse(localStorage.store);
} catch (e) {
  store = {};
}

store.save = function() {
  localStorage.store = JSON.stringify(this);
};

store.remove = function() {
  localStorage.store.removeItem('cart');
};

class ShoppingCart {
  constructor() {
    this.cart = store.cart || [];
    this.orders = store.orders || [];
    this.render();
    this.addListener();
    this.addListenerRemove();
    this.addListenerOrder();
    this.addListenerViewOrders();
  }

  addListener() {
    let buyBtn = document.querySelector(".buy-button");

    if (!buyBtn) {
      return;
    }

    buyBtn.addEventListener("click", e => {
      let productEl = e.target.closest(".product");
      let name = productEl.querySelector("h1").innerHTML;
      let price = productEl.querySelector(".product-price span").innerHTML / 1;
      let deal = productEl.querySelector(".deal");
      this.add(name, price, deal);
      alert("Successfully added to cart");
    });
  }

  addListenerRemove() {
    // delegated event listening
    // we listen to all clicks on body but only react
    // on clicks  on remove-button
    document.body.addEventListener("click", e => {
      if (e.target.closest(".remove-btn")) {
        let productEl = e.target.closest(".row");
        let name = productEl.querySelector(".prodName").innerHTML;
        this.remove(name);
        this.render();
      }
    });
  }

  addListenerOrder() {
    document.body.addEventListener("click", e => {
      if (e.target.closest(".order-btn")) {
        let date = new Date();
        let orderEl = e.target.closest(".total-amount");
        let orderTotalAmount = orderEl.querySelector(".total-value span").innerHTML;
        let orderVatAmount = orderEl.querySelector(".total-vat span").innerHTML;
        let orderShippingAmount = orderEl.querySelector(".total-shipping span").innerHTML;
        let cartItems = this.cart.filter(item => item.name.length);
        
        let oldCart = cartItems;

        let orderItem = {
          date,
          orderTotalAmount,
          orderVatAmount,
          orderShippingAmount,
          oldCart
        };
        
        this.orders.push(orderItem);
        this.saveOrder();
        //alert("Successfully ordered!");

        this.clearCart();
        this.render();

       //console.log("cart", this.cart);
      }
    });
  }

  addListenerViewOrders() {
    document.body.addEventListener("click", e => {
      if (e.target.closest(".orderHistory-button")) {
        this.renderOrderHistory();
      }
    });
  }

  add(name, price, deal, quantity = 1) {
    let found = false;
    this.cart.forEach(row => {
      if (row.name === name) {
        row.quantity += quantity;
        found = true;
      }
    });
    if (!found) {
      this.cart.push({
        name,
        price,
        quantity,
        deal
      });
    }
    this.save();
  }

  save() {
    store.cart = this.cart;
    store.save();
    console.log(this.cart);
  }

  saveOrder() {
    store.orders = this.orders;
    store.save();
    //console.log(this.orders);
  }

  remove(name) {
    console.log(name);
    this.cart = this.cart.filter(row => row.name !== name);
    this.save();
  }

  clearCart() {
    this.cart = [];
    this.save();
  }

  //Shows content i shopping cart page

  render(
    cartEl = document.querySelector(".cart-body"),
    totalEl = document.querySelector(".total-amount")
  ) {
    if (!cartEl) {
      return;
    }

    if (!this.cart.length) {
      cartEl.innerHTML = `
        <div class="col-sm-12 col-md-12 col-xl-12 text-center mt-5">
          <h4>Your cart currently is empty..</h4>
        </div>
        `;
    } else {
      cartEl.innerHTML = `
        <div class="row mb-3">
          <div class="col-sm-6 col-md-4 col-xl-4">
              <h5>Product name</h5>
          </div>
          <div class="col-sm-6 col-md-4 col-xl-2">
              <h5>Price</h5>
          </div>
          <div class="col-sm-6 col-md-4 col-xl-2">
              <h5>Currency</h5>
          </div>
          <div class="col-sm-6 col-md-4 col-xl-2">
            <h5>Quantity</h5>
          </div>
          <div class="col-sm-6 col-md-4 col-xl-2">
              <h5>Sum</h5>
          </div>
        </div>
      ${this.cart
        .map(
          ({ name, price, deal, quantity }) => `
            <div class="row">
              <div class="col-sm-6 col-md-4 col-xl-4">
                <p ><span class="prodName">${name}</span>${
            deal ? '<span class="deal"> Deal - 3 for 2</span>' : ""
          }</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                <p>${price}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                <p>SEK</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                <p>${quantity}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-1">
                <p>${quantity * price}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-1">
                <button class="remove-btn btn btn-info">Remove</button>
              </div>
            </div>
          `
        )
        .join("")}`;
    }

    // Mathlogic and shows Total amount and shipping in page

    let totalProd = this.cart.reduce(
      (sum, { price, quantity, deal }) =>
        sum + price * quantity - (deal ? Math.floor(quantity / 3) * price : 0),
      0
    );

    let moms = totalProd * 0.2;
    let shippingPrice = totalProd < 10000 ? 150 : 0;
    let total = totalProd < 0 ? 0 : totalProd + shippingPrice;

    if (!this.cart.length) {
      totalEl.innerHTML = `
        <div class="col-sm-12 col-md-12 col-xl-12 text-center mt-5">
          <h4></h4>
        </div>
        `;
    } else {
      totalEl.innerHTML = `
        <div class="col-sm-6 col-md-4 col-xl-3">
          <h5 class="total-shipping">Shipping: <span>${shippingPrice}</span> SEK</h5>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-5">
          <h5 class="total-vat">VAT: <span>${moms}</span> SEK</h5>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-4">
          <h5 class="total-value">Total: <span>${total}</span> SEK</h5>
          <button class="order-btn btn btn-info">Order now!</button>
        </div>
      `;
    }
  }

  // Shows order history after clicking "View your order history"-button

  renderOrderHistory(orderEl = document.querySelector(".show-orderHistory")) {
    if (!orderEl) {
      return;
    }

    if (!this.orders.length) {
      orderEl.innerHTML = `
      <p>You have no order history</p>
    `;
    } else {
      orderEl.innerHTML = `
      <div class="row">
        <div class="col-sm-6 col-md-4 col-xl-4 mb-4">
          <h5>Orders</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6 col-md-4 col-xl-2">
          <h6>Date</h6>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-4">
          <h6>Total</h6>
        </div>
      </div>
      ${this.orders
        .map(
          ({ date, orderTotalAmount, oldCart, orderShippingAmount}) => `
          <div class="row">
            <div class="col-sm-6 col-md-4 col-xl-2">
              <p>${date}<p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-2">
              <p>${orderTotalAmount} SEK<p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-2">
              <p>${orderShippingAmount} SEK<p>
            </div>
            <div class="col-sm-6 col-md-4 col-xl-4">
              ${oldCart.map(({ name, price }) => `
                <p>${name} ${price} SEK</p>`
               ).join("")}
            </div>
          </div>
            `
        )
        .join("")}
     `;
    }
  }
}

new ShoppingCart();
