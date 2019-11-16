let store;

try {
  store = JSON.parse(localStorage.store);
} catch (e) {
  store = {};
}

store.save = function() {
  localStorage.store = JSON.stringify(this);
};

let newStore;

try {
  newStore = JSON.parse(localStorage.newStore);
}catch (e) {
  newStore = {}
}

newStore.save = function() {
  localStorage.newStore = JSON.stringify(this);
}

class ShoppingCart {
  constructor() {
    this.cart = store.cart || [];
    this.order = newStore.order || [];
    this.render();
    this.addListener();
    this.addListenerRemove();
    this.submitListener();
    this.getDate();
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
      alert('Successfully added to cart');
    });
  }

  addListenerRemove() {
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
      if (e.target.closest(".order-btn")) {
        this.listOutOrder();
        this.clear();
        this.render();
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
        name, price, quantity, deal
      });
    }
    this.save();
  }

  addNew(name, price, deal, quantity = 1) {
    let date = this.getDate();
    let found = false;
    this.order.forEach(row => {
      if (row.name === name) {
        row.quantity += quantity;
        found = true;
      }
    });
    if (!found) {
      this.order.push({
        name, price, quantity, deal, date
      });
    }
    this.newSave();
  }

  save() {
    store.cart = this.cart;
    store.save();
  }

  newSave(){
    newStore.order = this.order;
    newStore.save();
  }

  listOutOrder(){
   let oldCart = this.cart;
   const newCart = oldCart.filter(arr => arr.name);
   console.log(newCart);
   this.addNew(newCart);
   this.newSave();
  }

  clear(){
    this.cart = [];
    this.save();
  }

  remove(name) {
    this.cart = this.cart.filter(row => row.name !== name);
    this.save();
  }

  getDate(){
    let today = new Date();
    let date = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + today.getDate();
    let min = today.getMinutes();
    min < 10 ? min = '0' + min : min = min + '';
    let hours = today.getHours();
    hours < 10 ? hours = '0' + hours : hours = hours + '';
    let fullTime = date + ' ' + hours + ':' + min;  
    return fullTime;
  }

  render(
    cartEl = document.querySelector(".cart-body"),
    totalEl = document.querySelector(".total-amount"),
    submitEl = document.querySelector(".cart-history")){
  
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
                <p class="prodName">${name}${
                    deal ? '<span class="deal"> Deal - 3 for 2</span>' : ""}
                </p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                  <p class="prod-price">${price}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                  <p>SEK</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                <p class="prod-qua">${quantity}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-1">
                <p>${quantity * price}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-1">
                <button class="remove-btn btn btn-info">Remove</button>
              </div>
            </div>
            <hr>`)
        .join("")}`;
    }

    let totalProd =
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
      </div>
      <div class="col-sm-6 col-md-4 col-xl-5">
        <h5>VAT: ${moms} SEK</h5>
      </div>
      <div class="col-sm-6 col-md-4 col-xl-4">
        <h5>Total: ${total} SEK</h5>
        <button class="order-btn btn btn-info mt-3">Submit order</button>
      </div>`;
  } 

    if (!this.order.length) {
      submitEl.innerHTML = `
      <div class="col-sm-12 col-md-12 col-xl-12 text-center mt-5">
        <h4>No order history...</h4>
      </div>
        `;
    } else {
      submitEl.innerHTML = `
      ${this.order.map(
          ({ name:[{name, price, deal, quantity}] ,date}) => `
            <div class="row">
              <div class="col-sm-6 col-md-4 col-xl-2">
                <p>${date}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-4">
                <p><span class="prodName">${name}</span>
                ${deal ? '<span style="color: rgb(252, 134, 154)"> Deal - 3 for 2</span>' : ""}</p>
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
            </div>
          <hr>`)
        .join("")}`;
    }
   }
}

new ShoppingCart();
