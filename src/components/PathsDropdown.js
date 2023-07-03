import React from "react";
import { Select } from "antd";
const { Option } = Select;

const PathsDropdown = ({ swaggerJson, handleSelectChange }) => {
  const paths = Object.entries(swaggerJson.paths).map(([path, value]) => ({
    path,
    description: value.description || "",
  }));

  return (
    <Select
      mode="multiple"
      placeholder="Select the API paths you want to call/generate code"
      onChange={handleSelectChange}
    >
      {paths.map((pathObj) => (
        <Option key={pathObj.path} value={pathObj.path}>
          <strong>{pathObj.path}</strong> - {pathObj.description}
        </Option>
      ))}
    </Select>
  );
};

export default PathsDropdown;
