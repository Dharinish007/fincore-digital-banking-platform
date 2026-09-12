package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.enums.PaymentMode;
import org.springframework.stereotype.Component;

@Component
public class PaymentProcessorFactory {

    private final ImpsProcessor impsProcessor;
    private final NeftProcessor neftProcessor;
    private final UpiProcessor upiProcessor;

    public PaymentProcessorFactory(
            ImpsProcessor impsProcessor,
            NeftProcessor neftProcessor,
            UpiProcessor upiProcessor) {

        this.impsProcessor = impsProcessor;
        this.neftProcessor = neftProcessor;
        this.upiProcessor = upiProcessor;
    }

    public PaymentProcessor getProcessor(PaymentMode paymentMode) {

        return switch (paymentMode) {

            case IMPS -> impsProcessor;

            case NEFT -> neftProcessor;

            case UPI -> upiProcessor;
        };
    }
}