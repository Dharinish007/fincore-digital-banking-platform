package com.digitalBanking.liveness.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LivenessResponse {

    private boolean success;

    private String requestId;

    private String timestamp;

    private LivenessResultData data;

    private ErrorData error;


    public LivenessResponse() {
    }


    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }


    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }


    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }


    public LivenessResultData getData() {
        return data;
    }

    public void setData(LivenessResultData data) {
        this.data = data;
    }


    public ErrorData getError() {
        return error;
    }

    public void setError(ErrorData error) {
        this.error = error;
    }


    // ========================================================
    // ERROR DATA
    // ========================================================

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ErrorData {

        private String code;

        private String message;

        private Object details;


        public ErrorData() {
        }


        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }


        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }


        public Object getDetails() {
            return details;
        }

        public void setDetails(Object details) {
            this.details = details;
        }
    }
}