package com.e106.reco.global.alarm.service;

import com.e106.reco.global.alarm.dto.FcmSendDto;
import com.e106.reco.global.common.CommonResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * FCM 서비스를 처리하는 구현체
 *
 */
@Service
@Slf4j
public class FcmService {

    /**
     * 푸시 메시지 처리를 수행하는 비즈니스 로직
     *
     * @param fcmSendDto 모바일에서 전달받은 Object
     * @return 성공(1), 실패(0)
     */
    public CommonResponse sendMessageTo(FcmSendDto fcmSendDto){



        String response = "0";

        try {
            Message message = makeMessage(fcmSendDto);
            response = FirebaseMessaging.getInstance().send(message);
            log.info("Response : {}", response);
        }catch (IOException e){
            throw new RuntimeException(e);
        }
        catch (FirebaseMessagingException e) {
            log.info("failed to send message: {}", e.getMessage());
            throw new RuntimeException(e);
        }

        return new CommonResponse("ok");
    }


    /**
     * FCM 전송 정보를 기반으로 메시지를 구성합니다. (Object -> Message)
     *
     * @param fcmSendDto FcmSendDto
     * @return Message
     */
    private Message makeMessage(FcmSendDto fcmSendDto) throws JsonProcessingException {
        return Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(fcmSendDto.getTitle())
                        .setBody(fcmSendDto.getBody()).build()
                )
                .setToken(fcmSendDto.getToken())
                .build();
    }
}