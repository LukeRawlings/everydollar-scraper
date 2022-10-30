const fs = require('fs');
const DomParser = require('dom-parser');
const ExactMath = require('exact-math');


console.log("Now starting scraper script");
var parser = new DomParser();                                           // Initialize dom parser
const fileContents = fs.readFileSync('./EveryDollar.htm').toString()    // Read file to string
const dom = parser.parseFromString(fileContents);                       // Parse string to dom object
const array = [["Budget Item", "Amount Remaining"]];                    // Declare array

const budgetItemRows = dom.getElementsByClassName("BudgetItemRow--remainingAllocationPreview"); // Get the elements I'm interested in
console.log(`budgetItemRows has ${budgetItemRows.length} elements.`);
let totalRemaining = "0";

for(let i = 0; i < budgetItemRows.length; i++) { // Loop through each budget item
    const row = budgetItemRows[i];
    let label = "";
    let value = "";

    const labelElement = row.getElementsByClassName("BudgetItem-label")[0];     // Get the label
    const moneyInteger = row.getElementsByClassName("money-integer")[0];        // Get amount remaining
    const moneyFractional = row.getElementsByClassName("money-fractional")[0];
    

    if(!moneyInteger) {
        console.log(`[${i}] skipping because moneyInteger object is: ${moneyInteger}`);
        continue;
    }
    if(!moneyFractional) {
        console.log(`[${i}] skipping because moneyFractional object is: ${moneyFractional}`);
        continue;
    }
    if(!labelElement) {
        console.log(`[${i}] skipping because labelElement object is: ${labelElement}`);
        continue;
    }

    value = `${moneyInteger.innerHTML}.${moneyFractional.innerHTML}`; // Get the value
    value = value.replace(/,/g, '');

    try {
        ExactMath.add(totalRemaining, value);
    } catch (e) {
        console.log(`[${i}] Failed to add value: ${value} which may not be a number. Error: ${e}`);
        continue;
    }

    for(const attribute of labelElement.attributes) {
        if(attribute.name === 'data-text')
            label = attribute.value;  // Get the label
    }    

    totalRemaining = ExactMath.add(totalRemaining, value);

    console.log(`[${i}] ${label} remaining: ${value}. totalRemaining is now: ${totalRemaining}`);
    array.push([label, value]);
}
console.log(`End of loop. totalRemaining: ${totalRemaining}`);
array.push(["Total",totalRemaining]);

// Build csv from the nested array and write to file
const csvStr = buildCsvStr(array);
const filename = `everydollar-remaining-${Date.now()}.csv`;
fs.writeFileSync(filename, csvStr);
console.log(`csv output written to ${filename}`);
console.log("End of scraper script");



function buildCsvStr(array) { 
    let str = "";
    for(const innerArray of array) {
        for(let i = 0; i<innerArray.length; i++) {
            str = str + innerArray[i];
            if((i+1)<innerArray.length)
                str = str + ","
        }
        str = str + "\n";
    }
    return str;
}