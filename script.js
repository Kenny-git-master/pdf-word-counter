/**
 * PDF Word Counter Script
 * This script handles PDF file processing to count consecutive characters,
 * display results in a table, and provide filtering functionality.
 */

/**
 * PDF.js library instance.
 * @type {Object}
 */
const pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

/**
 * Array to store the master data of consecutive characters found in the PDF.
 * Each item is an object with char, text, and length properties.
 * @type {Array<{char: string, text: string, length: number}>}
 */
let masterData = [];

/**
 * DOM element for the drop zone.
 * @type {HTMLElement}
 */
const dropZone = document.getElementById("drop-zone");

/**
 * DOM element for the file input.
 * @type {HTMLInputElement}
 */
const fileInput = document.getElementById("pdf-upload");

/**
 * DOM element for the filter input.
 * @type {HTMLInputElement}
 */
const filterInput = document.getElementById("filter-char");

/**
 * DOM element to display the file name.
 * @type {HTMLElement}
 */
const fileNameDisplay = document.getElementById("file-name");

/**
 * DOM element to display the status.
 * @type {HTMLElement}
 */
const statusArea = document.getElementById("status");

/**
 * DOM element for the result area.
 * @type {HTMLElement}
 */
const resultArea = document.getElementById("result-area");

// Event handlers for drop zone
dropZone.onclick = () => fileInput.click();
dropZone.ondragover = (e) => {
  e.preventDefault();
};
dropZone.ondrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type === "application/pdf") processPDF(file);
};

// Event handler for file input change
fileInput.onchange = (e) => {
  if (e.target.files[0]) processPDF(e.target.files[0]);
};

// Event handler for filter input
filterInput.oninput = () => renderTable(masterData);

/**
 * Processes the uploaded PDF file to extract consecutive characters.
 * @param {File} file - The PDF file to process.
 * @returns {Promise<void>}
 */
async function processPDF(file) {
  // Display file name
  fileNameDisplay.textContent = file.name;
  statusArea.textContent = "解析中...";
  resultArea.innerHTML = "";
  masterData = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: "./cmaps/",
      cMapPacked: true,
    }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join("");

      const regex = /(.)\1+/g;
      let match;
      while ((match = regex.exec(pageText)) !== null) {
        masterData.push({
          char: match[0][0],
          text: match[0],
          length: match[0].length,
        });
      }
    }

    masterData.sort((a, b) => b.length - a.length);
    renderTable(masterData);
    updateStatus();
  } catch (error) {
    statusArea.textContent = "エラー: " + error.message;
  }
}

/**
 * Renders the table with the filtered data.
 * @param {Array<{char: string, text: string, length: number}>} data - The data to render.
 */
function renderTable(data) {
  const filterText = filterInput.value.trim();
  const filteredData = filterText
    ? data.filter(
        (item) => item.char === filterText || item.text.includes(filterText)
      )
    : data;

  if (filteredData.length === 0) {
    resultArea.innerHTML = "<p>該当する連続文字は見つかりませんでした。</p>";
    updateStatus(0);
    return;
  }

  let html = `<table><thead><tr><th>文字列</th><th>桁数</th></tr></thead><tbody>`;
  filteredData.forEach((m) => {
    html += `<tr><td class="digit-cell">${m.text}</td><td>${m.length}</td></tr>`;
  });
  html += `</tbody></table>`;
  resultArea.innerHTML = html;
  updateStatus(filteredData.length);
}

/**
 * Updates the status display.
 * @param {number} [count=masterData.length] - The number of items to display.
 */
function updateStatus(count = masterData.length) {
  if (masterData.length === 0) {
    statusArea.textContent = "PDFを読み込んでください";
  } else {
    statusArea.textContent = `全 ${masterData.length} 箇所中、${count} 箇所を表示中`;
  }
}
