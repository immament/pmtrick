import { singleton } from 'tsyringe';

import { CheckboxItem } from './checkboxItem.model';

@singleton()
export class CheckBoxItems {
    checked(items: CheckboxItem[], { name, checked }: { name: string; checked: boolean }): CheckboxItem[] {
        return items.map((column) => {
            if (column.name == name) {
                column.isChecked = checked;
            }
            return column;
        });
    }

    getUnchecked(items: CheckboxItem[]): string[] {
        return items.filter((item) => !item.isChecked).map((col) => col.name);
    }

    getChecked(items: CheckboxItem[]): string[] {
        return items.filter((item) => item.isChecked).map((col) => col.name);
    }
}
