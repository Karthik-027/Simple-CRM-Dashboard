package com.skcet.simplecrmdashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.skcet.simplecrmdashboard.model.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
