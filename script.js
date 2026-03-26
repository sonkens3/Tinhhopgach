const tileCategories = {
  small: {
    label: "Gạch nhỏ (nhà tắm, ban công)",
    sizes: [
      { label: "20x20", width: 0.20, length: 0.20 },
      { label: "30x30", width: 0.30, length: 0.30 },
      { label: "40x40", width: 0.40, length: 0.40 }
    ]
  },
  medium: {
    label: "Gạch trung bình (phòng nhỏ, vừa)",
    sizes: [
      { label: "50x50", width: 0.50, length: 0.50 },
      { label: "60x60", width: 0.60, length: 0.60 }
    ]
  },
  large: {
    label: "Gạch lớn (phòng khách, sảnh, biệt thự)",
    sizes: [
      { label: "80x80", width: 0.80, length: 0.80 },
      { label: "100x100", width: 1.00, length: 1.00 },
      { label: "60x120", width: 0.60, length: 1.20 },
      { label: "80x120", width: 0.80, length: 1.20 },
      { label: "120x120", width: 1.20, length: 1.20 },
      { label: "120x240", width: 1.20, length: 2.40 }
    ]
  },
  common: {
    label: "Gạch ốp phổ biến",
    sizes: [
      { label: "30x60", width: 0.30, length: 0.60 },
      { label: "40x80", width: 0.40, length: 0.80 },
      { label: "30x45", width: 0.30, length: 0.45 },
      { label: "25x40", width: 0.25, length: 0.40 },
      { label: "30x90", width: 0.30, length: 0.90 },
      { label: "45x90", width: 0.45, length: 0.90 }
    ]
  },
  decoration: {
    label: "Gạch ốp trang trí/điểm",
    sizes: [
      { label: "10x20", width: 0.10, length: 0.20 },
      { label: "15x30", width: 0.15, length: 0.30 },
      { label: "20x23", width: 0.20, length: 0.23 },
      { label: "30x30", width: 0.30, length: 0.30 }
    ]
  },
  "large-format": {
    label: "Gạch ốp khổ lớn",
    sizes: [
      { label: "60x120", width: 0.60, length: 1.20 },
      { label: "80x120", width: 0.80, length: 1.20 }
    ]
  }
};

function updateTileSizes() {
  const category = document.getElementById("tileCategory").value;
  const sizeSelect = document.getElementById("tileSize");
  
  sizeSelect.innerHTML = '<option value="">-- Chọn kích thước --</option>';
  
  if (!category || !tileCategories[category]) return;
  
  tileCategories[category].sizes.forEach((size, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = size.label;
    sizeSelect.appendChild(option);
  });
}

function setTileDimensions() {
  const category = document.getElementById("tileCategory").value;
  const sizeIndex = document.getElementById("tileSize").value;
  
  if (!category || !tileCategories[category] || sizeIndex === "") {
    return;
  }
  
  const size = tileCategories[category].sizes[sizeIndex];
  document.getElementById("tileWidth").value = size.width;
  document.getElementById("tileLength").value = size.length;
}

function getValue(id) {
  const el = document.getElementById(id);
  return parseFloat(el.value) || 0;
}

function showError(message) {
  const resultBox = document.getElementById("result");
  resultBox.classList.remove("hidden");
  resultBox.classList.add("error");
  resultBox.innerHTML = "<strong>" + message + "</strong>";
}

function showResult(data) {
  const resultBox = document.getElementById("result");
  resultBox.classList.remove("hidden");
  resultBox.classList.remove("error");

  let priceHTML = "";
  if (data.boxPrice > 0) {
    const totalPrice = (data.boxesToBuy * data.boxPrice).toLocaleString("vi-VN");
    priceHTML = `
      <p><strong>Số tiền một hộp:</strong> ${data.boxPrice.toLocaleString("vi-VN")} đ</p>
      <p class="highlight"><strong>Tổng số tiền:</strong> ${totalPrice} đ</p>
    `;
  }

  resultBox.innerHTML = `
    <h2>Kết quả tính toán</h2>
    <p><strong>Diện tích cần lát:</strong> ${data.area.toFixed(2)} m²</p>
    <p><strong>Diện tích sau hao hụt:</strong> ${data.areaWithWastage.toFixed(2)} m²</p>
    <p><strong>Diện tích 1 viên gạch:</strong> ${data.tileArea.toFixed(4)} m²</p>
    <p><strong>Diện tích 1 hộp gạch:</strong> ${data.boxArea.toFixed(4)} m²</p>
    <p><strong>Số viên gạch ước tính cần dùng:</strong> ${data.totalTiles} viên</p>
    <p><strong>Số hộp chính xác:</strong> ${data.exactBoxes.toFixed(2)} hộp</p>
    <p class="highlight"><strong>Số hộp nên mua:</strong> ${data.boxesToBuy} hộp</p>
    ${priceHTML}
  `;
}

// Format currency input with Vietnamese locale
function formatCurrencyInput(input) {
  // Remove non-digit characters
  let value = input.value.replace(/\D/g, '');
  
  // Format with Vietnamese locale if there's a value
  if (value) {
    input.value = parseInt(value).toLocaleString('vi-VN');
  }
}

function calculateBoxes() {
  const area = getValue("area");
  const tileLength = getValue("tileLength");
  const tileWidth = getValue("tileWidth");
  const tilesPerBox = getValue("tilesPerBox");
  const wastage = getValue("wastage") || 0;
  
  // Get box price - remove formatting to get actual number
  const boxPriceInput = document.getElementById("boxPrice").value;
  const boxPrice = parseFloat(boxPriceInput.replace(/\D/g, '')) || 0;

  if (area <= 0 || tileLength <= 0 || tileWidth <= 0 || tilesPerBox <= 0) {
    showError("Vui lòng chọn đầy đủ thông tin gạch và nhập diện tích.");
    return;
  }

  if (wastage < 0) {
    showError("Phần trăm hao hụt không được nhỏ hơn 0.");
    return;
  }

  const tileArea = tileLength * tileWidth;
  const boxArea = tileArea * tilesPerBox;
  const areaWithWastage = area * (1 + wastage / 100);
  const exactBoxes = areaWithWastage / boxArea;
  const boxesToBuy = Math.ceil(exactBoxes);
  const totalTiles = Math.ceil(areaWithWastage / tileArea);

  showResult({
    area: area,
    tileArea: tileArea,
    boxArea: boxArea,
    areaWithWastage: areaWithWastage,
    exactBoxes: exactBoxes,
    boxesToBuy: boxesToBuy,
    totalTiles: totalTiles,
    boxPrice: boxPrice
  });
}

function resetForm() {
  document.getElementById("area").value = "";
  document.getElementById("tileCategory").value = "";
  document.getElementById("tileSize").value = "";
  document.getElementById("tilesPerBox").value = "";
  document.getElementById("wastage").value = "0";
  document.getElementById("boxPrice").value = "";
  document.getElementById("tileWidth").value = "";
  document.getElementById("tileLength").value = "";

  const sizeSelect = document.getElementById("tileSize");
  sizeSelect.innerHTML = '<option value="">-- Chọn kích thước --</option>';

  const resultBox = document.getElementById("result");
  resultBox.classList.add("hidden");
  resultBox.classList.remove("error");
  resultBox.innerHTML = "";
}

// Initialize currency formatting on page load
document.addEventListener('DOMContentLoaded', function() {
  const boxPriceInput = document.getElementById("boxPrice");
  boxPriceInput.addEventListener('input', function() {
    formatCurrencyInput(this);
  });
});
