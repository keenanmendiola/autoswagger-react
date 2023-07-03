import React, { useState } from "react";
import { Radio, Input, Button } from "antd";

const ApiDocInput = ({
  handleDocUrlChange,
  handleContextChange,
  handleApiDocFormSubmit,
  context,
  docUrl,
}) => {
  return (
    <form onSubmit={handleApiDocFormSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Input
          placeholder="Enter context"
          style={{ margin: "7px", width: "300px" }}
          onChange={handleContextChange}
          value={context}
        />
        <Input
          placeholder="Enter URL of API Documentation"
          style={{ margin: "7px", width: "300px" }}
          onChange={handleDocUrlChange}
          value={docUrl}
        />
        <Button type="primary" htmlType="submit" style={{ margin: "7px" }}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default ApiDocInput;
