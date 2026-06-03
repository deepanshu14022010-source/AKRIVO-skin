# AKRIVO Skin

Production-ready MVP architecture for AI-powered skincare guidance and wellness insights.

AKRIVO Skin provides skincare guidance and wellness insights only. It does not diagnose, treat, cure, or replace a dermatologist.

## Stack

- React + Vite frontend
- Tailwind CSS mobile-first UI
- Node.js API with Express
- Local JSON database adapter for development, shaped around the production models
- Local private image storage adapter, replaceable with cloud object storage
- Backend-only AI service that returns a structured JSON skincare guidance contract
- PWA-ready manifest

## Features

- Email and password signup/login
- HttpOnly signed session cookie
- Scrypt password hashing
- Skin profile onboarding with consent and privacy version capture
- Private image asset model for analysis and progress photos
- Backend-only AI analysis service with JSON-only output
- Razorpay test-mode payment interface
- Confidence-based skin concern estimates
- Beginner AM/PM routine generation with step instructions, durations, and cautions
- Product category suggestions, not affiliate products
- Red-flag warnings that advise professional medical help
- Dashboard, routine step screen, reminders, progress timeline, duo plan, settings, privacy, and legal screens

## API

The backend implements the requested route groups:

- `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/forgot-password`, `/api/auth/me`
- `/api/onboarding`, `/api/skin-profile`
- `/api/images/upload`, `/api/images/:id`
- `/api/analysis/create`, `/api/analysis/latest`, `/api/analysis/:id`
- `/api/routine/today`, `/api/routine/generate`, `/api/routine/step-complete`, `/api/routine/skip-step`, `/api/routine/history`
- `/api/progress/photo`, `/api/progress/timeline`, `/api/progress/:id`
- `/api/duo/create-code`, `/api/duo/join`, `/api/duo/status`, `/api/duo/privacy`, `/api/duo/disconnect`
- `/api/settings`, `/api/account/delete`
- `/api/payments/plans`, `/api/payments/razorpay/order`, `/api/payments/razorpay/verify`

## Run

```bash
npm install
npm run build
npm start
```

Then open:

```text
http://127.0.0.1:3000
```

## Email OTP

Local development defaults to `EMAIL_PROVIDER=console` when Brevo is not configured. OTP codes are printed in the server log and returned to the local web/mobile UI as a development code.

For real email delivery, create `.env` from `.env.example` and set:

```text
EMAIL_PROVIDER=brevo
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=verified-sender@example.com
BREVO_SENDER_NAME=AKRIVO Skin
```

The Brevo sender email must be verified in Brevo before OTP emails can be delivered.
If Brevo IP allowlisting is enabled, add the server's current public IP in Brevo security settings; otherwise Brevo returns `401 unauthorized` and OTP emails will not send.

## Groq Skin Bot

Set these values in `.env` to use Groq for analysis and Skin Bot:

```text
AI_PROVIDER=groq
AI_API_URL=https://api.groq.com/openai/v1/chat/completions
AI_API_KEY=your-groq-api-key
AI_MODEL=llama-3.3-70b-versatile
GROQ_VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
SUPPORT_EMAIL=owner@example.com
```

`GROQ_VISION_MODEL` is used when a face photo is included in analysis. Escalated report-assistant issues are sent to `SUPPORT_EMAIL` when Brevo is configured; in local console email mode they are logged instead.

## First User Install Page

AKRIVO Skin is configured as a Progressive Web App so the web app and installed app use the same frontend. Share this page with first users:

```text
https://your-domain.example/download
```

The `Download / Install` button opens the browser install prompt on supported Android and desktop browsers such as Chrome and Edge. On iPhone/iPad, users must tap Share, then Add to Home Screen. A real deployment must use HTTPS for the install prompt and service worker to work outside localhost.

## Expo Go Mobile App

An Expo Go ready app lives in `mobile/`.

Start the backend first:

```bash
npm start
```

Create `mobile/.env` with your computer LAN IP address:

```text
EXPO_PUBLIC_API_BASE_URL=http://YOUR-COMPUTER-LAN-IP:3000
```

Then run the mobile app:

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code in Expo Go. Do not use `127.0.0.1` on a physical phone because it points to the phone itself, not your computer.

## Production Notes

- Set `SESSION_SECRET` to a strong private value before deployment.
- Put the server behind HTTPS so session cookies can use the `Secure` attribute.
- Set `CORS_ORIGINS` to your exact production domains. Do not use a wildcard.
- Set Razorpay test keys with `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. The key id may be sent to Checkout; the key secret must stay server-side.
- Replace the local JSON adapter with PostgreSQL or MongoDB using the existing model boundaries.
- See `docs/postgres-schema.sql` for the production PostgreSQL schema reference.
- Replace local uploads with private cloud storage or temporary processing storage.
- Wire `server/services/aiService.js` to the chosen image+text AI API. Keep keys in environment variables only.
- See `docs/ai-output-contract.md` for the required structured AI JSON output.
- See `SECURITY.md` for implemented hardening and remaining production controls.
- Publish `docs/privacy-policy.md` and `docs/terms-of-service.md` before public launch or app store submission.
- See `docs/app-store-readiness.md` for data safety, support, and account deletion notes.
- See `docs/privacy-compliance.md` for DPDP Act compliance implementation notes for Indian users.
