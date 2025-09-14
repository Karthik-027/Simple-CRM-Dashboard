package com.skcet.simplecrmdashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skcet.simplecrmdashboard.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAll();
    Optional<User>findByEmail(String email);
}
