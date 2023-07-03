import React, { useState } from "react";
import { Radio, Input, Button } from "antd";

const Options = ({ handleRadioChange }) => {
  return (
    <Radio.Group onChange={handleRadioChange}>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          margin: 10,
        }}
      >
        <Radio value="apiDoc">Read API Documentation</Radio>
        <br />
        <Radio value="swaggerDoc">Read Swagger Document from URL</Radio>
      </div>
    </Radio.Group>
  );
};

export default Options;
