package com.bluelogistic.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableCaching
@ConfigurationProperties(prefix = "app.rate-limit")
@Getter
@Setter
public class RateLimitConfig {

    private int defaultRequestsPerMinute = 100;
    private int loginAttemptsPerMinutes = 5;
    private int loginWindowMinutes = 15;
    private int packageCreationPerHour = 50;

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key, BucketType type) {
        return buckets.computeIfAbsent(key, k -> createBucket(type));
    }

    private Bucket createBucket(BucketType type) {
        return switch (type) {
            case DEFAULT -> Bucket.builder()
                    .addLimit(Bandwidth.simple(defaultRequestsPerMinute, Duration.ofMinutes(1)))
                    .build();
            case LOGIN -> Bucket.builder()
                    .addLimit(Bandwidth.simple(loginAttemptsPerMinutes, Duration.ofMinutes(loginWindowMinutes)))
                    .build();
            case PACKAGE_CREATION -> Bucket.builder()
                    .addLimit(Bandwidth.simple(packageCreationPerHour, Duration.ofHours(1)))
                    .build();
        };
    }

    public enum BucketType {
        DEFAULT,
        LOGIN,
        PACKAGE_CREATION
    }
}
