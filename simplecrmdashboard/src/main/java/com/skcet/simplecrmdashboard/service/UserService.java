package com.skcet.simplecrmdashboard.service;

import com.skcet.simplecrmdashboard.model.User;
import com.skcet.simplecrmdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Update user role
    public User updateUserRole(Long id, User.Role newRole) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setRole(newRole);
            return userRepository.save(user);
        }
        return null;
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
