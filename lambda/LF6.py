import json
import boto3

sqs = boto3.client('sqs')

queue_url = 'https://sqs.us-east-1.amazonaws.com/494413724691/SQS_FP'

def lambda_handler(event, context):
    # TODO implement
    
    print(event)
    
    sendToSQS(event)
    
    return {
        "status":"Sucessfully Send Request!"
    }
    
def getname(event):
    return event['name']
    
def getcontact(event):
    return event['contact_info']
    
def getintro(event):
    return event['introduction']
    
def getbdcontact(event):
    return event['band_contact']['phone']
    
def sendToSQS(event):
    name = getname(event)
    contact = getcontact(event)
    intro = getintro(event)
    bandcontact = getbdcontact(event)
    if '+' not in bandcontact:
        bandcontact = "+1"+bandcontact
    
    query = {
        'Name':name,
        'Contact':contact,
        'Introduction':intro,
        'BDContact':bandcontact
    }
    
    query_str = json.dumps(query)
    print(query_str)
    
    response = sqs.send_message(
        QueueUrl=queue_url,
        DelaySeconds=1,
        MessageAttributes={
        },
        MessageBody=(
            query_str
        )
    )
    
    print(response['MessageId'])
