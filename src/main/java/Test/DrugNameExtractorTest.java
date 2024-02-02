package Test;

import com.google.cloud.vision.v1.*;
import com.google.cloud.vision.v1.Feature.Type;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DrugNameExtractorTest {

    public static void main(String[] args) throws IOException {
        // Google Cloud Vision API를 사용하기 위한 자격 증명 파일 경로 설정
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "/Users/kim-yeong-u/Desktop/GitHub/ML/medicinetextextractor-bef0089593ce.json");

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            // 이미지 파일 경로로 교체
            String imagePath = "/Users/kim-yeong-u/Desktop/GitHub/image/test_img.png";

            // 이미지 파일 읽기
            byte[] data = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(imagePath));
            Image image = Image.newBuilder().setContent(com.google.protobuf.ByteString.copyFrom(data)).build();

            // 텍스트 감지를 위한 기능 설정
            Feature feature = Feature.newBuilder().setType(Type.TEXT_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feature).setImage(image)
                    .build();

            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            // 이미지 처리 요청 및 응답 받기
            BatchAnnotateImagesResponse responses = vision.batchAnnotateImages(requests);

            // 유일한 약물 이름을 저장하기 위한 리스트
            List<String> uniqueDrugNames = new ArrayList<>();

            // 약물 이름 처리 및 결과 리스트 반환
            for (AnnotateImageResponse response : responses.getResponsesList()) {
                String description = response.getTextAnnotationsList().get(0).getDescription();
                String[] words = description.split("\\s+");

                for (String word : words) {
                    // 밀리그램 변경
                    word = replaceMgPlaceholder(word);

                    if (isDesiredWord(word) && !uniqueDrugNames.contains(word)) {
                        uniqueDrugNames.add(word);
                    }
                }
            }

            // 유일한 약물 이름 출력 또는 사용
            for (String drugName : uniqueDrugNames) {
                System.out.println(drugName);
            }
        }
    }

    private static boolean isDesiredWord(String word) {
        // 파싱 단어 조건
        // 차후 상세 변동 요망
        return (word.contains("정") || word.contains("캡슐") || word.contains("필름") || word.contains("캅셀") || word.contains("시럽"))
                && !word.contains("정보") && !word.contains("정제") && !word.contains("캅셀제") && !word.contains("시럽제") && !word.contains("코팅정");
    }

    private static String replaceMgPlaceholder(String word) {
        // 밀리그램 변경
        return word.replaceAll("mg", "밀리그램");
    }

    private static MultipartFile getYourMultipartFile() {
        // MultipartFile 특정 로직
        return null;
    }
}
