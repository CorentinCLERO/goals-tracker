package com.example.goals_tracker.exception;

public class InvalidEnumException extends RuntimeException {
    
    public InvalidEnumException(String message) {
        super(message);
    }
    
    public InvalidEnumException(String enumType, String value) {
        super(String.format("Invalid %s: '%s'", enumType, value));
    }
}