package com.e106.reco.global.s3;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3FileService {
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadThumbnail(MultipartFile file){
        String fileName = createThumbnailFileName(file.getOriginalFilename());
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(file.getContentType());

        try (InputStream inputStream = file.getInputStream();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            Thumbnailator.createThumbnail(inputStream, bos, ThumbnailSize.WIDTH, ThumbnailSize.HEIGHT);
            byte[] thumbnailBytes = bos.toByteArray();
            // 여기 메타데이터 넣을 때, 리사이징된걸 넣어야지 아니면 오류 뜸
            objectMetadata.setContentLength(thumbnailBytes.length);

            amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, new ByteArrayInputStream(thumbnailBytes), objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (IOException e) {
            // todo : 적당한 에러 던지기 : 파일 업로드 에러 같은걸로
            throw new RuntimeException(e);
        }

        return fileName;
    }

    public String uploadFile(MultipartFile file){
        String fileName = createFileName(file.getOriginalFilename());
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(file.getSize());
        objectMetadata.setContentType(file.getContentType());

        try (InputStream inputStream = file.getInputStream()) {
            amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (IOException e) {
            // todo : 적당하 에러 던지기 : 파일 업로드 에러 같은걸로
            throw new RuntimeException(e);
        }

        return fileName;
    }

    public List<String> uploadFiles(List<MultipartFile> files){
        List<String> fileNameList = new ArrayList<>();

        files.forEach(file -> {
            String fileName = createFileName(file.getOriginalFilename());
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(file.getSize());
            objectMetadata.setContentType(file.getContentType());

            try(InputStream inputStream = file.getInputStream()){
                amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetadata)
                        .withCannedAcl(CannedAccessControlList.PublicRead));
            } catch (IOException e) {
                // todo : 여기도 적당한 에러 터트리기 : 파일업로드 에러 같은걸로
                throw new RuntimeException(e);
            }

            fileNameList.add(fileName);
        });

        // 임마는 DB에 저장해놓으면 됨.
        return fileNameList;
    }

    public void deleteFile(String fileName) {
        amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }

    public void deleteFiles(List<String> fileNameList) {
        fileNameList.forEach(fileName -> {
            amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileName));
        });
    }

    private String createFileName(String fileName) {
        return UUID.randomUUID().toString().concat(getFileExtension(fileName));
    }

    private String createThumbnailFileName(String originalFileName) {
        int dotIndex = originalFileName.lastIndexOf(".");
        String extension = dotIndex > 0 ? originalFileName.substring(dotIndex) : "";
        return "thumbnail_" + UUID.randomUUID().toString() + extension;
    }

    private String getFileExtension(String fileName) {
        if (fileName.length() == 0) {
            // todo: 대충 에러던지기 : 파일 이름이 이상함.
        }
        ArrayList<String> fileValidate = new ArrayList<>();
        fileValidate.add(".jpg");
        fileValidate.add(".jpeg");
        fileValidate.add(".png");
        fileValidate.add(".JPG");
        fileValidate.add(".JPEG");
        fileValidate.add(".PNG");
        fileValidate.add(".mp3");
        fileValidate.add(".mkv");
        fileValidate.add(".mp4");
        fileValidate.add(".wav");

        String idxFileName = fileName.substring(fileName.lastIndexOf("."));
        if(!fileValidate.contains(idxFileName)){
            // todo : 여기도 대충 에러 던지기 : 형식이 맞지않음
        }
        return idxFileName;
    }

    public String getFile(String fileName){
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    public List<String> getFiles(List<String> fileNameList){
        List<String> fileUrlList = new ArrayList<>();

        fileNameList.forEach(fileName -> {
            String fileUrl = amazonS3Client.getUrl(bucket, fileName).toString();
            fileUrlList.add(fileUrl);
        });

        return fileUrlList;
    }
}