package com.skcet.simplecrmdashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "interactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Interaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private com.skcet.simplecrmdashboard.model.Customer customer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Instant timestamp;

    public enum Type { CALL, EMAIL, MEETING, TICKET }

    @PrePersist
    void onCreate(){ timestamp = Instant.now(); }
}
