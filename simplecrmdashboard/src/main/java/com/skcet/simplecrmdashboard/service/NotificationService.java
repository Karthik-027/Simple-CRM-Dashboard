// package com.skcet.simplecrmdashboard.service;

// import com.skcet.simplecrmdashboard.model.Notification;
// import com.skcet.simplecrmdashboard.repository.NotificationRepository;
// import org.springframework.stereotype.Service;
// import java.util.List;

// @Service
// public class NotificationService {

//     private final NotificationRepository notificationRepository;

//     public NotificationService(NotificationRepository notificationRepository) {
//         this.notificationRepository = notificationRepository;
    // }

//     // Fetch all notifications for a user
//     public List<Notification> getNotificationsForUser(Long userId) {
//         return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
//     }

//     // Save new notification
//     public Notification createNotification(Notification notification) {
//         return notificationRepository.save(notification);
//     }

//     // Mark notification as read
//     public void markAsRead(Long notificationId) {
//         notificationRepository.findById(notificationId).ifPresent(n -> {
//             n.setRead(true);
//             notificationRepository.save(n);
//         });
//     }
// }
