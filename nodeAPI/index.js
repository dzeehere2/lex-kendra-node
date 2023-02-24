const AWS = require('aws-sdk');
const express = require('express');
const app = express();
AWS.config.update({
  accessKeyId: 'AKIA4TIO7YG5NTRZYU25',
  secretAccessKey: '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',
  region: 'ap-northeast-1'
});
const lambda = new AWS.Lambda();

app.get('/bot', async (req, res) => {
  try {
    const paramValue = req.query.question;
    const payload = { inputText: paramValue };
    const result = await lambda.invoke({
      FunctionName: 'cliLambda',
      Payload: JSON.stringify(payload),
    }).promise();

    const response = JSON.parse(result.Payload);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
