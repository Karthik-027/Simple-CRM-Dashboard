package com.skcet.simplecrmdashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "log_activities")
public class LogActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String action; // e.g., "LOGIN", "CREATE_CUSTOMER", "UPDATE_ORDER"

    @Column(nullable = false)
    private String entityType; // e.g., "CUSTOMER", "USER", "INTERACTION"

    private Long entityId; // ID of the affected entity

    private String details; // Additional details (e.g., old value, new value)

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
