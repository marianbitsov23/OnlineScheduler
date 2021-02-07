package com.example.onlinescheduler.controllers;

import com.example.onlinescheduler.models.user.ERole;
import com.example.onlinescheduler.models.user.Role;
import com.example.onlinescheduler.models.user.User;
import com.example.onlinescheduler.payload.sign.*;
import com.example.onlinescheduler.payload.MessageResponse;
import com.example.onlinescheduler.repositories.user.RoleRepository;
import com.example.onlinescheduler.repositories.user.UserRepository;
import com.example.onlinescheduler.security.jwt.JwtUtils;
import com.example.onlinescheduler.security.services.UserDetailsImpl;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/forgot_password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) throws UnsupportedEncodingException, MessagingException {
        String email = forgotPasswordRequest.getEmail();
        String token = RandomString.make(30);

        String response = updateResetPasswordToken(token, email);
        if(!response.equals("")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(response));
        }
        sendEmail(email, "http://localhost:8081/reset-password", token);
        return ResponseEntity
                .ok()
                .body(new MessageResponse("We have sent a reset password link to your email. Please check!"));
    }

    @PostMapping("/reset_password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        String token = resetPasswordRequest.getToken();
        String password = resetPasswordRequest.getPassword();

        Optional<User> user = userRepository.findByResetPasswordToken(token);
        if(user.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Invalid token!"));
        } else {
            user.get().setPassword(encoder.encode(password));
            userRepository.save(user.get());
            return ResponseEntity
                    .ok()
                    .body(new MessageResponse("Password updated!"));
        }
    }

    public void sendEmail(String recipientEmail, String link, String token) throws UnsupportedEncodingException, MessagingException {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setFrom("contact@online-scheduler.com", "Online Scheduler Support");
            helper.setTo(recipientEmail);

            String subject = "Here's the link to reset your password";

            String content = "<p>Hello,</p>"
                    + "<p>You have requested to reset your password.</p>"
                    + "<p>Click the link below to change your password:</p>"
                    + "<p><a href=\"" + link + "\">Change my password</a></p>"
                    + "<br>"
                    + "<h3>Security key: <strong>" + token + "</strong></h3>"
                    + "<p>Copy this token and paste it in the reset password form.</p>"
                    + "<p>in order to reset your password.</p>"
                    + "<br>"
                    + "<br>"
                    + "<p>Ignore this email if you do remember your password, "
                    + "or you have not made the request.</p>";

            helper.setSubject(subject);

            helper.setText(content, true);

            mailSender.send(message);
    }

    public String updateResetPasswordToken(String token, String email)  {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            user.get().setResetPasswordToken(token);
            userRepository.save(user.get());
            return ("");
        } else {
            return ("Could not find any user with the email " + email);
        }
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if(userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username is already taken!"));
        }

        if(userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email is already in use!"));
        }

        //Crate new User
        User user = new User(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()));

        Set<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if(strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found. "));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if ("admin".equals(role)) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
