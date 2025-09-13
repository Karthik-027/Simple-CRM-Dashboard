package com.skcet.simplecrmdashboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String email;
    private String password;
    private String name;   // new
    private String role;   // new (ADMIN, SALES_REP, ANALYST)
}
