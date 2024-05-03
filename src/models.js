export const ORDER_STATUS = {
  NEW: "NEW", // New kit order; shipping label not generated
  ADDED_TO_BATCH: "ADDED_TO_BATCH", // Kit order was added to a shipping batch
  PENDING_DELIVERY: "PENDING_DELIVERY", // Label generated and pending delivery
  IN_TRANSIT: "IN_TRANSIT", // Kit order is in transit
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY", // Kit order is out for delivery
  DELIVERED: "DELIVERED", // Kit order was delivered
  DELIVERY_FAILED: "DELIVERY_FAILED", // Kit order delivery failed
  DELIVERY_ERROR: "DELIVERY_ERROR", // Kit order delivery error
  CANCELATION_REQUESTED: "CANCELATION_REQUESTED", // Kit order cancelation requested; not yet cancelled
  CANCELLED: "CANCELLED", // Order cancelled
  REGISTERED: "REGISTERED", // Order registered by the patient
  RECEIVED: "RECEIVED", // Order received by the lab
  PROCESSING: "PROCESSING", // Order processing in the lab
  RESULTED: "RESULTED", // Order resulted
  HOLD: "HOLD", // Order on hold
}
