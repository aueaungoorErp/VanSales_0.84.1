package com.bplus.bluetooth.finder.library.utils;

import com.bplus.bluetooth.finder.library.model.BaseErrorResponse;
import com.bplus.bluetooth.finder.library.model.BaseResponse;

public class ResponseBuilder {
    public static BaseResponse Success(Object o){
        BaseResponse b = new BaseResponse();
        b.setResponseData(o);
        b.setIsSuccess(true);
        return b;
    }

    public static  BaseResponse Success(){
        BaseErrorResponse b = new BaseErrorResponse();
        b.setMsg("Complete");
        b.setIsSuccess(true);
        BaseResponse o = new BaseResponse();
        o.setIsSuccess(true);
        o.setResponseData(b);
        return o;
    }


    public static  BaseResponse Error(String msg){
        BaseErrorResponse b = new BaseErrorResponse();
        b.setMsg(msg);
        b.setIsSuccess(false);
        BaseResponse o = new BaseResponse();
        o.setIsSuccess(false);
        o.setResponseData(b);
        return o;
    }
}
