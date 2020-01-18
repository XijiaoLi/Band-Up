import json
import boto3
import secrets
import string
import time
import uuid
from botocore.vendored import requests

dynamodb = boto3.resource('dynamodb')
host = 'https://search-bands-rrdxgwmdnc4xz6ea7mouqyca5u.us-east-1.es.amazonaws.com'
index = 'bands'
type = '_doc'
url = host + '/' + index + '/' + type
headers = { "Content-Type": "application/json" }

def lambda_handler(event, context):
    
    print(event)
    band_ID = storeBandInfo(event)
    if band_ID == "fail":
        return {
            'status': "Fail",
            'band_ID': ""
        }
    return {
        'status': "OK",
        'band_ID': band_ID
    }
    
def storeBandInfo(event):
    print(event)
    band_name = event['band_name']
    contact_info = event['contact_info']
    # discography  = event['discography']
    genre = event['genre']
    # homepage_url = event['band_name']
    location = event['location']
    picture = event['picture']
    songs = event['songs']
    year_formed = event['year_formed']
    description = event['description']
    instruments = event['instruments']
    
    band_ID = str(uuid.uuid1())
    tags = [band_name, genre]
    print("band_ID:  " + band_ID)

    band_table = dynamodb.Table('bands')
    try:
        band_table.put_item(
            Item = {
                "band_ID": band_ID,
                "band_name": band_name,
                "contact_info": contact_info,
                "genre": genre,
                "location": location,
                "picture": picture,
                "songs": songs,
                "year_formed": year_formed,
                "instruments": instruments,
                "description": description
                
            }
        )
        
        message = {
            'band_ID': band_ID,
            'band_name': band_name,
            'genre': genre,
            'instruments': instruments,
            'location': location,
            "picture": picture
        }
        message = json.dumps(message, indent=2)
        r = requests.post(url, data=message, headers=headers)
        print(r)
    except Exception as e:
        print('Exception: ', e)
        return "fail"
    return band_ID

