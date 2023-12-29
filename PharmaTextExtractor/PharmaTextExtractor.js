const { ImageAnnotatorClient } = require('@google-cloud/vision');
const path = require('path');

// Google Cloud Vision API를 사용한 텍스트 추출 함수 정의
async function detectKoreanText(imagePath) {
  try {
    // Google Cloud Vision API 클라이언트 설정
    const client = new ImageAnnotatorClient({
      credentials: {
        type: 'service_account',
        project_id: 'pharmatextextractor-406403',
        private_key_id: 'ac4b89667f2a76c015f7120c4d45a46027834aad',
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCr76JtHFXwyYDS\nFi2gu7JB5z5owsf0ofgo6De4tDsrBM9erJd0qjwdG1tdGdcqWKYBQ0Ikj9Ruwe+Z\neohDtyfneWyoD16WwKozxY+woBXjnq9jwvMD1GXDOiLToKShRy3GtjX1xSz/TOLQ\nJKFRqiOeQdg6PU9V0tNjOgeoUtr1vQineRxniRkdpKWPwkqQK4UzhnIeEOLMXEMi\nrv+KfN2t/nkQ0BCRYTXT57Dkiy0gQU9Tg19mwVN2zonXYYVPR2LKKk+vGw6JDx4g\nedz+SDfT4X0sdblWOepjWsJTtapeFF5t9vSohhIcVLxO+JQp4Ru/ISunToPaQARM\nB0kyAVGzAgMBAAECggEAB+lBUILuw2MKLeB+Xfh09cpVmU1pFO0E9aDlu3ZziIGy\npvkLCP+yP2acWBbRyy2ECefV2cfSbvw2cZntPixlxiVUphD6+bXIvxQWjfp3t178\nU/tK4kC6I/b/Vjx8hr03Mn780Z+ud9rKTuh4kcDh3azK7bcXeOv39QddBdY2I/to\n1bSETYmUpdgvBkDbHskcfZKOCyr5fUOM8JsUkrUlYxkQt2HcSGZMxjD2j+1fD95q\ns8R7iktndgFTzziTI/LJu06LELE1JlZZWsBUE2ZgmXyZ4eF3srHdBLQDn42fh/5M\n+6N+rirvjw0+BHK6dOB06N8rME1nBknMjEp8Gd5YaQKBgQDjO5hhTfEmdW5LKpMu\n/Xa/o84ELmJZZaejNWsd/lA5w+jsn7GnRLi8CynVScSeXxyajgmVDpYEkUQWuU+M\n9Oq8YdoPP4fL+vzisYpZYwfX1bNJMSWO7OQUa0Iu2E2V86QOPkcUunX2XwqkqVxu\ny/HkbdfxAgWN4jQy41V+C3JZOQKBgQDBs+xyFf7TFSWDPCXHr2GCTyd2PK4Dlj5D\nogv2cxyhLVMnzbt+tpmE/bIe73a3Dx74Pz3UIFAsWiljaGfEm5EvP+w20p/LnRkB\n6J3cLLj3y9IlVsHq+zi9xLtgXqYWkhlMVCazQvKhcxu75upicJOBZxjrOqZGWRiG\nDqkvl/CeSwKBgBV+UpiJndDMdMVJXqioMu5HmToOBSF9mxC2Ac7Relcsb8DKDizL\nNEodKDTTiHSOfI8l9kQSICCIeQ9JMfwcQoPVIaIlmTuzHu52aqav1lMVFKNMscfG\nIoDH8Her4BLZ+9+ZBnIwfO3z6XbPyj10rwmzViSm002rYtKZbEHC5WsJAoGAGdsW\neLQO68Yq17WzpU/3yBkgv1uiLsBjV0vOJPuAmtMeAnYnzOY639GtcQut4QmXrLNk\nYWhey0zNsYNCNrA9VP1HXpoG0nsJ14Nhbv5ZQlpmlq1Z/S/DhzE3gcmgieq+jb29\n3LfXA04GKbLNHo7AYcmNPfj6MPG7oElctAmoCLkCgYB3s4L4sHnr0g9MeIgkTPQU\nX3AQ0GCh2KUMf2PnBA/i7GM7Af4YbT1ODnbOhMberk/EpLM8GCfKepbUH4NCgcl7\njFfpBBYtZduGAyI3b7XW0i0q+ybS9vQMPCPeFRtW9EBIf8GWQJz1csv5iBj2eQHl\nffC5uWy+KCev7gKljC7yZg==\n-----END PRIVATE KEY-----\n',
        client_email: '202926035528-compute@developer.gserviceaccount.com',
        client_id: '117143644480797097266',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/202926035528-compute%40developer.gserviceaccount.com',
        universe_domain: 'googleapis.com',
      },
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
