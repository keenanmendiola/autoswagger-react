import React from "react";
import { Tabs } from "antd";

import ApiDoc from "./ApiDoc";
import SwaggerDoc from "./SwaggerDoc";

const { TabPane } = Tabs;

const UrlInput = () => {
  const handleTabChange = (key) => {};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",

        margin: 20,
      }}
    >
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane tab="Swagger Documentation" key="1">
          <SwaggerDoc />
        </TabPane>
        <TabPane tab="API Documentation" key="2">
          <ApiDoc />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UrlInput;
