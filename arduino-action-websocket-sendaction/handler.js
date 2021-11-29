'use strict';

const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
const { TABLE_NAME } = process.env;

module.exports.sendAction = async event => {
  let connectionData;
  console.info("EVENT\n" + JSON.stringify(event, null, 2));
  try {
    connectionData = await DDB.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' }).promise();
  } catch (e) {
    console.info("ERROR-CONNECT\n" + JSON.stringify(e, null, 2));
    return { statusCode: 500, body: e.stack };
  }
  
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  
  const postData = JSON.parse(event.body).data;
  
  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
    } catch (e) {
      console.info("ERROR-POST\n" + JSON.stringify(e, null, 2));
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await DDB.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise();
      } else {
        throw e;
      }
    }
  });
  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    console.info("ERROR-SEND\n" + JSON.stringify(e, null, 2));
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
