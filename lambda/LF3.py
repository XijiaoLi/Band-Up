import json
import boto3

sqs = boto3.client('sqs')
sns = boto3.client('sns')

queue_url = 'https://sqs.us-east-1.amazonaws.com/494413724691/SQS_FP'

def lambda_handler(event, context):
    # TODO implement
    
    query,handle = getonefromSQS()
    
    if query != None:
        print(query)
        query_js = json.loads(query)
        sendtoSNS(query_js, handle)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def getonefromSQS():
    
    response = sqs.receive_message(
        QueueUrl=queue_url,
        AttributeNames=[
            'SentTimestamp'
        ],
        MaxNumberOfMessages=1,
        MessageAttributeNames=[
            'All'
        ],
        VisibilityTimeout=0,
        WaitTimeSeconds=0
    )
    
    #print(response.keys())
    
    if 'Messages' not in response.keys():
        return None, None
    message = response['Messages'][0]
    receipt_handle = message['ReceiptHandle']
    
    return message['Body'], receipt_handle
    
    
def sendtoSNS(query, handle):
    phonenumber = query['BDContact']
    name = query['Name']
    contact = query['Contact']
    intro = query['Introduction']
    content = name + ' is asking to join your band.' + ' The introduction is:' + intro + ' Contact:' + contact
    print(content)
    response = sns.publish(
        PhoneNumber=phonenumber,
        Message=content,
    )
    
    print(response)
    
    response = sqs.delete_message(
        QueueUrl=queue_url,
        ReceiptHandle=handle
    )
    
    print(response)