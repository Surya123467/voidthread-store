# Database

Core tables: `products`, `product_variants`, `product_images`, `orders`, `order_items`, `profiles`, `audit_log`.

`create_checkout_order` locks requested variant rows before validating stock. COD orders decrement inventory inside that transaction. Prepaid orders are created in `pending_payment`; `mark_order_paid` locks the variants again and decrements stock after verified payment.

For very high payment concurrency, add explicit short-lived stock reservations so two customers cannot both successfully pay for the last unit. The current implementation prevents database oversell at finalization, but a customer could theoretically complete a gateway payment after another checkout consumes the last unit. Before very large traffic campaigns, add reservations + expiry/release processing.
