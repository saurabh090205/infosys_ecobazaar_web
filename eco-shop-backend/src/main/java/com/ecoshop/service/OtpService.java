package com.ecoshop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Secure in-memory OTP service.
 *
 * - 6-digit codes valid for 5 minutes.
 * - Tracks verified emails so that reset-password cannot be called
 *   without a prior successful verify-otp call.
 * - Limits OTP attempts to 5 per email to prevent brute-force.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    private final EmailService emailService;

    // Key = email (lowercase)
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();
    // Emails that have successfully verified their OTP (cleared on reset)
    private final Set<String> verifiedEmails = ConcurrentHashMap.newKeySet();

    private final SecureRandom random = new SecureRandom();

    /**
     * Generate a new OTP and send it via email.
     * Returns the generated OTP (also returned for demo convenience).
     */
    public String generateAndSendOtp(String email) {
        String key = email.toLowerCase();
        String otp = String.format("%0" + OTP_LENGTH + "d", random.nextInt((int) Math.pow(10, OTP_LENGTH)));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        otpStore.put(key, new OtpRecord(otp, expiresAt, 0));
        verifiedEmails.remove(key); // Invalidate any previous verification

        emailService.sendOtpEmail(email, otp);

        return otp;
    }

    /**
     * Verify the OTP for the given email.
     * On success, marks the email as "verified" so reset-password can proceed.
     */
    public boolean verifyOtp(String email, String otp) {
        String key = email.toLowerCase();
        OtpRecord record = otpStore.get(key);

        if (record == null) {
            throw new RuntimeException("No OTP was requested for this email. Please request a new one.");
        }

        if (LocalDateTime.now().isAfter(record.expiresAt())) {
            otpStore.remove(key);
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        if (record.attempts() >= MAX_ATTEMPTS) {
            otpStore.remove(key);
            throw new RuntimeException("Too many failed attempts. Please request a new OTP.");
        }

        if (!record.otp().equals(otp)) {
            // Increment attempt count
            otpStore.put(key, new OtpRecord(record.otp(), record.expiresAt(), record.attempts() + 1));
            int remaining = MAX_ATTEMPTS - record.attempts() - 1;
            throw new RuntimeException("Incorrect OTP. " + remaining + " attempt(s) remaining.");
        }

        // Success — mark as verified and remove OTP
        otpStore.remove(key);
        verifiedEmails.add(key);
        return true;
    }

    /**
     * Check whether the email has passed OTP verification.
     * Consumes the verification flag (one-time use).
     */
    public boolean isVerified(String email) {
        return verifiedEmails.remove(email.toLowerCase());
    }

    private record OtpRecord(String otp, LocalDateTime expiresAt, int attempts) {}
}
