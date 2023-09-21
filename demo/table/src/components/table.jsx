export class Table {
  static convertColumns(columns) {
    let colgroups = [];

    let groupColumns = [];

    let maxLevel = 1;

    const invokeEach = (column, parent) => {
      for (let index = 0; index < columns.length; index++) {
        const { children, ...props } = columns[index];

        groupColumns[level][index] = props;

        const hasChildren = Array.isArray(children) && children.length;
      }
    };

    invokeEach();

    return {
      isGroupHeader: maxLevel > 1,
      colgroups,
      groupColumns,
    };
  }
}
