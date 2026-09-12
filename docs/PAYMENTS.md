# Payments

## Prepaid

1. Browser submits variant IDs, quantities and shipping data.
2. Server creates internal order and recalculates total.
3. Server creates Razorpay order.
4. Browser opens Razorpay Checkout.
5. Customer can use enabled UPI apps such as Google Pay/PhonePe, cards, netbanking, etc., subject to the merchant account/payment-method configuration.
6. Browser returns payment identifiers/signature.
7. Server verifies signature.
8. Webhook provides independent payment event verification.
9. Internal order becomes paid and inventory is decremented.

## COD

COD is handled internally; Razorpay is not called. The migration currently adds the configured COD fee and decrements stock when the COD order is accepted.

Before launch, add PIN-code serviceability and anti-fraud rules for COD.
