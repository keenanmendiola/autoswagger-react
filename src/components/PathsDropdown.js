import React from "react";
import { Select } from "antd";
const { Option } = Select;

const PathsDropdown = ({ handleSelectChange, paths }) => {
  return (
    <Select
      mode="multiple"
      placeholder="Select the API paths you want to call/generate code"
      onChange={handleSelectChange}
    >
      {paths.map((path, index) => (
        <Option key={index} value={`${path.verb}:${path.path}`}>
          <strong>{path.path}</strong> - {path.object.summary}
        </Option>
      ))}
    </Select>
  );
};

export default PathsDropdown;
