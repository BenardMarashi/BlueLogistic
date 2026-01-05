package com.bluelogistic.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final int MAX_BODY_LENGTH = 1000;
    private static final Pattern SENSITIVE_PATTERN = Pattern.compile(
            "(\"(?:password|token|secret|apiKey|authorization)\"\\s*:\\s*\")([^\"]+)(\")",
            Pattern.CASE_INSENSITIVE
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            logRequest(wrappedRequest, wrappedResponse, duration);
            wrappedResponse.copyBodyToResponse();
        }
    }

    private void logRequest(ContentCachingRequestWrapper request, ContentCachingResponseWrapper response, long duration) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();
        String ip = extractIpAddress(request);
        String user = getCurrentUser();

        String maskedRequestBody = maskSensitiveData(getRequestBody(request));

        if (status >= 400) {
            String responseBody = truncateBody(getResponseBody(response));
            log.warn("HTTP {} {} - status={} duration={}ms ip={} user={} requestBody={} responseBody={}",
                    method, uri, status, duration, ip, user, maskedRequestBody, responseBody);
        } else {
            log.info("HTTP {} {} - status={} duration={}ms ip={} user={}",
                    method, uri, status, duration, ip, user);
        }
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] content = request.getContentAsByteArray();
        if (content.length == 0) {
            return "";
        }
        return truncateBody(new String(content, StandardCharsets.UTF_8));
    }

    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] content = response.getContentAsByteArray();
        if (content.length == 0) {
            return "";
        }
        return new String(content, StandardCharsets.UTF_8);
    }

    private String truncateBody(String body) {
        if (body == null || body.isEmpty()) {
            return "";
        }
        if (body.length() <= MAX_BODY_LENGTH) {
            return body;
        }
        return body.substring(0, MAX_BODY_LENGTH) + "...[truncated]";
    }

    private String maskSensitiveData(String body) {
        if (body == null || body.isEmpty()) {
            return "";
        }
        return SENSITIVE_PATTERN.matcher(body).replaceAll("$1***MASKED***$3");
    }

    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "anonymous";
    }
}
