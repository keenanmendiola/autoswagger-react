import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SecurityDefinitions = ({ swaggerJson, handleSecurityDefinition }) => {
  const securityDefinitions = swaggerJson.securityDefinitions || {};

  return (
    <Select
      placeholder="Select a security definition"
      style={{ width: 500 }}
      onChange={handleSecurityDefinition}
    >
      {Object.keys(securityDefinitions).map((key) => (
        <Option key={key} value={key}>
          {key}
        </Option>
      ))}
    </Select>
  );
};

export default SecurityDefinitions;
