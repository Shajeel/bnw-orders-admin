import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface SelectableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  getItemId: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  isItemDisabled?: (item: T) => boolean;
  disabledMessage?: (item: T) => string;
}

function SelectableTable<T>({
  columns,
  data,
  selectedIds,
  onSelectionChange,
  getItemId,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  selectable = true,
  isItemDisabled,
  disabledMessage,
}: SelectableTableProps<T>) {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectableIds = data
        .filter(item => !isItemDisabled?.(item))
        .map(item => getItemId(item));
      onSelectionChange(selectableIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (item: T, checked: boolean) => {
    const itemId = getItemId(item);
    if (checked) {
      onSelectionChange([...selectedIds, itemId]);
    } else {
      onSelectionChange(selectedIds.filter(id => id !== itemId));
    }
  };

  const selectableData = data.filter(item => !isItemDisabled?.(item));
  const allSelectableSelected =
    selectableData.length > 0 &&
    selectableData.every(item => selectedIds.includes(getItemId(item)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={allSelectableSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={selectableData.length === 0}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            const itemId = getItemId(item);
            const isSelected = selectedIds.includes(itemId);
            const disabled = isItemDisabled?.(item);

            return (
              <tr
                key={itemId}
                className={`bg-white border-b ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                } ${onRowClick && !disabled ? 'cursor-pointer' : ''}`}
                onClick={() => !disabled && onRowClick?.(item)}
                title={disabled ? disabledMessage?.(item) : undefined}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => {
                        e.stopPropagation();
                        handleSelectRow(item, e.target.checked);
                      }}
                      onClick={e => e.stopPropagation()}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      disabled={disabled}
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.accessor] || '-')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SelectableTable;
