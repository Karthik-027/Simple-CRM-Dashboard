package com.skcet.simplecrmdashboard.repository;

import com.skcet.simplecrmdashboard.model.LogActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogActivityRepository extends JpaRepository<LogActivity, Long> {

    // Find logs by user
    List<LogActivity> findByUserId(Long userId);

    // Find logs by action type
    List<LogActivity> findByAction(String action);
    Page<LogActivity> findAll(Pageable pageable);

    // Find logs by timestamp range
    List<LogActivity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    // Find all logs, sorted by timestamp (descending)
    List<LogActivity> findAllByOrderByTimestampDesc();
}
