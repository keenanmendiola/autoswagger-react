import React, { useState } from "react";
import { Radio, Input, Button } from "antd";

const SwaggerDocInput = ({
  swaggerUrl,
  handleSwaggerDocUrlChange,
  handleSwaggerDocFormSubmit,
}) => {
  return (
    <form onSubmit={handleSwaggerDocFormSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Input
          placeholder="Enter URL of Swagger Documentation"
          style={{ margin: "7px", width: "300px" }}
          onChange={handleSwaggerDocUrlChange}
          value={swaggerUrl}
        />
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "7px", width: "300px" }}
        >
          Read Swagger Documentation
        </Button>
      </div>
    </form>
  );
};

export default SwaggerDocInput;
