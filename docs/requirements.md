# Requirements Document

## Introduction

AuroraPDF is a high-performance, client-side PDF utility suite built with React 19.2.0 and styled using the stareezy-ui design system. Its defining principle is "Zero-Server, Total Privacy" — all file processing happens entirely in the browser's memory (RAM), files are never uploaded to any server, and all temporary data is cleared immediately after the user downloads the result. AuroraPDF provides 11 essential PDF services covering optimization, OCR, image conversion, document format conversion, editing, security, and file management.

Global application state (theme, active processing sessions, tool state, and memory tracking) is managed by Zustand 5.x stores, keeping UI state predictable and decoupled from processing logic. React 19.2.0 features — including `useTransition`, `useOptimistic`, and the `use()` hook — are used to keep the UI responsive during long-running client-side operations.

## Glossary

- **AuroraPDF**: The client-side PDF utility suite application described in this document.
- **App**: The AuroraPDF React 19.2.0 application running in the browser.
- **User**: A person interacting with AuroraPDF through a web browser.
- **Tool**: A single PDF utility service (e.g., Compress PDF, Split PDF, Sign PDF). AuroraPDF exposes exactly 11 Tools.
- **File_Processor**: The client-side module responsible for executing a specific Tool's transformation logic.
- **Memory_Manager**: The Zustand-backed module responsible for tracking, revoking, and garbage-collecting all Blob_URLs and in-memory file references. Exposes `register(url)`, `revokeAll()`, and `revokeSession(sessionId)` operations.
- **OCR_Engine**: The Tesseract.js-powered module that performs optical character recognition on image inputs.
- **PDF_Engine**: The pdf-lib / pdf.js-powered module that handles PDF manipulation operations (split, sign, watermark, compress, edit, render).
- **Conversion_Engine**: The module combining SheetJS (xlsx) and Mammoth.js to handle Word and Excel conversions.
- **Blob_URL**: A temporary `blob:` URL created by `URL.createObjectURL()` representing an in-memory file.
- **Processing_Session**: The lifecycle of a single Tool invocation — from file selection through processing to download completion. Each session has a unique `sessionId`.
- **Session_Store**: The Zustand store slice that holds the current Processing_Session state, including status (`idle` | `processing` | `complete` | `error`), progress (0–100), and output metadata.
- **Tool_Store**: The Zustand store slice that holds per-Tool configuration state (e.g., selected compression level, OCR language, watermark settings).
- **Theme_Store**: The Zustand store slice that holds the active color theme (`light` | `dark`) and exposes a `toggleTheme()` action.
- **Download**: The browser-native file download triggered at the end of a Processing_Session.
- **Watermark**: A text overlay applied to PDF pages for branding or security purposes.
- **Digital_Signature**: A visual signature overlay (drawn, typed, or image-based) applied to a PDF page.
- **React_Action**: A React 19 async function passed to `useTransition` or a `<form action>` prop, used to perform non-blocking file processing operations.
- **DPI**: Dots per inch — the resolution unit used for rasterized PDF page images.

---

## Requirements

### Requirement 1: Zero-Server Privacy Architecture

**User Story:** As a user, I want my files to never leave my device, so that my documents remain completely private and secure.

#### Acceptance Criteria

1. THE App SHALL process all file operations exclusively within the browser's memory without transmitting file data to any external server, analytics endpoint, or third-party service.
2. WHEN a Processing_Session completes and the Download is triggered, THE Memory_Manager SHALL invoke `revokeSession(sessionId)` to revoke all Blob_URLs associated with that session within 3 seconds of download initiation.
3. WHEN a user navigates away from a Tool page or closes the browser tab, THE Memory_Manager SHALL invoke `revokeAll()` to revoke all active Blob_URLs and release all in-memory file references.
4. THE App SHALL NOT persist any file content, file metadata, file names, or processing results to `localStorage`, `sessionStorage`, `IndexedDB`, `Cache API`, or any other browser storage mechanism. The sole exception is the theme preference key `aurora-pdf-theme` in `localStorage`.
5. IF a Processing_Session is interrupted by an error, THEN THE Memory_Manager SHALL invoke `revokeSession(sessionId)` to revoke all Blob_URLs and release all in-memory file references created during that session.
6. THE App SHALL include a visible privacy notice on the home page stating that no files are uploaded and all processing is performed locally in the browser.

---

### Requirement 2: State Management Architecture

**User Story:** As a developer, I want a predictable global state layer, so that UI components remain decoupled from processing logic and state transitions are traceable.

#### Acceptance Criteria

1. THE App SHALL manage all global state using Zustand 5.x, organized into three store slices: `Session_Store`, `Tool_Store`, and `Theme_Store`.
2. THE Session_Store SHALL expose a `status` field typed as `'idle' | 'processing' | 'complete' | 'error'`, a `progress` field typed as a number between 0 and 100 inclusive, and a `sessionId` field typed as a string.
3. THE Tool_Store SHALL persist per-Tool configuration (compression level, OCR language, watermark settings, signature method, split ranges) for the duration of the browser session and SHALL reset to defaults when the user navigates to a different Tool.
4. THE Theme_Store SHALL expose a `theme` field typed as `'light' | 'dark'` and a `toggleTheme()` action. WHEN `toggleTheme()` is called, THE Theme_Store SHALL update `theme` and persist the new value to `localStorage` under the key `aurora-pdf-theme`.
5. WHEN the App initialises, THE Theme_Store SHALL read the `aurora-pdf-theme` key from `localStorage` and set `theme` accordingly. IF the key is absent or invalid, THEN THE Theme_Store SHALL default to `'light'`.
6. THE App SHALL use React 19.2.0 `useTransition` to wrap all File_Processor invocations so that processing work does not block UI interactions (navigation, theme toggle, error dismissal).
7. THE App SHALL use `useOptimistic` to display an optimistic progress state while a React_Action is pending, updating the displayed progress value as the File_Processor emits progress events.

---

### Requirement 3: File Input and Validation

**User Story:** As a user, I want to upload files via drag-and-drop or file picker, so that I can easily select documents for processing.

#### Acceptance Criteria

1. THE App SHALL accept file input via both a drag-and-drop zone and a native file picker dialog on every Tool page.
2. WHEN a user drops or selects a file, THE App SHALL validate the file's MIME type and extension against the accepted formats for the active Tool before initiating processing.
3. IF a user provides a file with an unsupported MIME type or extension, THEN THE App SHALL display a descriptive error message specifying the accepted formats and SHALL NOT proceed with processing.
4. IF a user provides a file exceeding 100 MB, THEN THE App SHALL display a descriptive error message stating the 100 MB size limit and SHALL NOT proceed with processing.
5. WHEN a valid file is selected, THE App SHALL display the file name and file size (formatted in KB or MB) to the user before processing begins.
6. THE App SHALL accept multiple PDF files simultaneously for the Split PDF Tool and SHALL display the count of selected files and their combined size.
7. WHEN a drag operation is in progress over the drop zone, THE App SHALL apply a visual highlight to the drop zone to indicate it is an active drop target.

---

### Requirement 4: PDF Compression

**User Story:** As a user, I want to compress a PDF file, so that I can reduce its file size for easier sharing.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file and initiates compression, THE PDF_Engine SHALL produce a compressed PDF output using client-side image re-sampling and content stream optimization.
2. THE App SHALL offer exactly three compression quality levels — "Low Compression (High Quality)", "Standard Compression", and "High Compression (Lower Quality)" — selectable before processing begins.
3. WHEN compression completes, THE App SHALL display the original file size, the compressed file size, and the percentage reduction, each formatted to two decimal places.
4. WHEN the compressed PDF is ready, THE App SHALL trigger a Download of the output file with a filename of `{original-name}_compressed.pdf`.
5. IF the PDF_Engine determines that the output file is larger than or equal to the input file size, THEN THE App SHALL inform the user that no size reduction was achieved, SHALL still offer the original file for download, and SHALL NOT offer the larger output as the result.
6. THE App SHALL use a React_Action (via `useTransition`) to run compression so that the UI remains interactive during processing.

---

### Requirement 5: OCR — Images to Searchable PDF

**User Story:** As a user, I want to extract text from images and wrap the result into a searchable PDF, so that I can create indexable documents from scanned content.

#### Acceptance Criteria

1. WHEN a user provides one or more image files, THE App SHALL accept JPEG, PNG, TIFF, BMP, and WebP formats and SHALL reject all other formats with a descriptive error message.
2. THE App SHALL allow the user to select the source language for OCR from a list of at least 10 supported Tesseract.js languages before processing begins.
3. WHEN OCR processing is running, THE App SHALL display a progress indicator showing the percentage of images processed (e.g., "Processing image 2 of 5 — 40%"), updated after each image completes.
4. WHEN OCR completes for all images, THE PDF_Engine SHALL assemble the extracted text into a valid, searchable PDF document preserving the input image order.
5. WHEN the output PDF is ready, THE App SHALL trigger a Download with a filename of `ocr-output.pdf`.
6. IF the OCR_Engine detects no text on a given image, THEN THE App SHALL include a blank page in the output PDF for that image and SHALL display a warning listing the image filenames where no text was detected.
7. THE App SHALL use `useOptimistic` to display per-image progress updates while the OCR React_Action is pending.

---

### Requirement 6: PDF to JPG Conversion

**User Story:** As a user, I want to convert PDF pages into high-resolution images, so that I can use individual pages as standalone image files.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE PDF_Engine SHALL render each page as a JPEG image.
2. THE App SHALL allow the user to select a target resolution of either 150 DPI or 300 DPI before processing begins, defaulting to 150 DPI.
3. WHEN conversion completes and the PDF contains more than one page, THE App SHALL package all output JPEG images into a single ZIP archive and trigger a Download with a filename of `{original-name}_pages.zip`.
4. WHEN conversion completes and the PDF contains exactly one page, THE App SHALL trigger a Download of the single JPEG file directly with a filename of `{original-name}_page1.jpg`.
5. WHEN conversion is running, THE App SHALL display a progress indicator showing the number of pages rendered out of the total (e.g., "Rendering page 3 of 10").

---

### Requirement 7: PDF to Word Conversion

**User Story:** As a user, I want to convert a PDF into a Word document, so that I can edit the content in a word processor.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE Conversion_Engine SHALL extract the text content and structure from the PDF and produce a `.docx` output file.
2. WHEN conversion completes, THE App SHALL trigger a Download of the `.docx` file with a filename of `{original-name}.docx`.
3. THE Conversion_Engine SHALL preserve paragraph structure and heading hierarchy (H1–H6) from the source PDF in the output `.docx` file to the extent technically feasible with client-side processing.
4. IF the PDF contains no embedded text layer (i.e., all content is rasterized images), THEN THE App SHALL display a notification informing the user that the PDF appears to be image-based and SHALL suggest using the OCR Tool first. THE App SHALL NOT produce an output file in this case.
5. IF the PDF file is password-protected or encrypted, THEN THE App SHALL display a descriptive error message and SHALL NOT attempt to process the file.

---

### Requirement 8: Word to PDF Conversion

**User Story:** As a user, I want to convert a Word document into a PDF, so that I can share it in a universally readable format.

#### Acceptance Criteria

1. WHEN a user provides a valid `.docx` file, THE Conversion_Engine SHALL use Mammoth.js to parse the document and THE PDF_Engine SHALL render the content into a valid PDF output.
2. WHEN conversion completes, THE App SHALL trigger a Download of the PDF file with a filename of `{original-name}.pdf`.
3. THE Conversion_Engine SHALL preserve bold, italic, underline text formatting, paragraph breaks, and heading levels (H1–H6) from the source `.docx` in the output PDF.
4. IF the `.docx` file is malformed or cannot be parsed by Mammoth.js, THEN THE App SHALL display a descriptive error message identifying the parse failure and SHALL NOT produce a partial output file.
5. THE App SHALL accept only `.docx` files and SHALL reject `.doc` files with a message stating that only the `.docx` format is supported.

---

### Requirement 9: PDF to Excel Conversion

**User Story:** As a user, I want to extract tabular data from a PDF into an Excel spreadsheet, so that I can work with the data in a spreadsheet application.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE Conversion_Engine SHALL extract detected tabular data from the PDF and produce a `.xlsx` output file using SheetJS.
2. WHEN conversion completes, THE App SHALL trigger a Download of the `.xlsx` file with a filename of `{original-name}.xlsx`.
3. WHEN multiple tables are detected across multiple pages, THE Conversion_Engine SHALL place each table on a separate worksheet within the `.xlsx` file, with each worksheet labelled `Page {n} Table {m}` where `n` is the page number and `m` is the table index on that page.
4. IF no tabular data is detected in the PDF, THEN THE App SHALL notify the user that no tables were found and SHALL NOT produce an output file.
5. IF the PDF file is password-protected or encrypted, THEN THE App SHALL display a descriptive error message and SHALL NOT attempt to process the file.

---

### Requirement 10: Excel to PDF Conversion

**User Story:** As a user, I want to convert an Excel spreadsheet into a PDF, so that I can share it in a fixed, print-ready format.

#### Acceptance Criteria

1. WHEN a user provides a valid `.xlsx` or `.xls` file, THE Conversion_Engine SHALL use SheetJS to parse the workbook and THE PDF_Engine SHALL render each worksheet as a separate page in the output PDF.
2. WHEN conversion completes, THE App SHALL trigger a Download of the PDF file with a filename of `{original-name}.pdf`.
3. THE Conversion_Engine SHALL preserve cell values, column headers, and basic grid structure (borders, column widths) in the rendered PDF pages.
4. IF the spreadsheet file is malformed or cannot be parsed by SheetJS, THEN THE App SHALL display a descriptive error message and SHALL NOT produce a partial output file.
5. WHEN the workbook contains more than 10 worksheets, THE App SHALL display a warning informing the user that all worksheets will be included and the output PDF may be large.

---

### Requirement 11: Edit PDF

**User Story:** As a user, I want to make basic text and layout adjustments to a PDF, so that I can correct or update document content without a desktop application.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE App SHALL render a page-by-page preview of the document using the PDF_Engine, displaying all pages as scrollable thumbnails.
2. THE App SHALL allow the user to add new text annotations to any page at a user-specified position, with configurable font size (8pt–144pt) and color.
3. THE App SHALL allow the user to delete one or more pages from the document, with a confirmation prompt before deletion.
4. THE App SHALL allow the user to reorder pages via drag-and-drop within the thumbnail preview interface.
5. THE App SHALL maintain an undo history of at least 10 edit actions within a single Processing_Session, accessible via a visible "Undo" control.
6. WHEN the user confirms edits and initiates export, THE PDF_Engine SHALL produce a new PDF incorporating all applied changes and THE App SHALL trigger a Download with a filename of `{original-name}_edited.pdf`.
7. THE App SHALL use `useTransition` to wrap page rendering so that thumbnail loading does not block user interactions with the edit controls.

---

### Requirement 12: Sign PDF

**User Story:** As a user, I want to add a digital signature overlay to a PDF, so that I can sign documents without printing them.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE App SHALL render a preview of the selected page and allow the user to place a signature overlay at a user-selected position.
2. THE App SHALL support three signature input methods: (a) drawing a signature with mouse or touch input on a canvas element, (b) typing a name rendered in a cursive-style font, and (c) uploading a signature image in PNG or JPEG format.
3. THE App SHALL allow the user to resize and reposition the signature overlay on the page preview before finalizing.
4. THE App SHALL allow the user to select which page of the PDF to sign before placing the signature.
5. WHEN the user confirms the signature placement and initiates export, THE PDF_Engine SHALL embed the signature overlay into the specified page and THE App SHALL trigger a Download with a filename of `{original-name}_signed.pdf`.
6. IF the uploaded signature image exceeds 5 MB, THEN THE App SHALL display an error message stating the 5 MB limit and SHALL NOT proceed with embedding.

---

### Requirement 13: Add Watermark

**User Story:** As a user, I want to add a custom watermark to all pages of a PDF, so that I can brand or protect my documents.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE App SHALL allow the user to configure a text watermark by specifying: text content (1–100 characters), font size (8pt–144pt), opacity (10%–100%), color (via color picker), and rotation angle (0°–360°).
2. THE App SHALL allow the user to choose watermark placement from three options: diagonal (centered across the page), header (top of page), or footer (bottom of page).
3. THE App SHALL render a live preview of the configured watermark on the first page of the PDF, updating within 300ms of any configuration change.
4. WHEN the user confirms the watermark configuration and initiates processing, THE PDF_Engine SHALL apply the watermark to every page of the PDF.
5. WHEN watermarking completes, THE App SHALL trigger a Download with a filename of `{original-name}_watermarked.pdf`.

---

### Requirement 14: Split PDF

**User Story:** As a user, I want to extract specific pages from a PDF into a new file, so that I can share or work with only the relevant portions of a document.

#### Acceptance Criteria

1. WHEN a user provides a valid PDF file, THE App SHALL display the total page count and allow the user to specify a page range using the format `1-3, 5, 7-9` or select individual pages via a visual thumbnail grid.
2. THE App SHALL validate the user-specified page range in real time and display an inline error if any page number exceeds the document's total page count or if the range string does not conform to the expected format.
3. WHEN the user confirms the page selection and initiates splitting, THE PDF_Engine SHALL extract the selected pages and produce a new PDF containing only those pages in the specified order.
4. WHEN splitting completes, THE App SHALL trigger a Download with a filename of `{original-name}_split.pdf`.
5. THE App SHALL allow the user to define multiple named page ranges, each producing a separate output PDF. WHEN multiple ranges are defined, THE App SHALL package all output PDFs into a single ZIP archive with a filename of `{original-name}_split_parts.zip`.

---

### Requirement 15: Processing Progress and Feedback

**User Story:** As a user, I want to see real-time feedback during processing, so that I know the tool is working and how long it will take.

#### Acceptance Criteria

1. WHEN a File_Processor is running, THE App SHALL display a progress bar sourced from `Session_Store.progress` that updates at least every 500ms.
2. WHEN processing completes successfully, THE App SHALL set `Session_Store.status` to `'complete'`, display a success notification, and present the Download button prominently.
3. IF a File_Processor encounters an unrecoverable error, THEN THE App SHALL set `Session_Store.status` to `'error'`, display a descriptive error message identifying the failed operation, and offer the user the option to retry with the same file.
4. WHEN a Download is triggered, THE App SHALL display a confirmation message indicating the file has been saved and that all temporary data has been cleared from memory.
5. THE App SHALL use `useOptimistic` to display an optimistic `Session_Store.progress` value while a React_Action is pending, so the progress bar never appears frozen.

---

### Requirement 16: Navigation and Tool Discovery

**User Story:** As a user, I want to easily browse and navigate between all available tools, so that I can quickly find and use the service I need.

#### Acceptance Criteria

1. THE App SHALL display a home page listing all 11 Tools, each with a name, icon, and a description of no more than 15 words.
2. THE App SHALL provide a navigation structure that allows the user to reach any Tool from any other Tool within two interactions (clicks or taps).
3. THE App SHALL set the browser tab title to `{Tool Name} — AuroraPDF` when a Tool page is active, and to `AuroraPDF — Zero-Server PDF Tools` on the home page.
4. WHEN a user is on a Tool page, THE App SHALL display a breadcrumb navigation element showing `Home > {Tool Name}` that allows the user to return to the home page in one click.
5. THE App SHALL display a persistent navigation bar or sidebar that remains visible while the user is on any Tool page.

---

### Requirement 17: Responsive Layout and Accessibility

**User Story:** As a user, I want to use AuroraPDF on any device, so that I can process documents from my desktop, tablet, or phone.

#### Acceptance Criteria

1. THE App SHALL render correctly and be fully functional on viewport widths from 320px to 2560px without horizontal scrolling.
2. THE App SHALL be styled exclusively using stareezy-ui components and design tokens, with no hardcoded color values in component styles.
3. THE App SHALL support both light and dark color themes, switchable by the user via a visible toggle control, with the preference managed by `Theme_Store` and persisted to `localStorage` under the key `aurora-pdf-theme`.
4. THE App SHALL meet WCAG 2.1 Level AA color contrast requirements for all text and interactive elements in both light and dark themes.
5. ALL interactive elements in THE App SHALL be keyboard-navigable and SHALL have descriptive `aria-label` or `aria-labelledby` attributes.
6. THE App SHALL display a loading skeleton or placeholder while a Tool page's initial assets (PDF preview, thumbnail grid) are being prepared, using React 19.2.0 `<Suspense>` boundaries.
