let store;

try {
    store = JSON.parse(localStorage.store);
}
catch(e) {
    store = {};
}

store.save = function() {
    localStorage.store = JSON.stringify(this);
}

let cart = this.store.cart || [];
