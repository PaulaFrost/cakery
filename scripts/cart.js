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
}

new ShoppingCart();
