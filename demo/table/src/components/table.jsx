import { set } from "lodash";

export class Table {
  static convertColumns(cloneColumns) {
    let groupColumns = [];

    let maxLevel = 1;

    const invokeEach = (columns, parent = {}) => {
      const { $level = 0 } = parent;

      for (let index = 0; index < columns.length; index++) {
        const { children, ...props } = columns[index];

        props.$level = $level + 1;

        maxLevel = Math.max(maxLevel, props.$level);

        set(groupColumns, `[${$level}][${index}]`, props);

        const hasChildren = Array.isArray(children) && children.length;

        if (hasChildren) {
          invokeEach(children, props);
        }
      }
    };

    invokeEach(cloneColumns);

    return groupColumns;
  }
}
