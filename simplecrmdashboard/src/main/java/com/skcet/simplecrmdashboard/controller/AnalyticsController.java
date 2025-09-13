package com.skcet.simplecrmdashboard.controller;

import org.springframework.web.bind.annotation.*;
import com.skcet.simplecrmdashboard.repository.CustomerRepository;

import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final CustomerRepository customerRepo;

    public AnalyticsController(CustomerRepository customerRepo) {
        this.customerRepo = customerRepo;
    }

    @GetMapping("/kpis")
    public Map<String, Object> kpis(@RequestParam(defaultValue = "30") int days) {
        Instant since = Instant.now().minus(Duration.ofDays(days));
        long total = customerRepo.count();
        long recent = customerRepo.findAll().stream()
                .filter(c -> {
                    try {
                        return c.getCreatedAt() != null && c.getCreatedAt().isAfter(since);
                    } catch (Exception e) {
                        return false;
                    }
                }).count();
        Map<String, Object> m = new HashMap<>();
        m.put("total_customers", total);
        m.put("new_last_" + days + "_days", recent);
        return m;
    }
}
