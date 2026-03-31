package com.bplus.bluetooth.finder.library.model;

public class BaseResponse extends Response {
    String errorCode ;
    Object responseData;

    public String getErrorCode() {
        return errorCode;
    }
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    public Object getResponseData() {
        return responseData;
    }
    public void setResponseData(Object responseData) {
        this.responseData = responseData;
    }
}
