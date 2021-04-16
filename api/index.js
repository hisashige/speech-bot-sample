const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// ①Dialogflowのクライアントライブラリをインポート
const dialogflow = require('@google-cloud/dialogflow');

const app = express()
app.use(bodyParser.json())
app.use(cors())

// detectIntentがGETメソッドで呼び出せることを定義
app.get('/detectIntent', async (req, res) => {
    const sessionClient = new dialogflow.SessionsClient();
    // ②req.query.sessionIdはDialogflowのセッションID
    // 'PROJECT ID'は自分のDialogflowのプロジェクトIDで置換する
    const sessionPath = sessionClient.projectAgentSessionPath('PROJECT ID', req.query.sessionId);

    // ③パラメータとしてrequestオブジェクトを生成
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.query.inputMessage,
                languageCode: 'ja-JP',
            },
        },
    };

    // ④Dialogflowへ、インテントを特定しにいく
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.send({
        // Dialogflowから取得した返事の文字列を返却
        fulfillmentText: result.fulfillmentText
    })
})

app.listen(process.env.PORT || 3000)