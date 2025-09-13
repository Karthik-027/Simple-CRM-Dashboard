package com.skcet.simplecrmdashboard.controller;

import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

import com.skcet.simplecrmdashboard.repository.*;
import com.skcet.simplecrmdashboard.model.*;
import com.skcet.simplecrmdashboard.dto.*;

@RestController
@RequestMapping("/api/customers/{customerId}/interactions")
public class InteractionController {

    private final InteractionRepository interactionRepo;
    private final com.skcet.simplecrmdashboard.repository.CustomerRepository customerRepo;
    private final com.skcet.simplecrmdashboard.repository.UserRepository userRepo;

    public InteractionController(InteractionRepository ir, com.skcet.simplecrmdashboard.repository.CustomerRepository cr, UserRepository ur) {
        this.interactionRepo = ir;
        this.customerRepo = cr;
        this.userRepo = ur;
    }

    @GetMapping
    public List<Interaction> list(@PathVariable Long customerId) {
        return interactionRepo.findByCustomerIdOrderByTimestampDesc(customerId);
    }

    @PostMapping
    public Interaction create(@PathVariable Long customerId, @RequestBody CreateInteractionRequest req, Principal principal) {
        var customer = customerRepo.findById(customerId).orElseThrow();
        var user = userRepo.findByEmail(principal.getName()).orElseThrow();
        Interaction it = Interaction.builder()
                .customer(customer)
                .user(user)
                .type(req.getType())
                .notes(req.getNotes())
                .build();
        return interactionRepo.save(it);
    }
}
