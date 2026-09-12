package com.fincore.face_match_service.service;

import com.fincore.face_match_service.dto.FaceMatchRequest;
import com.fincore.face_match_service.dto.FaceMatchResponse;
import com.fincore.face_match_service.entity.FaceMatch;
import com.fincore.face_match_service.enums.FaceMatchStatus;
import com.fincore.face_match_service.repository.FaceMatchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FaceMatchServiceTest {

    @Mock
    private FaceMatchRepository faceMatchRepository;

    @Mock
    private FaceMatchEngine faceMatchEngine;

    @InjectMocks
    private FaceMatchServiceImpl faceMatchService;

    private MockMultipartFile docFile;
    private MockMultipartFile selfieFile;

    @BeforeEach
    void setUp() {
        docFile = new MockMultipartFile(
                "documentImage", "doc.jpg", "image/jpeg", "dummy_doc_content".getBytes()
        );
        selfieFile = new MockMultipartFile(
                "selfieImage", "selfie.jpg", "image/jpeg", "dummy_selfie_content".getBytes()
        );
    }

    @Test
    @DisplayName("performFaceMatch - successful match above threshold")
    void testPerformFaceMatchSuccess() {
        FaceMatchRequest request = new FaceMatchRequest();
        request.setCustomerId(100L);
        request.setDocumentId(200L);
        request.setDocumentImage(docFile);
        request.setSelfieImage(selfieFile);

        when(faceMatchEngine.compareFaces(any(), any())).thenReturn(0.85);
        when(faceMatchRepository.save(any(FaceMatch.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FaceMatchResponse response = faceMatchService.performFaceMatch(request);

        assertNotNull(response);
        assertEquals(100L, response.getCustomerId());
        assertEquals(0.85, response.getMatchScore());
        assertTrue(response.isMatched());
        assertEquals(FaceMatchStatus.MATCHED.name(), response.getStatus());

        verify(faceMatchRepository, times(1)).save(any(FaceMatch.class));
    }

    @Test
    @DisplayName("performFaceMatch - not matched when below threshold")
    void testPerformFaceMatchBelowThreshold() {
        FaceMatchRequest request = new FaceMatchRequest();
        request.setCustomerId(100L);
        request.setDocumentId(200L);
        request.setDocumentImage(docFile);
        request.setSelfieImage(selfieFile);

        when(faceMatchEngine.compareFaces(any(), any())).thenReturn(0.20);
        when(faceMatchRepository.save(any(FaceMatch.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FaceMatchResponse response = faceMatchService.performFaceMatch(request);

        assertNotNull(response);
        assertEquals(0.20, response.getMatchScore());
        assertFalse(response.isMatched());
        assertEquals(FaceMatchStatus.NOT_MATCHED.name(), response.getStatus());
    }

    @Test
    @DisplayName("getVerification - returns response when verificationId exists")
    void testGetVerificationFound() {
        FaceMatch faceMatch = new FaceMatch();
        faceMatch.setVerificationId("FM-12345678");
        faceMatch.setCustomerId(100L);
        faceMatch.setMatchScore(0.90);
        faceMatch.setThreshold(0.363);
        faceMatch.setMatched(true);
        faceMatch.setStatus(FaceMatchStatus.MATCHED);

        when(faceMatchRepository.findByVerificationId("FM-12345678")).thenReturn(Optional.of(faceMatch));

        FaceMatchResponse response = faceMatchService.getVerification("FM-12345678");

        assertNotNull(response);
        assertEquals("FM-12345678", response.getVerificationId());
        assertTrue(response.isMatched());
    }
}
