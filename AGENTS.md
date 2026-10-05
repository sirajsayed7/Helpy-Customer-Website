# Helpy implementation contract

The authoritative API contract for this project is the Laravel source checkout at:

`/Users/mo/Downloads/helpy-backend-abdullah`

Before adding or changing an API-backed feature:

1. Inspect `routes/api.php` for the method and route.
2. Inspect the controller validation and response construction.
3. Inspect related Eloquent models/accessors for nested and computed fields.
4. Update web and mobile mappers from that source. Do not infer payloads from UI copy, APK strings, or old documentation while Laravel source is available.
5. Keep booking/payment writes disabled until availability and the selected payment path are verified in staging or a sandbox.

Favourites are the current exception: keep them local-only until their backend contract is explicitly scheduled.
