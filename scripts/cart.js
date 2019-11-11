let cart = [];
let buttonsDOM = [];


// const clearBtn = document.querySelector(".");
const theCart = document.querySelector(".theCart");
const cartContent = document.querySelector(".cart-content");
// const cartItem = document.querySelector(".");
const total = document.querySelector(".total");
const moms = document.querySelector(".moms");
//const packageDOM = document.querySelector(".packageDOM");

// skapa class för carten
class Products {
   async getPackages(){
        let result = await fetch("/json/Packages.json");
        let data = await result.json();

        let products = data.packages;
        products = products.map(pack =>{
            const {name, price} = pack.info;
            const {id} = pack.system; 
            return {name, price, id}
        })
        return products;
    }
}

//skapa class för localstorages
class DataStorage {
    static saveStorage(data){
        localStorage.setItem("packages", JSON.stringify(data));
    }
    static getPackage(id){
        let products = JSON.parse(localStorage.getItem('packages'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }

}

// function LoadData() {
//        data = JSON.parse(localStorage.getItem("packages"));
//     } 


// skapa class för utseandet
class Display {
    // displayPackages(packages){
    // let result = '';
    // packages.forEach(pack => {
    //     result += `
    //     <div class="packageDOM">
    //         <p class="">${pack.name}</p>
    //         <p class="">${pack.price}</p>
    //         <button class="cart-btn" data-id="${pack.id}">Buy</button>
    //     </div>
    //     `
    // });
    //     packageDOM.innerHTML = result;
    // }
    getButtons() {
         const buttons = [...document.querySelectorAll(".cartBtn")];
         buttonsDOM = buttons;
         console.log(buttons);
         buttons.forEach(button => {
             let id = button.id;
             let setInCart = cart.find(packages => packages.id === id);
             //console.log(id);
             if(setInCart){
                 button.innerText = "In Cart";
                 button.disabled = true;
             }
                 button.addEventListener('click', (event) => {
                     //console.log(event);
                     event.target.innerText = 'In Cart';
                     event.target.disabled = true;

                     let cartItem = {...DataStorage.getPackage(id), 
                    amount:1};
                     //console.log(cartItem);

                     cart = [...cart,cartItem];
                     DataStorage.saveCart(cart);
                    console.log(cart);
                    
                   // this.setCartValue(cart);

                   // this.addCartItem(cartItem);
                 });
             
         });
    }
    // setCartValue(cart){
    //     let totalSum = 0;
    //     cart.map(item => {
    //         totalSum += item.price * item.amount;
    //     })
    //     //Not working??
    //    total.innerText = parseFloat(totalSum.toFixed(2));
    //    console.log(total);
    // }
    // addCartItem(item){
    //     const div = document.createElement('div');
    //     div.classList.add('cart-item');
    //     div.innerHTML = `
    //     <div>
    //     <label >${item.name}</label>
    //     <label >${item.price}</label>
    //     <span class="remove-item" id=${item.id}>remove</span>
    //     </div>
    //     <div>
    //     <i class="fas fa-chevron-up" id=${item.id}></i>
    //     <label class="moms">Moms: </label>
    //     <label id="item-amount">Amount: ${item.amount}</label>
    //     <i class="fas fa-chevron-down" id=${item.id}></i>
    //     </div>
    //     `;
    //     cartContent.appendChild(div);
    //     console.log(cartContent);
    //     //Den hittar inte min shopping cart??
    // }
    
}

// hamta ifran document...
document.addEventListener("DOMContentLoaded", () => {
    const display = new Display();
    const products = new Products();
    products.getPackages().then(data => {
        //display.displayPackages(data)
        DataStorage.saveStorage(data);
    }).then(() => {
        display.getButtons();
    });
});