import React, { useState, useEffect } from "react";
import { Table, Select, Divider, Button } from "antd";
import SecurityDefinitions from "./SecurityDefinitions";
import PathsDropdown from "./PathsDropdown";
import { useQuery, getQueryData } from "react-query";
import { generateCode } from "../services/api";

import { Collapse } from "antd";
const { Panel } = Collapse;

const { Option } = Select;

const columns = [
  {
    title: "Path",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "HTTP Verb",
    dataIndex: "verb",
    key: "verb",
  },
];

const SwaggerTable = ({ swaggerData }) => {
  const [securityDefinition, setSecurityDefinition] = useState("");
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [isGenerateCodeButtonClicked, setIsGenerateCodeButtonClicked] =
    useState(false);

  const swagger = swaggerData.data.data;
  const dataSource = Object.entries(swagger.paths).map(
    ([path, pathDetails]) => ({
      path,
      verb: Object.keys(pathDetails)[0],
      ...pathDetails[Object.keys(pathDetails)[0]],
    })
  );

  const handleSecurityDefinition = (value) => {
    setSecurityDefinition(value);
  };

  const handleSelectChange = (value) => {
    setSelectedPaths(value);
  };

  // const usePathData = (baseUrl, path) => {
  //   return useQuery(`pathData-${path}`, async () => {
  //     const body = {
  //       path,
  //       baseUrl,
  //     };
  //     const response = await generateCode(body);

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     return response.json();
  //   });
  // };

  useEffect(() => {
    if (isGenerateCodeButtonClicked && selectedPaths.length > 0) {
      const fetchData = async () => {
        try {
          const requests = selectedPaths.map((path) => {
            const swaggerPathObj = swagger.paths[path];
            const baseUrl = "https://petstore.swagger.io/v2/pet";

            const body = {
              path: swaggerPathObj,
              baseUrl,
            };
            return generateCode(body);
          });

          const responses = await Promise.all(requests);

          console.log("data", responses);

          //setstate here
        } catch (e) {
          console.error("Error:", e.message);
        }
      };
      fetchData();
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
      }}
    >
      <Collapse style={{ margin: 7 }}>
        <Panel header="API Endpoints Table" key="1">
          <Table
            dataSource={dataSource}
            columns={columns}
            borderedscroll={{ x: "max-content" }}
          />
        </Panel>
      </Collapse>
      <Divider plain></Divider>
      <div
        style={{
          margin: 7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        <SecurityDefinitions
          swaggerJson={swagger}
          handleSecurityDefinition={handleSecurityDefinition}
        />
      </div>
      <div
        style={{
          margin: 7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        <PathsDropdown
          swaggerJson={swagger}
          handleSelectChange={handleSelectChange}
        />
      </div>
      <div
        style={{
          margin: 7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => setIsGenerateCodeButtonClicked(true)}
        >
          Generate Code for Selected Paths
        </Button>
      </div>
    </div>
  );
};

export default SwaggerTable;
