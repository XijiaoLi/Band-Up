import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('bands')

def lambda_handler(event, context):
    print(event)
    id = event['band_ID']
    raw_info = get_raw_info(table, id)
    info = raw_info[0]
    return info
    
    
def get_raw_info(table, id):
    response = table.query(
    KeyConditionExpression=Key('band_ID').eq(id)
    )
    items = response['Items']
    return items
