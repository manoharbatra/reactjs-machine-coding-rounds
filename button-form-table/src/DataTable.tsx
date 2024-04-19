import React from 'react';

interface DataTableProps {
  data: string[][];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <table className="table-container">
      <thead>
        <tr>
          <th>Input 1</th>
          <th>Input 2</th>
          <th>Input 3</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((rowData, index) => (
          <tr key={index}>
            {rowData.map((cellData, cellIndex) => (
              <td key={cellIndex}>{cellData}</td>
            ))}
            <td>
              <button onClick={() => onEdit(index)}>Edit</button>
              <button onClick={() => onDelete(index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
