import json
import boto3
import string
from botocore.vendored import requests

def lambda_handler(event, context):

    print("the event is:",event)
    print("the context is:",context)
   
    words_list = get_words_list(event)
    print("keywords:",words_list)
    
    band_list = elastic_search(words_list)
    print(band_list)
    
    res = form_json(band_list)
    print(res)
    
    return res

    
def get_words_list(event):
    stopwords = set([])
    inputText = event['query']
    print(inputText)
    words = set(inputText.split()) - stopwords
    print(words)
    words = [w.strip(string.punctuation) for w in words]
    return words
    
def form_json(ID_list):
    res = []
    for b in ID_list:
        r = {
            "band_ID":b['band_ID'],
            "band_name":b['band_name'],
            "picture":b['picture'],
            "location":b['location'],
            "genre":b['genre'],
            "instruments":b['instruments']
        }
        res.append(r)
    return {
        "bands": res
    }
    
# TO-DO
def elastic_search(keywords):
    host = 'search-bands-rrdxgwmdnc4xz6ea7mouqyca5u.us-east-1.es.amazonaws.com'
    index = 'bands'
    ES_URL = 'https://' + host + '/' + index + '/_search'
    headers = {'Content-Type': 'application/json'}
    results = []
    for k in keywords:
        data = {
            'size': 10,
            'query': {
                'multi_match': {
                    'query':k,
                    'fields': [ 'genre', 'band_name', 'instruments' ]
                }
            }
        }
        d = json.dumps(data)
        res = requests.get(url = ES_URL, data = d, headers = headers)
        response = res.json()
        print(response)
        for hit in response['hits']['hits']:
            print(hit)
            newres = hit['_source']
            if newres not in results:
                results.append(newres)
        
    return results
  