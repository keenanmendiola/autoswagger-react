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

openai.api_key="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"

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