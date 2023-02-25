const readline = require('readline');
const AWS = require('aws-sdk');
const credentials = new AWS.Credentials('removed', 'removed');
const lambda = new AWS.Lambda({ region: 'ap-northeast-1', credentials, apiVersion: '2021-06-10' });


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask() {
  rl.question('> ', async (inputText) => {
    const payload = {
      inputText: inputText
    };

    const params = {
      FunctionName: 'cliLambda',
      Payload: JSON.stringify(payload)
    };

    try {
      const data = await lambda.invoke(params).promise();
      const response = JSON.parse(data.Payload);
      console.log(response.result);
    } catch (err) {
      console.log(err);
    }

    ask();
  });
}

ask();
