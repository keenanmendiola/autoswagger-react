import React, { useState } from "react";
import { Spin, Divider } from "antd";
import { useMutation } from "react-query";

import SwaggerDocInput from "./SwaggerDocInput";
import SwaggerTable from "./SwaggerTable";
import { getSwaggerJsonFile } from "../services/api";

const SwaggerDoc = () => {
  const [swaggerUrl, setSwaggerDocUrl] = useState("");

  const handleSwaggerDocUrlChange = (event) => {
    const value = event.target.value;
    setSwaggerDocUrl(value);
  };

  const { mutate, data, isLoading, isError } = useMutation(getSwaggerJsonFile);

  const handleSwaggerDocFormSubmit = (e) => {
    e.preventDefault();
    const body = {
      swaggerUrl: swaggerUrl,
    };
    mutate(body);
  };

  return (
    <div>
      <SwaggerDocInput
        swaggerUrl={swaggerUrl}
        handleSwaggerDocFormSubmit={handleSwaggerDocFormSubmit}
        handleSwaggerDocUrlChange={handleSwaggerDocUrlChange}
      />
      <Divider plain></Divider>
      {isLoading ? (
        <Spin size="large" />
      ) : isError ? (
        <p>Error occurred while fetching data</p>
      ) : (
        data && <SwaggerTable swaggerData={data} />
      )}
    </div>
  );
};

export default SwaggerDoc;
