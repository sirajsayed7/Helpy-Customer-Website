# Helpy customer website

Desktop customer experience connected to contracts observed in the Helpy Android application.

## Documentation

- [Agent handoff](AGENT_HANDOFF.md)
- [Verified backend integration audit](BACKEND_INTEGRATION_AUDIT.md)
- [APK endpoint inventory](APK_ENDPOINT_INVENTORY.md)
- [Secure chat backend contract](CHAT_BACKEND_CONTRACT.md)

## Local development

```powershell
npm install
Copy-Item .env.example .env
npm run dev -- --host 127.0.0.1 --port 4173
```

Set `VITE_HELPY_API_ENABLED=true` in `.env` for the live API. Booking currently stops at final review and creates no order or payment.
