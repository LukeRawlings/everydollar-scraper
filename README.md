# EveryDollar Scraper

Totals the 'Remaining' column from the [EveryDollar](https://www.ramseysolutions.com/ramseyplus/everydollar) budgeting web app. 

## Input
An html file of EveryDollar's budgeting tool.

## Output
A csv of each budget item's remaining amount, with a total at the end.

## Example console

```
Now starting scraper script
budgetItemRows has 5 elements.
[0] Rent: 1000.00. totalRemaining is now: 1000
[1] Grocery: 0.00. totalRemaining is now: 1000
[2] Utilities: 11.00 totalRemaining is now: 1011
[3] Transportation: 15.50. totalRemaining is now: 1026.50
[4] Savings: 3000. totalRemaining is now: 4026.50
End of loop. totalRemaining: 4026.50
csv output written to everydollar-remaining-1667158846401.csv
End of scraper script
```