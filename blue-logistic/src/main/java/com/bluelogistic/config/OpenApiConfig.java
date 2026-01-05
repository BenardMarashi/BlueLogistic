package com.bluelogistic.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "BlueLogistic API",
        version = "1.0.0",
        description = """
            BlueLogistic is a package management platform for logistics companies with multiple sellers.

            ## Roles
            - **ADMIN**: Full access to manage sellers, packages, and system operations
            - **SELLER**: Can create and view their own packages

            ## Package Status Workflow
            ```
            CREATED → IN_STORAGE → DISPATCHED
            ```
            - Seller creates package → CREATED
            - Admin receives package → IN_STORAGE
            - Admin ships package + adds tracking → DISPATCHED

            ## Authentication
            Use the `/api/auth/login` endpoint to obtain a JWT token, then include it in the Authorization header as `Bearer <token>`.
            """,
        contact = @Contact(
            name = "BlueLogistic Support",
            email = "support@bluelogistic.com"
        )
    ),
    servers = {
        @Server(url = "/", description = "Default Server")
    },
    tags = {
        @Tag(name = "Authentication", description = "User authentication and account management"),
        @Tag(name = "Packages", description = "Package management operations"),
        @Tag(name = "Sellers", description = "Seller management operations (Admin only)")
    }
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "JWT authentication token. Obtain from /api/auth/login endpoint."
)
public class OpenApiConfig {
}
