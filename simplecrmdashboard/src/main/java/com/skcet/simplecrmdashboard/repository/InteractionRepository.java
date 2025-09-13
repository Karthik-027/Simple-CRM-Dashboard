package com.skcet.simplecrmdashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.skcet.simplecrmdashboard.model.Interaction;
import java.util.List;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByCustomerIdOrderByTimestampDesc(Long customerId);
}
