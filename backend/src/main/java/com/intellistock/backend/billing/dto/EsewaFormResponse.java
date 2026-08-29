package com.intellistock.backend.billing.dto;

import java.util.Map;

/**
 * Everything the browser needs to POST to eSewa: the gateway URL plus the
 * exact form fields (including the computed signature). Frontend auto-submits
 * a hidden form with these.
 */
public record EsewaFormResponse(String actionUrl, Map<String, String> fields) {}
