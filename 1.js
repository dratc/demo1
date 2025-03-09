document.addEventListener('DOMContentLoaded', function () {
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

    // Popup functionality
    const popup = document.getElementById('popup');
    const popupButton = document.getElementById('popupButton');
    const closePopup = document.querySelector('.close');

    popupButton.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

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

    // Place order button functionality
    placeOrderButton.addEventListener('click', () => {
        const customerName = document.getElementById('customerName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const address = document.getElementById('address').value;
        const selectedProducts = [];

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

        if (!customerName || !phoneNumber || !address || selectedProducts.length === 0) {
            errorMessage.textContent = 'Please fill out all required fields';
            errorModal.show();
            return;
        }

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