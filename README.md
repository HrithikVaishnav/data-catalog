# Data Catalog API

An Express + Prisma + PostgreSQL-based backend service that allows defining **tracking plans**, **events**, and **properties**, and validating event payloads against structured schemas. Useful for managing analytics instrumentation and ensuring consistent event tracking.

---

## 🚀 Features

- CRUD operations for:
  - Events
  - Properties
  - Tracking Plans (with nested Events & Properties)
- Schema-based validation of incoming event payloads
- Swagger documentation (`/api-docs`)
- PostgreSQL + Prisma ORM
- Modular and scalable architecture

---

## 🧱 Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Docs**: Swagger (OpenAPI 3.0)

---

## 📦 Installation

```bash
# Clone the repo
git clone <repo-url>
cd data-catalog-api

# Install dependencies
npm install
```

## Environment Variables
```bash
Create a .env file:

DATABASE_URL="postgresql://<user>:<password>@localhost:5432/data_catalog"
PORT=4000
```

---

## Scripts

| Command         | Purpose                      |
| --------------- | ---------------------------- |
| `npm run dev`   | Start in development mode    |
| `npm run build` | Compile TypeScript to `dist` |
| `npm start`     | Start from compiled `dist/`  |

---

## API Endpoints
#### Events
- GET `/events`
- POST `/events`
- PUT `/events/:id`
- DELETE `/events/:id`

#### Properties
- GET `/properties`
- POST `/properties`
- PUT `/properties/:id`
- DELETE `/properties/:id`

#### Tracking Plans
- GET `/tracking-plans`
- POST `/tracking-plans`
- PUT `/tracking-plans/:id`
- POST `/tracking-plans/:planId/validate-event`

Full API reference at: `http://localhost:4000/api-docs`


## Future Improvements

- Authentication & Authorization (e.g., JWT or OAuth)
- Soft deletes for historical audit
- Versioning of Events and Properties
-  Web UI dashboard for managing tracking plans
- Detailed logging and request tracing
- Unit & integration test coverage
- Bulk import/export support (CSV/JSON)

## Contribution
Contributions are welcome! Open issues, suggest enhancements, or create PRs.