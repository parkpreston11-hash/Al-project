---
name: Drizzle date serialization
description: Drizzle ORM returns Date objects but generated Zod schemas expect ISO strings — must serialize before validation.
---

**Rule:** In all API route handlers, serialize DB rows with `JSON.parse(JSON.stringify(rows))` before calling `ZodSchema.parse(rows)`.

**Why:** Drizzle ORM returns `createdAt` / `updatedAt` / date columns as JavaScript `Date` objects. The generated Orval Zod schemas expect `string` (ISO 8601). Without serialization, Zod throws `invalid_type: Expected string, received date` and the route returns HTTP 500.

**How to apply:** Add a local helper in any route file that queries the DB:
```ts
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
// then:
res.json(GetListingsResponse.parse(serialize(listings)));
```
