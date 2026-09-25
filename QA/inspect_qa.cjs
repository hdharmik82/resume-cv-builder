const xlsx = require('xlsx');
const wb = xlsx.readFile('QA_Test_Report_ProResume_Studio.xlsx');
console.log('Sheet names:', wb.SheetNames);
wb.SheetNames.forEach(name => {
  const data = xlsx.utils.sheet_to_json(wb.Sheets[name]);
  console.log('\n=== SHEET: ' + name + ' (rows: ' + data.length + ') ===');
  if (data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
    console.log('First 2 rows:', JSON.stringify(data.slice(0, 2), null, 2));
  }
});
