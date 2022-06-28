/** @format */

const onEdit = (event: GoogleAppsScript.Events.SheetsOnEdit) => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeCell = ss.getActiveCell();
  if (activeCell.getColumn() == 5 && ss.getActiveSheet().getName() == "Web") {
    const newValue = event.value;
    const oldValue = event.oldValue;
    if (!event.value) {
      activeCell.setValue("");
    } else {
      if (!event.oldValue) {
        activeCell.setValue(newValue);
      } else {
        activeCell.setValue(oldValue + ", " + newValue);
      }
    }
  }
};
