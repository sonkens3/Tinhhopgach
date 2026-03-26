// Original tile category functions
function originalFunction1() { /* original code */ }
function originalFunction2() { /* original code */ }

// Real-time currency formatting for boxPrice
const boxPriceInput = document.getElementById('boxPrice');

boxPriceInput.addEventListener('input', function() {
    let value = this.value.replace(/[^\d]/g, ''); // Remove non-digit characters
    value = (value / 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    this.value = value;
});