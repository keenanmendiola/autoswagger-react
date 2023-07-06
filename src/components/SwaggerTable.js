import React, { useState, useEffect } from "react";
import { Table, Divider, Spin } from "antd";
import SecurityDefinitions from "./SecurityDefinitions";
import PathsDropdown from "./PathsDropdown";
import { useQuery } from "react-query";
import { generateCode } from "../services/api";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import SwaggerRequestForm from "./SwaggerRequestForm";

import { Collapse } from "antd";
import { extractPathsFromSwagger } from "../utils/swagger";
import axios from "axios";
import { findUrl } from "../utils/url";
const { Panel } = Collapse;

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

const Code = ({ code }) => {
  return (
    <SyntaxHighlighter language="python" style={solarizedlight}>
      {code}
    </SyntaxHighlighter>
  );
};

const SwaggerRequestForms = ({ selectedPaths, paths, baseUrl, schemas }) => {
  return (
    <>
      {selectedPaths.map((path) => {
        const [verb, selectedPath] = path.split(":");
        const pathDetails = paths.find(
          (obj) => obj.path === selectedPath && obj.verb === verb
        );
        return (
          <div key={path}>
            <h3>{path}</h3>
            <SwaggerRequestForm
              parameters={pathDetails.object.parameters}
              baseUrl={baseUrl}
              verb={verb}
              selectedPath={selectedPath}
              schemas={schemas}
            />
          </div>
        );
      })}
    </>
  );
};

const SwaggerTable = ({ swaggerData }) => {
  const [swagger, setSwagger] = useState({});
  const [securityDefinition, setSecurityDefinition] = useState("");
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [isGenerateCodeButtonClicked, setIsGenerateCodeButtonClicked] =
    useState(false);
  const [paths, setPaths] = useState({});
  const [dataSource, setDataSource] = useState({});

  const [securityDefinitionInput, setSecurityDefinitionInput] = useState("");

  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(swaggerData.data.data);
        setSwagger(response.data);
        setPaths(extractPathsFromSwagger(response.data));
        setDataSource(
          Object.entries(response.data.paths).map(([path, pathDetails]) => ({
            path,
            verb: Object.keys(pathDetails)[0],
            ...pathDetails[Object.keys(pathDetails)[0]],
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSecurityDefinition = (value) => {
    setSecurityDefinition(value);
    if (
      value.toLowerCase().includes("api") ||
      value.toLowerCase().includes("key")
    ) {
      setSecurityDefinitionInput("apikey");
      // show api key input
    }

    if (
      value.toLowerCase().includes("basic") ||
      value.toLowerCase().includes("jwt")
    ) {
      setSecurityDefinitionInput("basic");
    }

    if (
      value.toLowerCase().includes("oauth2") ||
      value.toLowerCase().includes("auth0")
    ) {
      setSecurityDefinitionInput("auth0");
    }
  };

  const showSecurityDefinitionInput = () => {
    switch (securityDefinitionInput) {
      case "basic": // find login
      case "apikey": //show apikey input
      case "auth0": //show auth0 config inputs
    }
  };

  const findLogin = () => {};

  const handleSelectChange = (value) => {
    setSelectedPaths(value);
  };

  useEffect(() => {
    if (isGenerateCodeButtonClicked && selectedPaths.length > 0) {
      const fetchData = async () => {
        try {
          const requests = selectedPaths.map((path) => {
            const [verb, selectedPath] = path.split(":");
            const swaggerPathObj = paths.find(
              (obj) => obj.path === selectedPath && obj.verb === verb
            );
            const baseUrl = "https://petstore.swagger.io/v2/pet";
            const body = {
              path: swaggerPathObj.object,
              baseUrl,
            };
            return generateCode(body);
          });
          const responses = await Promise.all(requests);
          const codes = responses.map((data) => {
            return data.data.data;
          });
          setCodes(codes);
        } catch (e) {
          console.error("Error:", e.message);
        }
      };
      fetchData();
    }
  }, [isGenerateCodeButtonClicked]);

  const baseUrlQuery = useQuery("baseUrl", () =>
    axios
      .post("http://127.0.0.1:5000/get-base-url", {
        swaggerJson: "https://petstore.swagger.io/v2/swagger.json",
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.log("error", error))
  );

  if (baseUrlQuery.isLoading) {
    return <Spin size="large" />;
  }

  if (baseUrlQuery.error) {
    return <div>Unable to get base URL</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
      }}
    >
      {swagger && (
        <>
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
            <PathsDropdown
              swaggerJson={swagger}
              handleSelectChange={handleSelectChange}
              paths={paths}
            />
          </div>
          <div
            style={{
              margin: 7,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          ></div>
          <div
            style={{
              margin: 7,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
            <SwaggerRequestForms
              selectedPaths={selectedPaths}
              paths={paths}
              schemas={swagger["definitions"]}
              baseUrl={findUrl(baseUrlQuery.data.data.baseUrl)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SwaggerTable;
