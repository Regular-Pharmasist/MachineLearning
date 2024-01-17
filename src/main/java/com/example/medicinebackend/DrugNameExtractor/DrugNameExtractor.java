package com.example.medicinebackend.DrugNameExtractor;

import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesRequest;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.ImageSource;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Feature.Type;

import org.springframework.web.multipart.MultipartFile;


import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DrugNameExtractor {
    public static void main(String[] args) throws IOException {
        // Google Cloud Vision API 사용을 위한 자격 증명 파일 경로 설정
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "/Users/kim-yeong-u/Desktop/GitHub/pharmatextextractor-406403-ac4b89667f2a.json");

        // MultipartFile 로드
        MultipartFile multipartFile = getYourMultipartFile();

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            // MultipartFile에서 이미지 데이터 읽기
            byte[] data = multipartFile.getBytes();
            Image image = Image.newBuilder().setContent(com.google.protobuf.ByteString.copyFrom(data)).build();

            // 텍스트 감지를 위한 특징 설정
            Feature feature = Feature.newBuilder().setType(Type.TEXT_DETECTION).build();
            AnnotateImageRequest request =
                    AnnotateImageRequest.newBuilder().addFeatures(feature).setImage(image).build();

            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            // 이미지 처리 요청 및 응답 받기
            BatchAnnotateImagesResponse responses = vision.batchAnnotateImages(requests);

            // 약물 이름 처리 및 결과 리스트 반환
            List<String> drugNames = new ArrayList<>();
            for (AnnotateImageResponse response : responses.getResponsesList()) {
                String[] words = response.getTextAnnotationsList().get(0).getDescription().split("\\s+");
                for (String word : words) {
                    if (isDesiredWord(word)) {
                        drugNames.add(word);
                    }
                }
            }
        }
    }

    private static boolean isDesiredWord(String word) {
        // 파싱 단어 조건
        // 차후 상세 변동 요망
        return (word.contains("정") || word.contains("캡슐") || word.contains("필름") || word.contains("캅셀") || word.contains("시럽"))
                && !word.contains("정보") && !word.contains("정제") && !word.contains("캅셀제")&& !word.contains("시럽제");
    }

    private static MultipartFile getYourMultipartFile() {
        // MultipartFile 구체적인 로직
        return null;
    }
}