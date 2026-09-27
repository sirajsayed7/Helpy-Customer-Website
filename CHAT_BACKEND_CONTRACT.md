# Helpy website chat authentication contract

The APK chat uses Firebase Authentication and Firestore, not the Helpy REST API. Its Firestore model uses:

- `users/{uid}` with `id`, `name`, `email`, `image`, `about`, `is_online`, `last_active`, and `push_token`.
- `chats/{sortedUidPair}/messages/{sent}` with `fromId`, `toId`, `msg`, `read`, `sent`, and `type`.

Both observed Firebase projects reject unauthenticated reads. The APK contains an exposed Firebase Admin service-account private key; that key must be rotated and must never be copied into the website.

## Required server endpoint

Configure `VITE_HELPY_CHAT_TOKEN_ENDPOINT` to an HTTPS endpoint owned by Helpy. The website calls it with the existing Helpy access token:

```http
GET /chat-token
Authorization: Bearer <helpy-user-token>
Accept: application/json
```

The server must:

1. Validate the Helpy user token.
2. Resolve the user's canonical chat UID.
3. Use a rotated Firebase Admin credential stored only on the server.
4. Mint a short-lived Firebase custom token for that UID.
5. Return `{ "customToken": "..." }`.

The browser exchanges the custom token through Firebase Identity Toolkit and uses the resulting user ID token for Firestore. The UI never receives an Admin credential.

## Firestore rules

Rules should require authentication, let users read the permitted business/user directory, and restrict each chat to participants whose UID appears in the conversation ID or message fields. Message creation should enforce `request.auth.uid == request.resource.data.fromId` and reject unexpected fields.

After the endpoint is configured, the existing message UI automatically loads users, polls the selected conversation every five seconds, and writes text messages using the APK-compatible schema.

The website also requires the public Firebase Web API key in `VITE_HELPY_FIREBASE_API_KEY`. Keep the value in deployment configuration rather than source control so automated secret scanners and environment separation remain straightforward.
