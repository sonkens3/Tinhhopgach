// Assuming boxPrice is a reference to an input field
function formatCurrency() {
    const input = document.getElementById('boxPrice');
    input.addEventListener('input', function() {
        let value = parseFloat(this.value.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(value)) {
            this.value = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
    });
}

formatCurrency();