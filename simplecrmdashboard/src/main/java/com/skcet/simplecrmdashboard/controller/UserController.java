package com.skcet.simplecrmdashboard.controller;

import com.skcet.simplecrmdashboard.model.User;
import com.skcet.simplecrmdashboard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users (ADMIN only)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by ID (ADMIN only)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Update user role (ADMIN only)
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(
        @PathVariable Long id,
        @RequestBody User.Role newRole
    ) {
        return ResponseEntity.ok(userService.updateUserRole(id, newRole));
    }

    // Delete user (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
