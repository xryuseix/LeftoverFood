const onEdit = (e:any) => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeCell = ss.getActiveCell();
  if (activeCell.getColumn() == 5 && ss.getActiveSheet().getName() == "Web") {
    const newValue = e.value;
    const oldValue = e.oldValue;
    if (!e.value) {
      activeCell.setValue("");
    } else {
      if (!e.oldValue) {
        activeCell.setValue(newValue);
      } else {
        activeCell.setValue(oldValue + ', ' + newValue);
      }
    }
  }
}