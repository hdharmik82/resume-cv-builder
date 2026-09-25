const ExcelJS = require('exceljs');

async function inspectTestCases() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('QA_Test_Report_ProResume_Studio.xlsx');

  const tcSheet = wb.getWorksheet('Test Cases Matrix');
  console.log('--- FAILED OR BLOCKED TEST CASES ---');
  tcSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const tcId = row.getCell(1).value;
      const status = row.getCell(9).value;
      const linkedDefect = row.getCell(11).value;
      if (status !== 'Pass') {
        console.log(`Row ${rowNumber}: [${tcId}] Status: "${status}" Linked: "${linkedDefect}"`);
      }
    }
  });
}

inspectTestCases().catch(console.error);
