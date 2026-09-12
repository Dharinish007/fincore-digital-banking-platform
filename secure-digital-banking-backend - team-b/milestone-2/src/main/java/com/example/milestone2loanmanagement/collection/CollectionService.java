package com.example.milestone2loanmanagement.collection;

import com.example.milestone2loanmanagement.EMI.EMIEntity;
import com.example.milestone2loanmanagement.EMI.EMIRepo;
import com.example.milestone2loanmanagement.client.DTO.NotificationRequest;
import com.example.milestone2loanmanagement.client.NotificationClient;
import com.example.milestone2loanmanagement.collection.DTO.CollectionResponse;
import com.example.milestone2loanmanagement.collection.DTO.CreateCollectionRequest;
import com.example.milestone2loanmanagement.collection.DTO.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
@Service
public class CollectionService {
    @Autowired
    private CollectionRepo collectionRepo;
    @Autowired
    private EMIRepo emiRepo;
    @Autowired
    private NotificationClient notificationClient;
    public CollectionResponse createCollection(CreateCollectionRequest request) {
        EMIEntity emi=emiRepo.findById(request.getEmiId()).orElseThrow();

        CollectionEntity collection=new CollectionEntity();

        collection.setEmi(emi);
        collection.setAmountCollected(BigDecimal.ZERO);
        collection.setAmountDue(request.getAmountDue());
        collection.setDueDate(request.getDueDate());
        LocalDate today=LocalDate.now();

        if(today.isAfter(request.getDueDate())){
            int daysOverDue= Math.toIntExact(ChronoUnit.DAYS.between(request.getDueDate(), today));
            collection.setDaysOverdue(daysOverDue);
            collection.setStatus("OVERDUE");
        }else{
            collection.setDaysOverdue(0);
            collection.setStatus("PENDING");
        }
        CollectionEntity saved=collectionRepo.save(collection);
        //update the useremail
        notificationClient.sendEmail(new NotificationRequest("useremail","EMI Collection Created",
                "Your EMI collection of " + saved.getAmountDue() +
                        " is due on " + saved.getDueDate()));
        return convertToResponse(saved);
    }

    public CollectionResponse getCollection(Long id) {
        CollectionEntity collection=collectionRepo.findById(id).orElseThrow();
        return convertToResponse(collection);
    }

    public List<CollectionResponse> getCollectionsByLoan(Long loanId) {
        return collectionRepo.findByEmiLoanId(loanId).stream().map(this::convertToResponse).toList();
    }

    public List<CollectionResponse> getOverdueCollections() {
        return collectionRepo.findByStatus("OVERDUE").stream().map(this::convertToResponse).toList();
    }

    public CollectionResponse recordPayment(Long id, PaymentRequest request) {

        CollectionEntity collection = collectionRepo.findById(id)
                .orElseThrow();

        BigDecimal payment = request.getAmount();

        if (payment.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero");
        }

        BigDecimal remaining = collection.getAmountDue()
                .subtract(collection.getAmountCollected());

        if (payment.compareTo(remaining) > 0) {
            throw new RuntimeException("Payment exceeds remaining amount");
        }

        BigDecimal newCollectedAmount = collection.getAmountCollected()
                .add(payment);

        collection.setAmountCollected(newCollectedAmount);

        collection.setCollectionDate(LocalDate.now());

        EMIEntity emi = collection.getEmi();

        String notificationTitle;
        String notificationMessage;

        if (newCollectedAmount.compareTo(collection.getAmountDue()) == 0) {

            collection.setStatus("PAID");

            emi.setAmountPaid(emi.getAmountPaid().add(payment));
            emi.setPaymentDate(LocalDate.now());
            emi.setStatus("PAID");

            notificationTitle = "EMI Payment Successful";

            notificationMessage = "Your EMI payment of ₹" + payment +
                    " has been successfully completed.";

        } else {

            collection.setStatus("PARTIALLY_PAID");

            emi.setAmountPaid(emi.getAmountPaid().add(payment));
            emi.setPaymentDate(LocalDate.now());
            emi.setStatus("PARTIALLY_PAID");

            notificationTitle = "Partial EMI Payment Received";

            notificationMessage = "Your partial EMI payment of ₹" + payment +
                    " has been received. Remaining amount: ₹" +
                    collection.getAmountDue().subtract(newCollectedAmount);
        }

        emiRepo.save(emi);

        CollectionEntity updated = collectionRepo.save(collection);

        // Send notification after successful database update
        notificationClient.sendEmail(new NotificationRequest(
                "user_email",
                notificationTitle,
                notificationMessage)
        );

        return convertToResponse(updated);
    }
    private CollectionResponse convertToResponse(CollectionEntity collection) {

        BigDecimal remainingAmount =
                collection.getAmountDue()
                        .subtract(
                                collection.getAmountCollected());

        return new CollectionResponse(
                collection.getId(),
                collection.getEmi().getLoan().getId(),
                collection.getEmi().getId(),
                collection.getAmountDue(),
                collection.getAmountCollected(),
                remainingAmount,
                collection.getDueDate(),
                collection.getCollectionDate(),
                collection.getDaysOverdue(),
                collection.getStatus()
        );
    }
}
