package com.skcet.simplecrmdashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skcet.simplecrmdashboard.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long>{
    
}
