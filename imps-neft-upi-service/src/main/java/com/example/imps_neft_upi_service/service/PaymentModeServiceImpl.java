package com.example.imps_neft_upi_service.service;

import com.example.imps_neft_upi_service.dto.PaymentModeRequest;
import com.example.imps_neft_upi_service.dto.PaymentModeResponse;
import org.springframework.stereotype.Service;

@Service
public class PaymentModeServiceImpl implements PaymentModeService {

    private final PaymentProcessorFactory paymentProcessorFactory;

    public PaymentModeServiceImpl(
            PaymentProcessorFactory paymentProcessorFactory) {

        this.paymentProcessorFactory = paymentProcessorFactory;
    }

    @Override
    public PaymentModeResponse processPayment(
            PaymentModeRequest request) {

        // Select IMPS / NEFT / UPI processor
        PaymentProcessor processor =
                paymentProcessorFactory.getProcessor(
                        request.getPaymentMode());

        // Process the payment using the selected mode
        return processor.process(request);
    }
}