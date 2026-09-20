package com.fincore.face_match_service.controller;

import com.fincore.face_match_service.dto.FaceMatchResponse;
import com.fincore.face_match_service.service.FaceMatchService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FaceMatchController.class)
class FaceMatchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FaceMatchService faceMatchService;

    @Test
    @DisplayName("POST /api/v1/face-match - multipart face match initiation")
    void testPerformFaceMatch() throws Exception {
        MockMultipartFile doc = new MockMultipartFile("documentImage", "doc.jpg", "image/jpeg", "image1".getBytes());
        MockMultipartFile selfie = new MockMultipartFile("selfieImage", "selfie.jpg", "image/jpeg", "image2".getBytes());

        FaceMatchResponse response = new FaceMatchResponse();
        response.setVerificationId("FM-ABCD1234");
        response.setCustomerId(101L);
        response.setMatchScore(0.95);
        response.setThreshold(0.363);
        response.setMatched(true);
        response.setStatus("MATCHED");
        response.setMessage("Face matched successfully");

        when(faceMatchService.performFaceMatch(any())).thenReturn(response);

        mockMvc.perform(multipart("/api/v1/face-match")
                        .file(doc)
                        .file(selfie)
                        .param("customerId", "101")
                        .param("documentId", "201"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.verificationId").value("FM-ABCD1234"))
                .andExpect(jsonPath("$.customerId").value(101))
                .andExpect(jsonPath("$.matched").value(true));
    }

    @Test
    @DisplayName("GET /api/v1/face-match/{verificationId} - retrieve verification result")
    void testGetVerification() throws Exception {
        FaceMatchResponse response = new FaceMatchResponse();
        response.setVerificationId("FM-ABCD1234");
        response.setCustomerId(101L);
        response.setMatchScore(0.95);
        response.setMatched(true);
        response.setStatus("MATCHED");

        when(faceMatchService.getVerification("FM-ABCD1234")).thenReturn(response);

        mockMvc.perform(get("/api/v1/face-match/FM-ABCD1234"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verificationId").value("FM-ABCD1234"))
                .andExpect(jsonPath("$.status").value("MATCHED"));
    }
}
