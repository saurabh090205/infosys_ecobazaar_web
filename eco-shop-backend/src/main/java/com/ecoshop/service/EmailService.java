package com.ecoshop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * EmailService sends OTP codes via SMTP.
 * When mail is not configured (e.g. in demo/H2 mode), it gracefully
 * falls back to logging the OTP to the console.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:ecobazaarx@noreply.com}")
    private String fromAddress;

    /**
     * Sends a password-reset OTP email to the given address.
     * Returns true if the email was sent, false if it fell back to console logging.
     */
    public boolean sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("EcoBazaarX – Password Reset OTP");
            message.setText(
                    "Hello,\n\n" +
                    "Your One-Time Password (OTP) for password reset is:\n\n" +
                    "    " + otp + "\n\n" +
                    "This code is valid for 5 minutes. Do not share it with anyone.\n\n" +
                    "If you did not request a password reset, please ignore this email.\n\n" +
                    "— EcoBazaarX Team"
            );
            mailSender.send(message);
            log.info("✅ OTP email sent successfully to {}", toEmail);
            return true;
        } catch (Exception e) {
            log.warn("⚠️  Could not send email to {} ({}). Please check SMTP configuration.", toEmail, e.getMessage());
            return false;
        }
    }
}
