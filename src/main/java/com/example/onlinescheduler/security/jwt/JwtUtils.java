package com.example.onlinescheduler.security.jwt;

import com.example.onlinescheduler.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;

import java.util.Date;


@Component
public class JwtUtils {
    private static final Logger logger = (Logger) LoggerFactory.getLogger(JwtUtils.class);

    @Value("${mariyan.app.jwtSecret}")
    private String jwtSecret;

    @Value("${mariyan.app.jwtExpirationMs}")
    private int jwtExpirationMS;

    public String generateJwtToken(Authentication authenctication) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authenctication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMS))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        }

        return false;
    }
}
