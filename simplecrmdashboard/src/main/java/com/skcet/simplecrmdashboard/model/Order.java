package com.skcet.simplecrmdashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Instant orderDate;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status { PENDING, COMPLETED, CANCELLED }
}
