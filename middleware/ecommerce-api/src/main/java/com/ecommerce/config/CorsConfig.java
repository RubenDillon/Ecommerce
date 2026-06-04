package com.ecommerce.config;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.jboss.logging.Logger;

@ApplicationScoped
public class CorsConfig {
    
    private static final Logger LOG = Logger.getLogger(CorsConfig.class);
    
    void onStart(@Observes StartupEvent ev) {
        LOG.info("CORS configurado para permitir origen: http://10.242.64.7:3000");
    }
}
