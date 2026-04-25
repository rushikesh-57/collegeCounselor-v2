import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useMemo } from 'react';

export default function DataGrid({ rows, height = '62vh', getRowStyle }) {
  const columnDefs = useMemo(() => {
    if (!rows?.length) return [];
    const seen = new Set();
    return Object.keys(rows[0])
      .filter((key) => !seen.has(key.toLowerCase()) && seen.add(key.toLowerCase()))
      .map((key) => ({
        field: key,
        headerName: key.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
        filter: true,
        floatingFilter: true,
        resizable: true,
        minWidth: key.includes('college') ? 260 : key.includes('branch') ? 220 : 145,
      }));
  }, [rows]);

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height, minHeight: 360 }}>
      <AgGridReact
        rowData={rows}
        columnDefs={columnDefs}
        getRowStyle={getRowStyle}
        defaultColDef={{ suppressMovable: true, filter: true, floatingFilter: true }}
        alwaysShowHorizontalScroll
      />
    </div>
  );
}
