let store;

try {
  store = JSON.parse(localStorage.store);
} catch (e) {
  store = {};
}

store.save = function() {
  localStorage.store = JSON.stringify(this);
};

class ShoppingCart {
  constructor() {
    this.cart = store.cart || [];
    this.addListener();
    this.render();
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
      console.log(name, price);
      this.add(name, price);
    });
  }

  add(name, price, quantity = 1) {
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
        deal : true
      });
    }

    console.log(this.cart);

    this.save();
  }

  save() {
    store.cart = this.cart;
    store.save();
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
      return;
    }

    console.log(this.cart);

    cartEl.innerHTML = `
    ${this.cart
      .map(
        ({ name, price, quantity }) => `
        <div class="col-sm-6 col-md-4 col-xl-5">
            <p>${name}</p>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-2">
            <p>${price}</p>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-2">
            <p>SEK</p>
        </div>
        <div class="col-sm-6 col-md-4 col-xl-2">
          <p class="remove-btn">${quantity}</p>
        </div>
        `
      )
      .join("")}`;

    let totalProd =
      // this.cart.length === 3
      //   ? this.cart.reduce((sum, { price, quantity }) => sum + price, 0) * 0.66
      this.cart.reduce((sum, { price, quantity, deal }) => 
        sum + price * quantity - (deal ? Math.floor(quantity/3)*price : 0)
      , 0);
      

    let moms = totalProd * 0.2;
    let shippingPrice = totalProd < 10000 ? 150 : 0;
    let total = totalProd + shippingPrice;

    totalEl.innerHTML = `
    <div class="col-sm-6 col-md-4 col-xl-3">
          <h5>Shipping: ${shippingPrice} SEK</h5>
      </div>
    <div class="col-sm-6 col-md-4 col-xl-5">
          <h5>VAT: ${moms} SEK</h5>
    </div>
        <div class="col-sm-6 col-md-4 col-xl-4">
          <h5>Total: ${total} SEK</h5>
          <button class="order-btn" >Order now!</button>
      </div>
    `;
  }
}

new ShoppingCart();
