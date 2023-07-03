from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import streamlit as st
from dotenv import load_dotenv
import os
from langchain import OpenAI, PromptTemplate, HuggingFaceHub
from langchain.agents import AgentType
from langchain.agents.agent_toolkits import create_python_agent
from langchain.tools.python.tool import PythonREPLTool
from langchain.python import PythonREPL
from langchain.agents.agent_types import AgentType
from langchain.chat_models import ChatOpenAI
import openai
import json
import ast
import re
import requests
import pandas as pd

app = Flask(__name__)
CORS(app)

openai.api_key=os.getenv('OPEN_API_KEY')

@app.route('/swagger', methods=['POST'])
def readSwaggerDoc():
    data = request.json
    output = readSwaggerDoc(data["swaggerUrl"])
    url = find_url(output)
    swaggerJson = requests.get(url)
    response = {'data': json.loads(swaggerJson.text)}
    return make_response(jsonify(response), 200)


@app.route('/generate-code', methods=['POST'])
def generateCode():
    data = request.json
    path = data["path"]
    baseUrl = data["path"]
    generatedCode = generateCodeForPath(baseUrl, path)
    response = {'data': generatedCode}
    return make_response(jsonify(response), 200)

def generateCodeForPath(baseUrl, path):
    template = """
            ### System:
            You are a senior back end developer specialising in API integration.
            
            ### User:
            Create a python function to perform a network request based on the contents of the dictionary provided below.
            The first key is the path of the endpoint which you will need to concatenate with the baseUrl provided below.
            The second key is the http verb such as get, post, put, delete. the value of the http verb key are the request details.
            The request details may include a parameters key that contains needed details for the request body, params, query strings.
            The request details also describes what the endpoint will consume and produce, and also the security needed, this can be added to the request headers.
            Do not use the dictionary in the function, extract only the needed values.
            For the security header, add a comment saying 'you can get this value from your environment variables.'
            When displaying the values from the dictionaries provided, use their actual values, not the variable names.
            Answer with the properly formatted python code only.

            ### baseUrl:
            {baseUrl}
            ### Request Dictionary:
            {path}
        """
    
    prompt = PromptTemplate(
        input_variables=["path", "baseUrl"],
        template = template
    )

    final_prompt = prompt.format(path=path, baseUrl=baseUrl)


    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=final_prompt,
        max_tokens=2048, 
        n=1,            
        stop=None,       
        temperature=0  
    )
    code =  response.choices[0].text.strip()
    return code

def readSwaggerDoc(swaggerLink):
    template = """
        ### System:
        Understand, you are a senior back end developer specialising in API integration.
        A swagger documentation provides a list of endpoints and its details such as request body, parameters, queries.

        ### User:
        Analyze the API document in the Swagger URL and answer with the following:
            - the link to the JSON file of the Swagger URL, only return the link of the JSON file.
        It is possible that the JSON file link is written in a different format.
        
        ### URL:
        {URL}
    """
    
    prompt = PromptTemplate(
        input_variables=["URL"],
        template = template
    )

    final_prompt = prompt.format(URL=swaggerLink)

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=final_prompt,
        max_tokens=2048, 
        n=1,            
        stop=None,       
        temperature=0  
    )
    swaggerJsonLink =  response.choices[0].text.strip()
    
    return swaggerJsonLink 

def find_url(string):
    regex = r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
    url = re.search(regex, string)
    
    if url:
        return url.group()
    else:
        return None

if __name__ == '__main__':
    app.run()
