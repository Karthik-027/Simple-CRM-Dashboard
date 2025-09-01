package com.skcet.simplecrmdashboard.model;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Name is required")
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    @Size(min=10, max=10, message = "Phone number must be 10 digits")
    private String phone;
    private String company;
}
