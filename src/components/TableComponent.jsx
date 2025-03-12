import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Chip, Avatar, Checkbox, Radio } from "@mui/material";
import tableSchema from "../data/tableSchema.json";
import tableData from "../data/tableData.json";
import { debounce } from "lodash";

const TableComponent = () => {
  const [data, setData] = useState(tableData);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const filterData = debounce(() => {
      setData(
        tableData.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
      );
    }, 300);

    filterData();
    return () => filterData.cancel();
  }, [search]);

  const toggleRowSelection = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const updateRadioSelection = (rowId, value) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, selectedOption: value } : row))
    );
  };

  const columns = [
    {
      id: "checkbox",
      header: () => (
        <Checkbox
          checked={selectedRows.length === data.length && data.length > 0}
          onChange={() =>
            setSelectedRows(selectedRows.length === data.length ? [] : data.map(({ id }) => id))
          }
        />
      ),
      Cell: ({ row }) => (
        <Checkbox checked={selectedRows.includes(row.id)} onChange={() => toggleRowSelection(row.id)} />
      ),
      enableSorting: false,
      enableGlobalFilter: false,
      enableColumnActions: false,
      size: 50,
    },
    ...tableSchema.map((col) => ({
      accessorKey: col.id,
      header: col.header,
      Cell: ({ cell }) => {
        if (col.type === "badge") {
          return <Chip label={cell.getValue()} sx={{ backgroundColor: "#2196f3", color: "white" }} />;
        }
        if (col.type === "tags") {
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              {cell.getValue().map((tag, index) => (
                <Chip key={index} label={tag} color="primary" />
              ))}
            </Box>
          );
        }
        if (col.id === "name") {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={cell.row.original.avatar} />
              <span>{cell.getValue()}</span>
            </Box>
          );
        }
        return cell.getValue();
      },
    })),
    {
      id: "radioOptions",
      header: "Options",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0 }}>
          <Radio
            name={`option-${row.id}`}
            checked={row.original.selectedOption === "option1"}
            onChange={() => updateRadioSelection(row.id, "option1")}
          />
          <Radio
            name={`option-${row.id}`}
            checked={row.original.selectedOption === "option2"}
            onChange={() => updateRadioSelection(row.id, "option2")}
          />
        </Box>
      ),
      size: 10,
      enableSorting: false,
      enableGlobalFilter: false,
    },
  ];

  return (
    <Box sx={{ overflowX: "auto" }}>
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination
        enableSorting
        enableGlobalFilter={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
      />
    </Box>
  );
};

export default TableComponent;