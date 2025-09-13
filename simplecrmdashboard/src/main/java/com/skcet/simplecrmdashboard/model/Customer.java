package com.skcet.simplecrmdashboard.model;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Name is required")
    @Size(min=2, max=50, message = "Number of characters should be within 2 and 50")
    private String name;

    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @Size(min=10, max=10, message = "Phone number must be 10 digits")
    @Pattern(regexp = "^[0-9]{10}$", message="Only numbers are valid")
    private String phone;

    private String company;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    void onCreate(){ createdAt = Instant.now(); updatedAt = Instant.now(); }

    @PreUpdate
    void onUpdate(){ updatedAt = Instant.now(); }
}
