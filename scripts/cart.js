let store;
let saveOrder;

try {
  store = JSON.parse(localStorage.store);
} catch (e) {
  store = {};
}

store.save = function() {
  localStorage.store = JSON.stringify(this);
};

try {
  saveOrder = JSON.parse(localStorage.saveOrder);
}catch (e) {
  saveOrder = {}
}

saveOrder.save = function() {
  localStorage.saveOrder = JSON.stringify(this);
}

console.log(store)

class ShoppingCart {
  constructor() {
    this.cart = store.cart || [];
    this.render();
    this.addListener();
    this.addListenerRemove();
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
        console.log(name);
        this.remove(name);
        this.render();
      }
    });
  }

  submitListener(){
    document.body.addEventListener("click", e => {
      if(e.target.closest(".order-btn")){
        let name = productEl.querySelector("h1").innerHTML;
        let price = productEl.querySelector(".product-price span").innerHTML / 1;
        let deal = productEl.querySelector(".deal");
        this.save(name, price, deal);
      }
    })
  }

  saveOrderListener() {
      let saveOrderBtn = document.querySelector(".saveOrder");
      saveOrderBtn.document.body.addEventListener("click", e => {
        let order = e.target.closest("h1").innerHTML;
    })
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
  }

  remove(name) {
    console.log(name);
    this.cart = this.cart.filter(row => row.name !== name);
    this.save();
  }

  //Shows content i shopping cart page

  render(
    cartEl = document.querySelector(".cart-body"),
    totalEl = document.querySelector(".total-amount"),
    submitEl = document.querySelector("cart-history")) 
  {
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
      ${this.cart
        .map(
          ({ name, price, deal, quantity }) => `
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
            <div class="row">
              <div class="col-sm-6 col-md-4 col-xl-4">
                  <p ><span class="prodName">${name}</span>${
            deal ? '<span style="color: rgb(252, 134, 154)"> Deal - 3 for 2</span>' : ""
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

    let totalProd =
      // this.cart.length === 3
      //   ? this.cart.reduce((sum, { price, quantity }) => sum + price, 0) * 0.66
      this.cart.reduce(
        (sum, { price, quantity, deal }) =>
          sum +
          price * quantity -
          (deal ? Math.floor(quantity / 3) * price : 0),
        0
      );

    let moms = totalProd * 0.2;
    let shippingPrice = totalProd < 10000 ? 150 : 0;
    let total = totalProd < 0 ?  0 : totalProd + shippingPrice;

    if (!this.cart.length) {
      totalEl.innerHTML = `
      <div class="col-sm-12 col-md-12 col-xl-12 text-center mt-5">
        <h4></h4>
      </div>
        `;
    }else{
    totalEl.innerHTML = `
    <div class="col-sm-6 col-md-4 col-xl-3">
          <h5>Shipping: ${shippingPrice} SEK</h5>
          <a class="" href="#">Order history</a>
      </div>
    <div class="col-sm-6 col-md-4 col-xl-5">
          <h5>VAT: ${moms} SEK</h5>
          <a class="saveOrder" href="#">Save order</a>
    </div>
        <div class="col-sm-6 col-md-4 col-xl-4">
          <h5>Total: ${total} SEK</h5>
          <button class="order-btn btn btn-info mt-3">Submit order</button>
      </div>
    `;
  }
   
    if (!submitEl) {
      return;
    }

    if (!this.cart.length) {
      submitEl.innerHTML = `
      <div class="col-sm-12 col-md-12 col-xl-12 text-center mt-5">
      <h2>Order history</h2>
        <h4>No order history</h4>
      </div>
        `;
    } else {
      submit.innerHTML = `
      ${this.cart
        .map(
          ({ name, price, deal, quantity }) => `
            <div class="row">
              <div class="col-sm-6 col-md-4 col-xl-4">
                  <p ><span class="prodName">${name}</span>${
            deal ? '<span style="color: rgb(252, 134, 154)"> Deal - 3 for 2</span>' : ""
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
            </div>
          `
        )
        .join("")}`;
    }
  }
}

new ShoppingCart();
