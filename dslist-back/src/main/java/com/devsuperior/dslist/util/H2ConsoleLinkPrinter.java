package com.devsuperior.dslist.util;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class H2ConsoleLinkPrinter {
    @EventListener(ApplicationReadyEvent.class)
    public void printH2ConsoleLink() {
        System.out.println("##################################################");
        System.out.println("H2 console link: http://localhost:8081/h2-console");
    }
    
}
