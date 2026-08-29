export const AUTH_MESSAGES = {
  LOGIN_ERROR: "Invalid email or password.",
  REGISTER_ERROR: "Something went wrong. Please try again.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
  PASSWORDS_MUST_MATCH: "Passwords do not match.",
  NAME_REQUIRED: "Name is required.",
  OTP_INVALID: "Please enter a valid 6-digit code.",
  OTP_ERROR: "Verification failed. Please try again.",
  RESEND_ERROR: "Failed to resend code. Please try again.",
} as const;

export const PRODUCT_MESSAGES = {
  CREATE_SUCCESS: "Product created successfully.",
  UPDATE_SUCCESS: "Product updated successfully.",
  DELETE_SUCCESS: "Product deleted successfully.",
  LOAD_ERROR: "Failed to load products.",
  CREATE_ERROR: "Failed to create product.",
  UPDATE_ERROR: "Failed to update product.",
  DELETE_ERROR: "Failed to delete product.",
} as const;

export const ORDER_MESSAGES = {
  LOAD_ERROR: "Failed to load orders.",
  CREATE_ERROR: "Failed to create order.",
  STATUS_ERROR: "Failed to update order status.",
} as const;

export const REORDER_MESSAGES = {
  LOAD_ERROR: "Failed to load reorder recommendations.",
  GENERATE_ERROR: "Failed to generate purchase order.",
  GENERATE_SUCCESS: "Purchase order generated successfully.",
} as const;

export const SUPPLIER_MESSAGES = {
  CREATE_SUCCESS: "Supplier created successfully.",
  UPDATE_SUCCESS: "Supplier updated successfully.",
  DELETE_SUCCESS: "Supplier deleted successfully.",
  LOAD_ERROR: "Failed to load suppliers.",
  CREATE_ERROR: "Failed to create supplier.",
  UPDATE_ERROR: "Failed to update supplier.",
  DELETE_ERROR: "Failed to delete supplier.",
} as const;

export const INVENTORY_MESSAGES = {
  LOAD_ERROR: "Failed to load inventory.",
  ADJUST_SUCCESS: "Stock adjusted successfully.",
  ADJUST_ERROR: "Failed to adjust stock.",
} as const;

export const NOTIFICATION_MESSAGES = {
  LOAD_ERROR: "Failed to load notifications.",
  EMPTY: "You're all caught up.",
} as const;
