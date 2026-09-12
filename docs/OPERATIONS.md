# Store operations

Admin route: `/admin`.

Typical product workflow:

1. Create product as Draft.
2. Add description/story, collection, price and variants.
3. Enter stock per size.
4. Upload optimized product images.
5. Review storefront preview.
6. Change status to Active.
7. Feature it on home when needed.

For each order, the future fulfilment controls should progress through: confirmed/paid → packing → shipped → delivered. Tracking provider integration is intentionally separate from the payment layer.
