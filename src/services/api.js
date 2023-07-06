import axios from "axios";

export const getSwaggerJsonFile = async (body) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/swagger", body);
    return response;
  } catch (e) {
    console.log("ERROR", e);
  }
};

export const generateCode = async (body) => {
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
