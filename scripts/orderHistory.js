//jag vill hämta ordern från local storage vid order-knapp-tryck, sen pusha in till ny array
//sen spara nya arrayen TILL EN annan array så att den inte försvinner vid reload eller om jag tar bort från cart
// nästa grej är att se till att jag kan lägga till mer än en order i historiken
//sen vill jag skriva ut order arrayen med order-arrayerna i en omsluten div

class OrderHistory {
      constructor() {
        this.addOrderListener(); 
      }

   addOrderListener() {
   let orderBtn = document.querySelector(".order-btn");
   let orderPrint = document.querySelector(".orderHistory");
  
      if (!orderBtn) {
        return;
      }

      orderBtn.addEventListener("click", e => {
        if(store.length != 0) {
            let getStoredArray = localStorage.getItem("store");
            let ArraySlice = getStoredArray.slice(9);
            localStorage.setItem("OrderHist", JSON.stringify(ArraySlice));
            let retrievedData = localStorage.getItem("OrderHist");
            // let OrderToPrint = ;
            let newOrderHistory = JSON.parse(retrievedData);
            orderPrint.innerHTML = `<div><p>"${newOrderHistory}</p></div>`;
        }else {
    
        }    
    });   
   };
  
  
}
new OrderHistory();





















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

