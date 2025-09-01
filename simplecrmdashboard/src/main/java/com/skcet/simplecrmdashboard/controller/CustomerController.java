package com.skcet.simplecrmdashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skcet.simplecrmdashboard.model.Customer;
import com.skcet.simplecrmdashboard.service.CustomerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    @Autowired
    public CustomerService service;

    @GetMapping
    public List<Customer> getAllCustomer() {
        return service.getAllCustomer();
    }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) {
        return service.getCustomer(id);
    }

    @PostMapping
    public Customer addCustomer(@Valid @RequestBody Customer customer) {
        return service.addCustomer(customer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return service.updateCustomer(id, customer);
    }
}
