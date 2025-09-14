package com.skcet.simplecrmdashboard.service;

import com.skcet.simplecrmdashboard.model.LogActivity;
import com.skcet.simplecrmdashboard.model.User;
import com.skcet.simplecrmdashboard.repository.LogActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogActivityService {

    @Autowired
    private LogActivityRepository logActivityRepository;

    // Log a new activity
    public LogActivity logActivity(User user, String action, String entityType, Long entityId, String details) {
        LogActivity log = LogActivity.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();
        return logActivityRepository.save(log);
    }

    // Get all logs with pagination
    public Page<LogActivity> getAllLogs(Pageable pageable) {
        return logActivityRepository.findAll(pageable);
    }

    // Get logs by user ID
    public List<LogActivity> getLogsByUserId(Long userId) {
        return logActivityRepository.findByUserId(userId);
    }

    // Get logs by action type
    public List<LogActivity> getLogsByAction(String action) {
        return logActivityRepository.findByAction(action);
    }

    // Get logs by timestamp range
    public List<LogActivity> getLogsByTimestampRange(LocalDateTime start, LocalDateTime end) {
        return logActivityRepository.findByTimestampBetween(start, end);
    }
}
