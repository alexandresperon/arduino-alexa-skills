'use strict';
const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

module.exports.onConnect = async event => {
  console.log("Iniciando conexão");
  console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
  console.info("EVENT\n" + JSON.stringify(event, null, 2));

  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await DDB.put(putParams).promise();
  } catch (err) {
    console.log("ERROR: " + JSON.stringify(err, null, 2));
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
