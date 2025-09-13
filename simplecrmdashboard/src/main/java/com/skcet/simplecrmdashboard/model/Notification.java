package com.skcet.simplecrmdashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String message;
    private boolean isRead;
    private Instant createdAt;

    @PrePersist
    void onCreate(){ createdAt = Instant.now(); }
}
