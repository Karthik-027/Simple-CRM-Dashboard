package com.skcet.simplecrmdashboard.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.skcet.simplecrmdashboard.repository.UserRepository;
import com.skcet.simplecrmdashboard.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com";
        if (userRepo.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .name("Administrator")
                    .role(User.Role.ADMIN)
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .build();
            userRepo.save(admin);
            System.out.println("Seeded admin user -> email: admin@example.com / password: admin123");
        }
    }
}
