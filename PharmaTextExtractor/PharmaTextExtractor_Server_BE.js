const { ImageAnnotatorClient } = require('@google-cloud/vision');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios');

// .env 파일에서 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// JSON 데이터를 처리하기 위해 body-parser를 사용
app.use(bodyParser.json());

// Google Cloud Vision API를 사용한 텍스트 추출 함수 정의
async function detectKoreanText(imagePath) {
  try {
    // Google Cloud Vision API 클라이언트 설정
    const client = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // 특정 이미지 파일에 대한 텍스트 추출 (한국어 언어 힌트 포함)
    const [result] = await client.textDetection(imagePath, { imageContext: { languageHints: ['ko'] } });
    const annotations = result.textAnnotations;
    // 추출된 텍스트를 문자열로 결합
    const extractedText = annotations.map((annotation) => annotation.description).join('');

    return extractedText;
  } catch (error) {
    console.error('텍스트 추출 중 오류가 발생했습니다.', error);
    throw error;
  }
}

// 특정 이미지 파일에 대한 텍스트 추출 함수
async function detectKoreanTextForSpecificImage(imagePath) {
  try {
    // 특정 이미지 파일에 대한 텍스트 추출 함수 실행
    const extractedText = await detectKoreanText(imagePath);

    // 추출된 텍스트를 콘솔에 출력
    console.log(`추출된 한글 텍스트 (${path.basename(imagePath)}):`);
    console.log(extractedText);

    // 추출된 텍스트를 백엔드 서버로 전송
    await sendTextToBEServer(extractedText); 
  } catch (error) {
    console.error('텍스트 추출 중 오류 발생.', error);
    throw error;
  }
}

// React Native 앱에서 이미지 URI를 받는 API 엔드포인트
app.post('/process-image', async (req, res) => {
  const { imageUri } = req.body;

  // base64 이미지 데이터를 디코딩하고 이미지 파일로 저장
  const imagePath = path.join(__dirname, 'temp', 'temp_image.jpg');
  const imageBuffer = Buffer.from(imageUri, 'base64');
  fs.writeFileSync(imagePath, imageBuffer);

  // 저장된 이미지에서 텍스트 추출 수행
  await detectKoreanTextForSpecificImage(imagePath);

  res.send({ success: true });
});

// 서버를 지정된 포트에서 실행
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});

// 추출된 텍스트를 백엔드 서버로 전송하는 함수
async function sendTextToBEServer(extractedText) {
  try {
    // 'YOUR_BE_SERVER_ENDPOINT'를 실제 백엔드 서버의 엔드포인트로 교체
    const backendServerEndpoint = 'YOUR_BE_SERVER_ENDPOINT';
    
    // 추출된 텍스트를 백엔드 서버에 POST 요청으로 전송
    await axios.post(backendServerEndpoint, { extractedText });

    console.log('텍스트가 백엔드 서버로 성공적으로 전송되었습니다.');
  } catch (error) {
    console.error('텍스트를 백엔드 서버로 전송 중 오류 발생.', error);
    throw error;
  }
}