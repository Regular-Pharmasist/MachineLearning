const { ImageAnnotatorClient } = require('@google-cloud/vision');
const dotenv = require('dotenv');
const path = require('path');

// .env 파일에서 환경 변수 로드
dotenv.config();

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
    console.log(`추출된 한국어 텍스트 (${path.basename(imagePath)}):`);
    console.log(extractedText);
  } catch (error) {
    console.error('텍스트 추출 중 오류가 발생했습니다.', error);
    throw error;
  }
}

// 특정 이미지 경로 (수정이 필요함)
const specificImagePath = '/Users/kim-yeong-u/Desktop/PharmaTextExtractor/image/284576_1.jpg';

// 특정 이미지에 대한 텍스트 추출 함수 실행
detectKoreanTextForSpecificImage(specificImagePath)
  .catch((error) => {
    console.error('오류:', error);
  });