package com.fincore.BankingManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.CrossOrigin;

@EnableTransactionManagement
@SpringBootApplication
public class BankingManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingManagementApplication.class, args);
	}

}
