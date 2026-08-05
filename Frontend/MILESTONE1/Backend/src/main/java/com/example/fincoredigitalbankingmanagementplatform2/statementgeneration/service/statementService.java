package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.service;

import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.DTO.statementRequestDTO;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.userEntity;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo.accountRepo;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo.userRepo;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity.transactionEntity;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.repo.transactionRepo;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.NonNull;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.List;

@Service
public class statementService {
    @Autowired
    private transactionRepo repo;
    @Autowired
    private accountRepo accountRepo;
    @Autowired
    private userRepo userRepo;

    public List<transactionEntity> getStatement(String email, statementRequestDTO dto) {
        userEntity customer=userRepo.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("user not found"));
        accountEntity user=accountRepo.findByAccountNumberAndCustomerId(
                        dto.getAccountNumber(),
                        customer.getCustomerId())
                .orElseThrow(() -> new BadCredentialsException("Account not found"));
        return repo.findBysenderAccountNumberAndTransactionDateBetween(user,dto.getStartDate(),dto.getEndDate());
    }

    public ByteArrayInputStream downloadPDF(String email, statementRequestDTO dto) {

        List<transactionEntity> statement=getStatement(email,dto);
        Document document=new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(document, out);

            document.open();

            document.add(new Paragraph("Account Statement"));
            document.add(new Paragraph(" "));

            PdfPTable table = getPdfPTable(statement);

            document.add(table);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return new ByteArrayInputStream(out.toByteArray());

    }
    //create pdf in table form
    private static @NonNull PdfPTable getPdfPTable(List<transactionEntity> statement) {
        PdfPTable table = new PdfPTable(5);
        table.addCell("Date");
        table.addCell("ID");
        table.addCell("Paid to/Received from");
        table.addCell("Type");
        table.addCell("Amount");


        for (transactionEntity t : statement) {
            table.addCell(t.getTransactionDate().toString());
            table.addCell(String.valueOf(t.getTransactionId()));
            table.addCell(t.getTransactionType());
            table.addCell(String.valueOf(t.getAmount()));


        }
        return table;
    }
}