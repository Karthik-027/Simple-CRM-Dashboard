package com.skcet.simplecrmdashboard.controller;

import com.skcet.simplecrmdashboard.model.Customer;
import com.skcet.simplecrmdashboard.model.LogActivity;
import com.skcet.simplecrmdashboard.model.User;
import com.skcet.simplecrmdashboard.service.CustomerService;
import com.skcet.simplecrmdashboard.service.LogActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService service;

    @Autowired
    private LogActivityService logActivityService;

    // Map to track the last time "VIEW_ALL_CUSTOMERS" was logged per user
    private final Map<Long, Long> lastViewAllCustomersLog = new HashMap<>();

    // Helper method to get the current logged-in user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }

    @GetMapping
    public List<Customer> getAllCustomer() {
        List<Customer> customers = service.getAllCustomer();
        User currentUser = getCurrentUser();

        if (currentUser != null) {
            long currentTime = System.currentTimeMillis();
            Long lastLogTime = lastViewAllCustomersLog.get(currentUser.getId());

            // Log only if the last log was more than 5 minutes (300,000 ms) ago
            if (lastLogTime == null || (currentTime - lastLogTime) > 300000) {
                logActivityService.logActivity(
                    currentUser,
                    "VIEW_ALL_CUSTOMERS",
                    "CUSTOMER",
                    null,
                    "Viewed all customers"
                );
                lastViewAllCustomersLog.put(currentUser.getId(), currentTime);
            }
        }

        return customers;
    }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) {
        Customer customer = service.getCustomer(id);
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            logActivityService.logActivity(
                currentUser,
                "VIEW_CUSTOMER",
                "CUSTOMER",
                id,
                "Viewed customer: " + customer.getName()
            );
        }
        return customer;
    }

    @PostMapping
    public Customer addCustomer(@Valid @RequestBody Customer customer) {
        Customer savedCustomer = service.addCustomer(customer);
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            logActivityService.logActivity(
                currentUser,
                "CREATE_CUSTOMER",
                "CUSTOMER",
                savedCustomer.getId(),
                "Created customer: " + savedCustomer.getName()
            );
        }
        return savedCustomer;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Customer customer = service.getCustomer(id);
        service.deleteCustomer(id);
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            logActivityService.logActivity(
                currentUser,
                "DELETE_CUSTOMER",
                "CUSTOMER",
                id,
                "Deleted customer: " + customer.getName()
            );
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        Customer updatedCustomer = service.updateCustomer(id, customer);
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            logActivityService.logActivity(
                currentUser,
                "UPDATE_CUSTOMER",
                "CUSTOMER",
                id,
                "Updated customer: " + updatedCustomer.getName()
            );
        }
        return updatedCustomer;
    }
}
