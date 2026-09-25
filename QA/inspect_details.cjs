const ExcelJS = require('exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('QA_Test_Report_ProResume_Studio.xlsx');

  // Defect Log
  const defectSheet = wb.getWorksheet('Defect Log & Bug Tracker');
  console.log('--- DEFECT LOG HEADERS (Row 1) ---');
  const headers = [];
  defectSheet.getRow(1).eachCell((cell, colNumber) => {
    headers.push({ colNumber, val: cell.value });
  });
  console.log(headers);

  console.log('--- DEFECT LOG ROWS ---');
  defectSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      console.log(`Row ${rowNumber}: [Col 1: ${row.getCell(1).value}] [Col 5: ${row.getCell(5).value}] [Col 11: ${row.getCell(11).value}]`);
    }
  });

  // Executive Summary
  const execSheet = wb.getWorksheet('QA Executive Summary');
  console.log('--- EXEC SUMMARY ROWS ---');
  execSheet.eachRow((row, rowNumber) => {
    const vals = [];
    row.eachCell((cell) => vals.push(cell.value));
    console.log(`Row ${rowNumber}:`, vals.join(' | '));
  });
}

inspect().catch(console.error);
