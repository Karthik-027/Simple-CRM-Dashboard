package com.skcet.simplecrmdashboard.controller;

import com.skcet.simplecrmdashboard.model.LogActivity;
import com.skcet.simplecrmdashboard.service.LogActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogActivityController {

    @Autowired
    private LogActivityService logActivityService;

    // Get all logs with pagination (ADMIN only)
    @GetMapping
    public ResponseEntity<Page<LogActivity>> getAllLogs(
        @PageableDefault(size = 5, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(logActivityService.getAllLogs(pageable));
    }

    // Get logs by user ID (ADMIN only)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LogActivity>> getLogsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(logActivityService.getLogsByUserId(userId));
    }

    // Get logs by action type (ADMIN only)
    @GetMapping("/action/{action}")
    public ResponseEntity<List<LogActivity>> getLogsByAction(@PathVariable String action) {
        return ResponseEntity.ok(logActivityService.getLogsByAction(action));
    }

    // Get logs by timestamp range (ADMIN only)
    @GetMapping("/range")
    public ResponseEntity<List<LogActivity>> getLogsByTimestampRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(logActivityService.getLogsByTimestampRange(start, end));
    }
}
