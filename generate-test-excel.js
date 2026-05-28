const XLSX = require("xlsx");

// Sample data representing a student's marks or course completion details
const data = [
  ["Certificate Details", "Information"],
  ["Student Name", "Neelu Maurya"],
  ["Course Completed", "Advanced Diploma in Computer Applications (ADCA)"],
  ["Duration", "12 Months"],
  ["Grade Achieved", "A+ (95%)"],
  ["Issue Date", new Date().toLocaleDateString('en-IN')],
  ["Authorized Center", "Srilal Sahaj Janseva Kendra"]
];

// Create a new workbook and add the data
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);

// Adjust column widths for better HTML conversion later
ws['!cols'] = [{ wch: 25 }, { wch: 50 }];

XLSX.utils.book_append_sheet(wb, ws, "CertificateData");

// Save the file
XLSX.writeFile(wb, "Sample_Certificate_Upload.xlsx");
console.log("✅ Successfully created Sample_Certificate_Upload.xlsx in your current folder!");