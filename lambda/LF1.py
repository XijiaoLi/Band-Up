import json
import time
import boto3

client = boto3.client('lex-runtime')

def lambda_handler(event, context):
    # TODO implement
    
    print(event)
    
    sentence = get_sentence(event)
    
    lex_response = client.post_text(
        botName = 'FP_BOT',
        botAlias = 'koko',
        userId = 'zikws0gm3wjwahuun80r7c0psquzufb2',
        inputText = sentence
    )
    
    print(lex_response)
    
    return {'messages':lex_response['message']}
    
    '''
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    '''

def get_sentence(event):
    #don't know what kind of the event yet
    inputText = event['messages'][0]['unstructured']['text']
    print(inputText)
    return inputText