import React from "react";
import { Select, MenuItem, Checkbox, TextField } from "@mui/material";

const Filters = ({ setSearch, selectedRoles = [], setSelectedRoles }) => {
  const roles = ["Engineer", "Manager", "Designer"];

  return (
    <div>
      <TextField
        label="Search Name"
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select
        multiple
        value={selectedRoles || []}
        onChange={(event) => setSelectedRoles(event.target.value)}
        renderValue={(selected) => selected.join(", ")}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            <Checkbox checked={selectedRoles?.includes(role) || false} /> {role}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default Filters;
