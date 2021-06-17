package com.example.application.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jose.util.Base64URL;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.application.security.jwt.VaadinJwtWebSecurityConfig;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends VaadinJwtWebSecurityConfig {

    public static final String LOGOUT_URL = "/";

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Public access
        http.authorizeRequests().antMatchers("/").permitAll();
        http.authorizeRequests().antMatchers("/public").permitAll();

        super.configure(http);

        http
            .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        setJwtSplitCookieAuthentication(http, "myapp", 3600,
                JWSAlgorithm.HS256);

        setLoginView(http, "/login", LOGOUT_URL);
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
        web.ignoring().antMatchers("/images/logo.png");
    }

    @Bean
    JWKSource<SecurityContext> jwkSource() {
        OctetSequenceKey key = new OctetSequenceKey.Builder(
                Base64URL.from("I72kIcB1UrUQVHVUAzgweE+BLc0bF8mLv9SmrgKsQAk="))
                .algorithm(JWSAlgorithm.HS256).build();
        JWKSet jwkSet = new JWKSet(key);
        return (jwkSelector, context) -> jwkSelector.select(jwkSet);
    }
}