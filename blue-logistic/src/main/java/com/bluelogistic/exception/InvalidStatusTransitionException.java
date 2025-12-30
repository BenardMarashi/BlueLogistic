package com.bluelogistic.exception;

public class InvalidStatusTransitionException extends RuntimeException {
    
    public InvalidStatusTransitionException(String from, String to) {
        super(String.format("Invalid status transition from %s to %s", from, to));
    }
}