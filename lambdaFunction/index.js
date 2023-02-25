const AWS = require('aws-sdk');
const lexv2 = new AWS.LexRuntimeV2({ region: 'ap-northeast-1' , apiVersion: '2021-06-10' });

exports.handler = async (event) => {
  const inputText = event.inputText;
  const botId = 'removed';
  const botAliasId = 'removed';
  
  const params = {
    botAliasId: botAliasId,
    botId: botId,
    localeId: 'en_US',
    sessionId: 'my-session-id',
    text: inputText
  };
  
  try {
    const response = await lexv2.recognizeText(params).promise();
    const message = response.messages[0].content;
	switch (message) {
		case "FallbackIntent":
			const kendra = new AWS.Kendra({
                region: 'ap-northeast-1'
            });

            const params = {
                IndexId: 'c564cbdf-fa1d-4361-89c3-7eee45e907ad', 
                QueryText: inputText
            };

            try {
                const result = await kendra.query(params).promise();
                const answer = result.ResultItems[0].DocumentExcerpt.Text;
				return { result: answer }
            } catch (error) {
                console.log(error);
				return { result: "Can't find an answer to that" }
            }
		
		default:
			return { result: message };
	}
  } catch (err) {
    console.log(err);
    return { message: 'Error: ' + err.message };
  }
};