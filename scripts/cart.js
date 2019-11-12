let store;

try {
  store = JSON.parse(localStorage.store);
} catch (e) {
  store = {};
}

store.save = function() {
  localStorage.store = JSON.stringify(this);
};

let cart = this.store.cart || [];

// save to the store
// basic logic
// render the cart
// add DOM elements and event listening when the page loads
// Create a shopping cart
