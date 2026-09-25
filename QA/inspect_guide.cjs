const ExcelJS = require('exceljs');

async function inspectGuide() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('QA_Test_Report_ProResume_Studio.xlsx');

  const guideSheet = wb.getWorksheet('Developer Debugging Guide');
  console.log('--- DEVELOPER DEBUGGING GUIDE ---');
  guideSheet.eachRow((row, rowNumber) => {
    console.log(`Row ${rowNumber}: [${row.getCell(1).value}] [${row.getCell(2).value}] [${row.getCell(4).value}]`);
  });
}

inspectGuide().catch(console.error);
