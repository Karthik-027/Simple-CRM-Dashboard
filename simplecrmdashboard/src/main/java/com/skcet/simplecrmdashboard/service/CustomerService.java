package com.skcet.simplecrmdashboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcet.simplecrmdashboard.exception.ResourceNotFoundException;
import com.skcet.simplecrmdashboard.model.Customer;
import com.skcet.simplecrmdashboard.repository.CustomerRepository;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository repository;

    public List<Customer> getAllCustomer(){
        return repository.findAll();
    }

    public Customer getCustomer(Long id){
        return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Customer not found with id: "+id));
    }

    public Customer addCustomer(Customer customer){
        return repository.save(customer);
    }

    public void deleteCustomer(Long id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Customer not found with id: "+id);
        }
        repository.deleteById(id);
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return repository.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setEmail(updatedCustomer.getEmail());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setCompany(updatedCustomer.getCompany());
            return repository.save(customer);
        }).orElseThrow(()-> new ResourceNotFoundException("Customer not found with id: "+id));
    }
}
