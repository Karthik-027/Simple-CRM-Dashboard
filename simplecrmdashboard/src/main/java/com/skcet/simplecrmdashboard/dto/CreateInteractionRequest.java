package com.skcet.simplecrmdashboard.dto;
import com.skcet.simplecrmdashboard.model.Interaction;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateInteractionRequest {
    private Interaction.Type type;
    private String notes;
}
