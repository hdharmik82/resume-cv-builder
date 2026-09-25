const ExcelJS = require('exceljs');

async function inspectTraceability() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('QA_Test_Report_ProResume_Studio.xlsx');

  const tmSheet = wb.getWorksheet('Traceability Matrix');
  console.log('--- TRACEABILITY MATRIX ---');
  tmSheet.eachRow((row, rowNumber) => {
    const vals = [];
    row.eachCell((cell) => vals.push(cell.value));
    console.log(`Row ${rowNumber}:`, vals.join(' | '));
  });
}

inspectTraceability().catch(console.error);
