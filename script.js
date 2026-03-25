const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("result");

calcBtn.addEventListener("click", calculateBoxes);
resetBtn.addEventListener("click", resetForm);

function getValue(id) {
  return parseFloat(document.getElementById(id).value);
}

function showError(message) {
  resultBox.classList.remove("hidden");
  resultBox.classList.add("error");
  resultBox.innerHTML = `<strong>${message}</strong>`;
}

function showResult(data) {
  resultBox.classList.remove("hidden");
  resultBox.classList.remove("error");
  resultBox.innerHTML = `
    <h2>Kết quả tính toán</h2>
    <p><strong>Diện tích khu vực cần lát:</strong> ${data.area.toFixed(2)} m²</p>
    <p><strong>Diện tích sau khi cộng hao hụt:</strong> ${data.areaWithWastage.toFixed(2)} m²</p>
    <p><strong>Diện tích 1 viên gạch:</strong> ${data.tileArea.toFixed(4)} m²</p>
    <p><strong>Diện tích 1 hộp gạch:</strong> ${data.boxArea.toFixed(4)} m²</p>
    <p><strong>Số viên gạch ước tính cần dùng:</strong> ${data.totalTiles} viên</p>
    <p><strong>Số hộp chính xác:</strong> ${data.exactBoxes.toFixed(2)} hộp</p>
    <p class="highlight"><strong>Số hộp nên mua:</strong> ${data.boxesToBuy} hộp</p>
  `;
}

function calculateBoxes() {
  const areaLength = getValue("areaLength");
  const areaWidth = getValue("areaWidth");
  const tileLength = getValue("tileLength");
  const tileWidth = getValue("tileWidth");
  const tilesPerBox = getValue("tilesPerBox");
  const wastage = getValue("wastage") || 0;

  if (
    isNaN(areaLength) ||
    isNaN(areaWidth) ||
    isNaN(tileLength) ||
    isNaN(tileWidth) ||
    isNaN(tilesPerBox)
  ) {
    showError("Vui lòng nhập đầy đủ tất cả thông tin.");
    return;
  }

  if (
    areaLength <= 0 ||
    areaWidth <= 0 ||
    tileLength <= 0 ||
    tileWidth <= 0 ||
    tilesPerBox <= 0
  ) {
    showError("Tất cả giá trị phải lớn hơn 0.");
    return;
  }

  if (wastage < 0) {
    showError("Phần trăm hao hụt không được nhỏ hơn 0.");
    return;
  }

  const area = areaLength * areaWidth;
  const tileArea = tileLength * tileWidth;
  const boxArea = tileArea * tilesPerBox;
  const areaWithWastage = area * (1 + wastage / 100);
  const exactBoxes = areaWithWastage / boxArea;
  const boxesToBuy = Math.ceil(exactBoxes);
  const totalTiles = Math.ceil(areaWithWastage / tileArea);

  showResult({
    area,
    tileArea,
    boxArea,
    areaWithWastage,
    exactBoxes,
    boxesToBuy,
    totalTiles
  });
}

function resetForm() {
  document.getElementById("areaLength").value = "";
  document.getElementById("areaWidth").value = "";
  document.getElementById("tileLength").value = "";
  document.getElementById("tileWidth").value = "";
  document.getElementById("tilesPerBox").value = "";
  document.getElementById("wastage").value = "5";

  resultBox.classList.add("hidden");
  resultBox.classList.remove("error");
  resultBox.innerHTML = "";
}
