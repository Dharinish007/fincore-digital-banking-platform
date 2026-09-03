package com.digitalBanking.documentOCR.parser;

import com.digitalBanking.documentOCR.entity.DocumentOcr;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DocumentFieldParser {

    public void parseFields(String rawText, DocumentOcr document) {

        if (rawText == null || rawText.isBlank()) {
            return;
        }

        // Normalize OCR text
        String text = rawText
                .replace("\r", "")
                .trim();

        // Full Name
        String fullName = extract(
                text,
                "(?i)(?:Full Name|Name)\\s*:?\\s*\\n?\\s*([A-Za-z ]+?)(?:\\s*\\(SAMPLE\\))?\\s*(?:\\n|$)"
        );

        document.setFullName(fullName);

        // Date of Birth
        String dob = extract(
                text,
                "(?i)(?:Date of Birth|DOB)\\s*:?\\s*\\n?\\s*(\\d{2}/\\d{2}/\\d{4})"
        );

        document.setDob(dob);

        // Gender
        String gender = extract(
                text,
                "(?i)(?:Gender\\s*:?\\s*\\n?\\s*)?(Male|Female|Other)"
        );

        document.setGender(gender);

        // Document Number / ID Number
        String documentNumber = extract(
                text,
                "(?i)(?:Document Number|ID Number|ID No)\\s*:?\\s*\\n?\\s*([A-Z0-9 ]+)"
        );

        document.setDocumentNumber(
                documentNumber != null
                        ? documentNumber.trim()
                        : null
        );

        // Address
        String address = extract(
                text,
                "(?i)Address\\s*:?\\s*\\n?\\s*(.+)"
        );

        document.setAddress(
                address != null
                        ? address.trim()
                        : null
        );

        // Issue Date
        String issueDate = extract(
                text,
                "(?i)Issue Date\\s*:?\\s*\\n?\\s*(\\d{2}/\\d{2}/\\d{4})"
        );

        document.setIssueDate(issueDate);

        // Expiry Date
        String expiryDate = extract(
                text,
                "(?i)Expiry Date\\s*:?\\s*\\n?\\s*(\\d{2}/\\d{2}/\\d{4})"
        );

        document.setExpiryDate(expiryDate);
    }

    private String extract(
            String text,
            String regex) {

        Pattern pattern = Pattern.compile(
                regex,
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        return null;
    }
}