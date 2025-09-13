package com.skcet.simplecrmdashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.skcet.simplecrmdashboard.model.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByOrderDateDesc(Long customerId);
}
