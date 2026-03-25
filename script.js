function getValue(id) {
  const el = document.getElementById(id);
  return parseFloat(el.value);
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

  resultBox.innerHTML = `
    <h2>Kết quả tính toán</h2>
    <p><strong>Diện tích cần lát:</strong> ${data.area.toFixed(2)} m²</p>
    <p><strong>Diện tích sau hao hụt:</strong> ${data.areaWithWastage.toFixed(2)} m²</p>
    <p><strong>Diện tích 1 viên gạch:</strong> ${data.tileArea.toFixed(4)} m²</p>
    <p><strong>Diện tích 1 hộp gạch:</strong> ${data.boxArea.toFixed(4)} m²</p>
    <p><strong>Số viên gạch ước tính cần dùng:</strong> ${data.totalTiles} viên</p>
    <p><strong>Số hộp chính xác:</strong> ${data.exactBoxes.toFixed(2)} hộp</p>
    <p class="highlight"><strong>Số hộp nên mua:</strong> ${data.boxesToBuy} hộp</p>
  `;
}

function calculateBoxes() {
  const area = getValue("area");
  const tileLength = getValue("tileLength");
  const tileWidth = getValue("tileWidth");
  const tilesPerBox = getValue("tilesPerBox");
  const wastage = getValue("wastage") || 0;

  if (
    isNaN(area) ||
    isNaN(tileLength) ||
    isNaN(tileWidth) ||
    isNaN(tilesPerBox)
  ) {
    showError("Vui lòng nhập đầy đủ tất cả thông tin.");
    return;
  }

  if (area <= 0 || tileLength <= 0 || tileWidth <= 0 || tilesPerBox <= 0) {
    showError("Tất cả giá trị phải lớn hơn 0.");
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
    totalTiles: totalTiles
  });
}

function resetForm() {
  document.getElementById("area").value = "";
  document.getElementById("tileLength").value = "";
  document.getElementById("tileWidth").value = "";
  document.getElementById("tilesPerBox").value = "";
  document.getElementById("wastage").value = "5";

  const resultBox = document.getElementById("result");
  resultBox.classList.add("hidden");
  resultBox.classList.remove("error");
  resultBox.innerHTML = "";
}
