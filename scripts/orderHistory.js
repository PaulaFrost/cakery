//jag vill hämta ordern från local storage vid order-knapp-tryck, sen pusha in till ny array
//sen spara ny array så att den inte försvinner vid reload eller om jag tar bort från cart
//sen vill jag skriva ut order arrayen i en omsluten div

class OrderHistory {
      constructor() {
        this.addOrderListener(); 
      }

   addOrderListener() {
   let orderBtn = document.querySelector(".order-btn");
  
      if (!orderBtn) {
        return;
      }

      orderBtn.addEventListener("click", e => {
          console.log("you clicked me!");
        if(store.length != 0) {
            let test = localStorage.getItem("store");
            let ArraySlice = test.slice(9);
            localStorage.setItem("OrderHist", JSON.stringify(ArraySlice));
            let retrievedData = localStorage.getItem("OrderHist");
            let newOrderHistory = JSON.parse(retrievedData);
            console.log("cart from test " + newOrderHistory);
        }else {
    
        }    
    });   
   };

}






















// class OrderHistory {
//   constructor() {
//     this.addOrderListener();
    
//   }

//    addOrderListener() {
//    let orderBtn = document.querySelector(".order-btn");
  
//       if (!orderBtn) {
//         return;
//       }

//       orderBtn.addEventListener("click", e => {

//           let element = e.target.closest(".order-tot");
//           let totalSum = element.querySelector("h5").innerHTML;
//           console.log(totalSum)
//           });
      
//    } 

// }
new OrderHistory();
