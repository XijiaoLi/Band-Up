import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('bands')


def lambda_handler(event, context):
    # TODO implement
    recommandations = getrecommandations()
    
    result = formresult(recommandations)
    
    print(result)
    
    return result
    
def getrecommandations():
    response = table.scan(
        Limit=9
        )
    res = []
    for item in response['Items']:
        res.append(item)

    return res
        
def formresult(res):
    bands = []
    for r in res:
        #print(r)
        b = {
            "band_ID":r['band_ID'],
            "band_name":r['band_name'],
            "picture":r['picture'],
            "songs":r['songs']
        }
        bands.append(b)
    
    result = {
        "recommendations":bands
    }
    
    #print(result)
    return result
    