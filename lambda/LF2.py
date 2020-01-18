import json
import datetime
import time
import os
import re
import boto3
from botocore.vendored import requests
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    

    session_attributes = event['sessionAttributes'] if event['sessionAttributes'] is not None else {}
    slots = event["currentIntent"]["slots"]
    source = event["invocationSource"]
    style = event['currentIntent']['slots']['style']
    city = event['currentIntent']['slots']['city']
    instru = event['currentIntent']['slots']['instru']
    keywords = []
    keywords.append(style)
    keywords.append(city)
    keywords.append(instru)

    
    print(event)
    
    if source == 'DialogCodeHook':
        return delegate(session_attributes, slots)

    #keywords = ['math-rock', 'New York', 'guitar']
    
    results = searchBand(keywords)
    #results = ['shit','fuck','dame']
    print("results:->",results)
    res = ""
    if len(results) > 0:
        res = "Band names are:\n"
        
        for r in results:
            res += r
            res += ',\n'
    else:
        res = "Sorry, no band found"
    
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': res
            }
        }
    }
    
def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }
    
def searchBand(keywords):
    
    #host = 'vpc-photos-um6blvqixup6knzqyrqiji4zoa.us-east-1.es.amazonaws.com'
    host = 'search-bands-rrdxgwmdnc4xz6ea7mouqyca5u.us-east-1.es.amazonaws.com'
    index = 'bands'
    ES_URL = 'https://' + host + '/' + index + '/_search'
    headers = {'Content-Type': 'application/json'}
    names = []
    temp = []
    i = 0
    for k in keywords:
        t = []
        data = {}
        if i == 0:
            data = {
                'size': 10,
                'query': {
                    'match': {
                        'genre':k
                    }
                }
            }
        
        if i == 1:
            data = {
                'size': 10,
                'query': {
                    'match': {
                        'location':k
                    }
                }
            }
        
        if i == 2:
            data = {
                'size': 10,
                'query': {
                    'match': {
                        'instruments':k
                    }
                }
            }
        i += 1
        d = json.dumps(data)
        res = requests.get(url = ES_URL, data = d, headers = headers)
        response = res.json()
        print(response)
        for hit in response['hits']['hits']:
            print(hit)
            name = hit['_source']['band_name']
            t.append(name)
        temp.append(t)
        print("temp->:",t)
    
    for t in temp[0]:
        if t in temp[1] and t in temp[2]:
            names.append(t)
    
    return names
   