# PDF Consecutive Character Counter

A lightweight, privacy-focused browser tool to detect and count consecutive identical characters within PDF documents. This is particularly useful for auditing business forms, detecting data entry errors, or identifying system-generated anomalies in PDF reports.

## Features

- **Drag & Drop Interface**: Easily upload PDFs by dropping them into the browser.
- **Sequence Analysis**: Detects any character repeated 2 or more times (e.g., "000", "AAAAA").
- **Detailed Reporting**: Displays each occurrence in a table with the exact character string and its length (digit count).
- **Real-time Filtering**: Narrow down results to specific characters (e.g., searching for "0" to find all zero-sequences).
- **Privacy-First**: All processing is done locally in your browser using `pdf.js`. Your files are never uploaded to a server.

## How to Use

1. **Open the App**: Open the `index.html` file in any modern web browser.
2. **Load a PDF**:
   - Drag your PDF file into the dashed box area, OR
   - Click the box to select a file from your computer.
3. **View Results**:
   - The table will automatically populate with found sequences.
   - Results are sorted by the length of the sequence (longest first).
4. **Filter Results**:
   - Use the "Filter by character" input box to search for specific character repetitions (e.g., type "W" to see only sequences of that character).
5. **Analyze**: Check the "Length" column to verify if the character counts match your business requirements.

## Technical Details

- **Core Library**: [pdf.js](https://mozilla.github.io/pdf.js/) by Mozilla.
- **No Backend Required**: Built with pure HTML5, CSS3, and Vanilla JavaScript.
- **Multilingual Support**: Supports Japanese characters and CJK fonts via `cMap` integration.

## Installation / Deployment

Simply clone this repository and open `index.html`:

```bash
git clone [https://github.com/your-username/pdf-char-counter.git](https://github.com/your-username/pdf-char-counter.git)
cd pdf-char-counter
open index.html
```
