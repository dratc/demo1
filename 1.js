document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");

    const productCards = document.querySelectorAll('.product-card');
    const orderSummaryBody = document.getElementById('orderSummaryBody');
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shippingCost');
    const totalPriceElement = document.getElementById('totalPrice');
    const finalPriceElement = document.getElementById('finalPrice');
    const placeOrderButton = document.getElementById('placeOrder');
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorMessage = document.getElementById('errorMessage');

    let subtotal = 0;
    let shippingCost = 0;
    let totalPrice = 0;

    // Auto-check the first product by default
    const firstProductCheckbox = document.querySelector('.product-card input[type="checkbox"]');
    if (firstProductCheckbox) {
        firstProductCheckbox.checked = true;
    }

    // Initialize the order summary calculation
    updateOrderSummary();

    // Product selection and calculation
    productCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const quantityInput = card.querySelector('input[type="number"]');
        const sizeSelect = card.querySelector('.product-size');
        const price = parseFloat(checkbox.value);

        checkbox.addEventListener('change', updateOrderSummary);
        quantityInput.addEventListener('input', updateOrderSummary);
        sizeSelect.addEventListener('change', updateOrderSummary);
    });

    // Shipping cost calculation
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', () => {
            shippingCost = parseFloat(option.value);
            updateOrderSummary();
        });
    });

    // Update order summary
    function updateOrderSummary() {
        console.log("Updating order summary");
        subtotal = 0;
        orderSummaryBody.innerHTML = '';

        productCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const quantityInput = card.querySelector('input[type="number"]');
            const sizeSelect = card.querySelector('.product-size');
            const productName = checkbox.getAttribute('data-name');
            const price = parseFloat(checkbox.value);
            const quantity = parseInt(quantityInput.value);
            const size = sizeSelect.value;

            if (checkbox.checked) {
                const productTotal = price * quantity;
                subtotal += productTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${productName} (${size}, ${quantity}x)</td>
                    <td class="text-end">৳ ${productTotal.toFixed(2)}</td>
                `;
                orderSummaryBody.appendChild(row);
            }
        });

        totalPrice = subtotal + shippingCost;

        subtotalElement.textContent = subtotal.toFixed(2);
        shippingCostElement.textContent = shippingCost.toFixed(2);
        totalPriceElement.textContent = totalPrice.toFixed(2);
        finalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Function to show error messages
    function showError(message) {
        console.error("Error:", message);
        errorMessage.textContent = message;
        errorModal.show();
    }

    // Place order button functionality
    placeOrderButton.addEventListener('click', () => {
        console.log("Place order button clicked");
        const customerName = document.getElementById('customerName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const address = document.getElementById('address').value.trim();
        const selectedProducts = [];
        let sizeSelected = false;

        // Check if at least one product is selected and a size is chosen
        productCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const sizeSelect = card.querySelector('.product-size');
            if (checkbox.checked && sizeSelect.value) {
                sizeSelected = true;
            }
        });

        // Validate inputs
        if (!customerName) {
            showError("❌ Please enter your name!");
            return;
        }
        if (!phoneNumber) {
            showError("❌ Please enter your phone number!");
            return;
        }
        if (!address) {
            showError("❌ Please enter your address!");
            return;
        }
        if (!sizeSelected) {
            showError("❌ Please select a size for the selected product(s)!");
            return;
        }
        if (!document.querySelector('input[name="shipping"]:checked')) {
            showError("❌ Please select a shipping method!");
            return;
        }

        // Collect selected products
        productCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const quantityInput = card.querySelector('input[type="number"]');
            const sizeSelect = card.querySelector('.product-size');
            const productName = checkbox.getAttribute('data-name');

            if (checkbox.checked) {
                selectedProducts.push({
                    name: productName,
                    quantity: quantityInput.value,
                    size: sizeSelect.value,
                    price: checkbox.value
                });
            }
        });

        // Generate order number
        const orderNumber = Math.floor(Math.random() * 1000000);

        // Redirect to order confirmation page
        const orderDetails = {
            orderNumber,
            customerName,
            phoneNumber,
            address,
            products: selectedProducts,
            subtotal,
            shippingCost,
            totalPrice
        };

        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        window.location.href = 'order-confirmation.html';
    });
});

// Function to increment quantity
function incrementQuantity(button) {
    console.log("Increment button clicked");
    const input = button.parentElement.querySelector('input[type="number"]');
    input.value = parseInt(input.value) + 1;
    input.dispatchEvent(new Event('input'));
}

// Function to decrement quantity
function decrementQuantity(button) {
    console.log("Decrement button clicked");
    const input = button.parentElement.querySelector('input[type="number"]');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
        input.dispatchEvent(new Event('input'));
    }
}