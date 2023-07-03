import React, { useState } from "react";
import ApiDocInput from "./ApiDocInput";

const ApiDoc = () => {
  const [context, setContext] = useState("");
  const [docUrl, setDocUrl] = useState("");

  const handleContextChange = (event) => {
    const value = event.target.value;
    setContext(value);
  };

  const handleDocUrlChange = (event) => {
    const value = event.target.value;
    setDocUrl(value);
  };

  const handleApiDocFormSubmit = () => {};

  return (
    <ApiDocInput
      context={context}
      docUrl={docUrl}
      handleContextChange={handleContextChange}
      handleDocUrlChange={handleDocUrlChange}
      handleApiDocFormSubmit={handleApiDocFormSubmit}
    />
  );
};

export default ApiDoc;
