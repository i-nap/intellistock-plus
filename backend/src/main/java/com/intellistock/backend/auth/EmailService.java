package com.intellistock.backend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void sendOtp(String to, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Your IntelliStock+ verification code");
        msg.setText("""
                Hi,

                Your IntelliStock+ verification code is:

                %s

                This code expires in 10 minutes.
                If you didn't create an account, you can safely ignore this email.

                — IntelliStock+
                """.formatted(code));
        mailSender.send(msg);
    }
}
