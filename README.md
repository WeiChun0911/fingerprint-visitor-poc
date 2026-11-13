# Fingerprint Visitor ID PoC

This static PoC reuses the supplied Fingerprint Lab page layout, styles, and browser-signal explorer. It adds a browser-side Fingerprint Identification panel that displays the returned `visitor_id` and lets participants manually compare another ID.

## Run locally

Serve this directory from `localhost` or an HTTPS origin, then open `index.html`. Enter a Fingerprint **public** API key and select **取得 Visitor ID**. The page does not store the key or send results to a custom backend. Fingerprint receives the identification request, and successful identification calls count toward the Fingerprint workspace usage.

## Included files

- `index.html`: adapted interface and Fingerprint test panel.
- `styles.css`: original stylesheet from the supplied demo.
- `app.js`: original browser-signal collection, repeated sampling, baseline, and export behavior.
- `fingerprint-poc.js`: added Fingerprint JavaScript agent integration and manual ID comparison.
- `visitor-poc.css`: small styles for the added panel.

The browser-signal explorer computes a local sample digest; that digest is not a Fingerprint `visitor_id`. Fingerprint `visitor_id` identifies a browser/device visitor, not a person. This demo does not use Zero Trust Mode or a backend.
