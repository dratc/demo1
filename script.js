document.addEventListener("DOMContentLoaded", function () {
    const placeOrderButton = document.getElementById("placeOrder");
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

    function showError(message) {
        document.getElementById('errorMessage').innerHTML = message;
        errorModal.show();
    }

    placeOrderButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Get all required values
        const customerName = document.getElementById("customerName").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const selectedProducts = document.querySelectorAll('input[name="product"]:checked');
        const shipping = document.querySelector('input[name="shipping"]:checked');
        const size = document.querySelector('input[name="size"]:checked');

        // Validation checks
        if (!customerName) {
            showError("❌ Please enter your name!");
            return;
        }
        if (!phoneNumber) {
            showError("❌ Please enter your phone number!");
            return;
        }
        if (!size) {
            showError("❌ Please select a size!");
            return;
        }
        if (!shipping) {
            showError("❌ Please select a shipping method!");
            return;
        }
        if (selectedProducts.length === 0) {
            showError("❌ Please select at least one product!");
            return;
        }

        // Prepare order data
        const orderDetails = {
            customerName: customerName,
            phoneNumber: phoneNumber,
            size: size.value,
            shipping: shipping.value,
            products: [],
            totalPrice: document.getElementById("totalPrice").textContent
        };

        // Add selected products
        selectedProducts.forEach(checkbox => {
            const product = {
                name: checkbox.getAttribute("data-name"),
                price: parseFloat(checkbox.value),
                quantity: parseInt(checkbox.closest(".product-card").querySelector('input[name="quantity"]').value)
            };
            orderDetails.products.push(product);
        });

        // Store and redirect
        localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
        window.location.href = "order-confirmation.html";
    });
});

  document.addEventListener("DOMContentLoaded", function () {
      const productCheckboxes = document.querySelectorAll('input[name="product"]');
      const quantityInputs = document.querySelectorAll('input[name="quantity"]');
      const shippingRadios = document.querySelectorAll('input[name="shipping"]');

      let selectedProducts = [];
      let shippingCost = 0;

      // Function to update the order summary
      function updateSummary() {
          const orderSummaryBody = document.getElementById("orderSummaryBody");
          let subtotal = 0;

          // Clear the existing order summary
          orderSummaryBody.innerHTML = "";

          // Loop through selected products and calculate subtotal
          selectedProducts.forEach(product => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${product.name} × ${product.quantity}</td>
                  <td class="text-end">৳ ${(product.price * product.quantity).toFixed(2)}</td>
              `;
              orderSummaryBody.appendChild(row);
              subtotal += product.price * product.quantity;
          });

          // Update subtotal, shipping, and total price
          document.getElementById("subtotal").textContent = subtotal.toFixed(2);
          document.getElementById("shippingCost").textContent = shippingCost.toFixed(2);
          const totalPrice = subtotal + shippingCost;
          document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
          document.getElementById("finalPrice").textContent = totalPrice.toFixed(2);
      }

      // Function to handle product selection
      function handleProductSelection(checkbox) {
          const productName = checkbox.getAttribute("data-name");
          const productPrice = parseFloat(checkbox.value);
          const quantityInput = checkbox.closest(".product-card").querySelector('input[name="quantity"]');
          const quantity = parseInt(quantityInput.value);

          if (checkbox.checked) {
              // Add product to the selectedProducts array
              selectedProducts.push({ name: productName, price: productPrice, quantity: quantity });
          } else {
              // Remove product from the selectedProducts array
              selectedProducts = selectedProducts.filter(product => product.name !== productName);
          }
          updateSummary();
      }

      // Function to handle quantity changes
      function handleQuantityChange(input) {
          const productCheckbox = input.closest(".product-card").querySelector('input[name="product"]');
          const productName = productCheckbox.getAttribute("data-name");
          const productPrice = parseFloat(productCheckbox.value);
          const quantity = parseInt(input.value);

          if (productCheckbox.checked) {
              // Update the quantity of the selected product
              const productIndex = selectedProducts.findIndex(product => product.name === productName);
              if (productIndex !== -1) {
                  selectedProducts[productIndex].quantity = quantity;
              }
          }
          updateSummary();
      }

      // Event listener for product selection
      productCheckboxes.forEach(checkbox => {
          checkbox.addEventListener("change", function () {
              handleProductSelection(this);
          });
      });

      // Event listener for quantity changes
      quantityInputs.forEach(input => {
          input.addEventListener("input", function () {
              handleQuantityChange(this);
          });
      });

      // Event listener for shipping selection
      shippingRadios.forEach(radio => {
          radio.addEventListener("change", function () {
              shippingCost = parseFloat(this.value);
              updateSummary();
          });
      });

      // Initialize the summary with default values
      updateSummary();
  });


  const scriptURL = 'https://docs.google.com/forms/d/e/1FAIpQLSceMUCseu5n38o3pTX1NJ7G1-FdVQ8E4ZPAjveBCrppgydPnw/formResponse'
    
    const form = document.forms['bootstrapForm']
    
    form.addEventListener('submit', e => {
      e.preventDefault()
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => alert("Thank you! your form is submitted successfully." ))
      .then(() => { window.location.reload(); })
      .catch(error => console.error('Error!', error.message))
    })








    // Get the popup and the button
const popup = document.getElementById("popup");
const popupButton = document.getElementById("popupButton");
const closeButton = document.querySelector(".close");

// When the user clicks the button, open the popup
popupButton.addEventListener("click", () => {
    popup.style.display = "flex";
});

// When the user clicks on the close button, close the popup
closeButton.addEventListener("click", () => {
    popup.style.display = "none";
});

// When the user clicks anywhere outside the popup, close it
window.addEventListener("click", (event) => {
    if (event.target === popup) {
        popup.style.display = "none";
    }
});