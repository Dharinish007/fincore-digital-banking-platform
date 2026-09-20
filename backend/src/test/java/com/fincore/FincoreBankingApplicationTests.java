package com.fincore;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("h2")
class FincoreBankingApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring context initializes with all unified components
    }
}
