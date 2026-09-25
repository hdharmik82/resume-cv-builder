const ExcelJS = require('exceljs');

async function validate() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/hdhar/Projects/resume-cv-builder/QA_Test_Report_ProResume_Studio.xlsx');
  console.log('--- WORKBOOK VALIDATION ---');
  wb.worksheets.forEach((ws, idx) => {
    console.log(`Sheet [${idx + 1}]: "${ws.name}"`);
    console.log(`  - Tab Color: ${ws.properties?.tabColor?.argb || 'Default'}`);
    console.log(`  - Show Gridlines: ${ws.views?.[0]?.showGridLines}`);
    console.log(`  - Frozen Panes (ySplit): ${ws.views?.[0]?.ySplit || 0}`);
    console.log(`  - AutoFilter: ${ws.autoFilter || 'None'}`);
    console.log(`  - Total Rows: ${ws.rowCount}`);
  });

  const tcSheet = wb.getWorksheet('Test Cases Matrix');
  let nonWrappedCount = 0;
  tcSheet.eachRow((r, rowIdx) => {
    if (rowIdx > 1) {
      r.eachCell((c) => {
        if (!c.alignment?.wrapText) nonWrappedCount++;
      });
    }
  });
  console.log(`Test Cases Matrix: non-wrapped cells across all data rows = ${nonWrappedCount}`);
}

validate().catch(console.error);
