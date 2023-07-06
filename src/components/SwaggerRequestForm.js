import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Table,
  Checkbox,
  Spin,
} from "antd";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Option } = Select;

const SwaggerRequestForm = ({
  parameters,
  baseUrl,
  verb,
  selectedPath,
  schemas,
}) => {
  const [form] = Form.useForm();
  const [callResponse, setCallResponse] = useState({});
  const [code, setCode] = useState("");
  const [isGenerateCodeChecked, setIsGenerateCode] = useState(false);
  const [isCallApiChecked, setIsCallApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BodyForm = ({ definition }) => {
    const renderFormFields = () => {
      return Object.entries(definition.properties).map(([fieldName, field]) => {
        const { type } = field;
        const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return (
          <Form.Item
            key={fieldName}
            name={fieldName}
            label={label}
            rules={[
              {
                required: true,
                message: `Please enter ${label}`,
              },
            ]}
          >
            {getFieldComponent(type)}
          </Form.Item>
        );
      });
    };

    const getFieldComponent = (type) => {
      switch (type) {
        case "string":
          return <Input />;
        case "number":
          return <Input type="number" />;
        case "boolean":
          return <Input type="checkbox" />;
        // Add more cases for other data types if needed

        default:
          return <Input />;
      }
    };

    return renderFormFields();
  };

  const renderFormItem = (param) => {
    if ((param.in === "formData" || param.in === "body") && param.schema) {
      const schema = param.schema["$ref"].split("/").slice(-1)[0];
      return (
        <BodyForm
          definition={schemas[schema.charAt(0).toUpperCase() + schema.slice(1)]}
        />
      );
    }

    if (param.type === "array") {
      const options =
        param.items && param.items.enum
          ? param.items.enum.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))
          : null;

      return (
        <Form.Item
          name={param.name}
          label={param.name}
          rules={[{ required: true }]}
        >
          <Select mode="multiple">{options}</Select>
        </Form.Item>
      );
    }

    return (
      <Form.Item
        name={param.name}
        label={param.name}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    );
  };

  const createRequestDetails = (parameters, inputs) => {
    const requestDetails = {
      path: {},
      query: {},
      body: {},
    };

    for (let keyInput in inputs) {
      const inputParam = parameters.find((obj) => obj.name === keyInput);
      requestDetails[inputParam.in][keyInput] = inputs[keyInput];
    }
    return requestDetails;
  };

  const createParamString = (url, params) => {
    let paramString = "";

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        if (Array.isArray(params[key])) {
          for (let i = 0; i < params[key].length; i++) {
            if (paramString !== "") {
              paramString += "&";
            }
            paramString += `${encodeURIComponent(key)}=${encodeURIComponent(
              params[key][i]
            )}`;
          }
        } else {
          if (paramString !== "") {
            paramString += "&";
          }
          paramString += `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key]
          )}`;
        }
      }
    }

    return paramString;
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const requestDetails = createRequestDetails(parameters, values);
    const updatedPath = replacePlaholders(selectedPath, values);
    let url = baseUrl + updatedPath;
    const paramString = createParamString(url, requestDetails["query"]);

    if (paramString) {
      url = `${url}?${paramString}`;
    }

    if (isCallApiChecked) {
      const apiResponse = await callAPi(url, verb.toUpperCase());
      setCallResponse(apiResponse);
    }

    if (isGenerateCodeChecked) {
      const requestBody = {
        url,
        verb,
      };
      const apiResponse = await generateCode(requestBody);
      setCode(apiResponse.data.data);
    }
    setIsLoading(false);
  };

  const generateCode = async (body) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-code",
        body
      );
      return response;
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  const replacePlaholders = (str, obj) => {
    if (str.includes("{") && str.includes("}")) {
      const propName = str.match(/\{(.*?)\}/)[1];
      const replacedStr = str.replace(`{${propName}}`, obj[propName]);
      return replacedStr;
    } else {
      return str;
    }
  };

  const callAPi = async (url, method, params = {}, body = {}, headers = {}) => {
    try {
      const response = await axios({
        url,
        method,
        params,
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isObjectEmpty = (obj) => {
    return (
      obj === null || obj === undefined || Object.entries(obj).length === 0
    );
  };

  const showApiCallResults = () => {
    if (!isObjectEmpty(callResponse)) {
      const columns = [
        { title: "Key", dataIndex: "key" },
        { title: "Value", dataIndex: "value" },
      ];

      const dataSource = [];
      Object.keys(callResponse).forEach((key) => {
        const value = callResponse[key];
        // Check if the value is an object or an array to handle nested objects or lists
        if (typeof value === "object") {
          if (Array.isArray(value)) {
            dataSource.push({ key, value: JSON.stringify(value) });
          } else {
            dataSource.push({ key, value: JSON.stringify(value) });
          }
        } else {
          dataSource.push({ key, value });
        }
      });
      return (
        <Table
          columns={columns}
          dataSource={dataSource}
          title={() => "API Response"}
        />
      );
    } else {
      return <div></div>;
    }
  };

  const Code = ({ code }) => {
    return (
      <SyntaxHighlighter language="python" style={solarizedlight}>
        {code}
      </SyntaxHighlighter>
    );
  };

  return (
    <div>
      <Checkbox.Group>
        <Checkbox
          value="generate"
          checked={isGenerateCodeChecked}
          onChange={setIsGenerateCode}
        >
          Generate Code
        </Checkbox>
        <Checkbox
          value="call"
          checked={isCallApiChecked}
          onChange={setIsCallApi}
        >
          Call API
        </Checkbox>
      </Checkbox.Group>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {parameters.map(renderFormItem)}
        <Form.Item>
          <Space size={20}>
            <Button
              type="primary"
              htmlType="submit"
              value="callApi"
              name="submitButton"
            >
              Generate
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {isLoading ? <Spin size="large" /> : showApiCallResults()}
      {code && <Code code={code} />}
    </div>
  );
};

export default SwaggerRequestForm;
