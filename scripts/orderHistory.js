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
      if (!store.length) {
        let getStoredArray =
          JSON.parse(localStorage.getItem("OrderHist")) || [];
        let newOrder = JSON.parse(localStorage.getItem("store"));
        getStoredArray.push(newOrder);
        localStorage.setItem("OrderHist", JSON.stringify(getStoredArray));
      } else {
      }

      function printOrderHistory() {
        let getOrderHistoryArray =
          JSON.parse(localStorage.getItem("OrderHist")) || [];
        orderPrint.innerHTML = `
        <div class="row">
          <div class="col-sm-4 col-md-2 col-xl-1 mb-4">
          <hr>
            <h5>Order history</h5>
          </div>
        </div>
        ${getOrderHistoryArray
          .reverse()
          .map(
            ({ cart }) => `
            <div class="row col-xl-12 mb-5 border">
              <div class="col-sm-6 col-md-4 col-xl-4">
                <p>${"Purchase date: " + new Date().toLocaleDateString()}<p>
              </div>
              <div class="col-sm-6 col-md-4 col-xl-2">
                ${cart
                  .map(
                    ({ price }) => `
                <p>${"Price: " + price}</p>`
                  )
                  .join("")}
              </div>
              <div class="col-sm-6 col-md-4 col-xl-4">
                ${cart
                  .map(
                    ({ name }) => `
                    <p>${"Package: " + name}</p>`
                  )
                  .join("")}
              </div>
              <hr>
              </div>
              `
          )
          .join("")}
              `;
      }
      printOrderHistory();
    });
  }
}
new OrderHistory();
