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

  add(name, price) {
    this.cart.push({
      name,
      price
    });
    console.log(this.cart);

    this.save();
  }

  save() {
    store.cart = this.cart;
    store.save();
  }

  //det som skriver ut på shopping cart sidan

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
        ({ name, price }) => `
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
        <button>Remove</button>
      </div>
        `
      )
      .join("")}`;

    let total = this.cart.reduce((sum, { price }) => sum + price, 0);
    let moms = total*0.2

    totalEl.innerHTML = `
    <div class="col-sm-6 col-md-4 col-xl-5">
          <h5>Moms: ${moms}</h5>
      </div>
        <div class="col-sm-6 col-md-4 col-xl-2">
          <h5>Total: ${total}</h5>
      </div>
      <div class="col-sm-6 col-md-4 col-xl-2">
          <p>SEK</p>
      </div>
    `; 
  }
}

new ShoppingCart();
