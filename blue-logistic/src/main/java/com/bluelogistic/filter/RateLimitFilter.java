package com.bluelogistic.filter;

import com.bluelogistic.config.RateLimitConfig;
import com.bluelogistic.config.RateLimitConfig.BucketType;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
@RequiredArgsConstructor
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitConfig rateLimitConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip rate limiting for actuator and swagger paths
        if (shouldSkipRateLimiting(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = resolveKey(request);
        BucketType bucketType = resolveBucketType(request);
        Bucket bucket = rateLimitConfig.resolveBucket(key + ":" + bucketType.name(), bucketType);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("Retry-After", String.valueOf(waitForRefill));
            response.addHeader("X-Rate-Limit-Remaining", "0");
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Rate limit exceeded\",\"retryAfter\":" + waitForRefill + "}");
            log.warn("Rate limit exceeded for key: {} on path: {}", key, path);
        }
    }

    private boolean shouldSkipRateLimiting(String path) {
        return path.startsWith("/actuator") ||
               path.startsWith("/swagger") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/swagger-ui");
    }

    private String resolveKey(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
            !"anonymousUser".equals(authentication.getPrincipal())) {
            return "user:" + authentication.getName();
        }
        return "ip:" + extractIpAddress(request);
    }

    private BucketType resolveBucketType(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (path.contains("/auth/login")) {
            return BucketType.LOGIN;
        }
        if (path.contains("/packages") && "POST".equalsIgnoreCase(method)) {
            return BucketType.PACKAGE_CREATION;
        }
        return BucketType.DEFAULT;
    }

    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
