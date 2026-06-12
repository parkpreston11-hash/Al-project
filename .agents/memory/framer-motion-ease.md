---
name: Framer Motion ease type
description: Framer Motion Variants typed ease must be const-asserted, not a plain string.
---

**Rule:** When defining Framer Motion variant objects with an `ease` key, always use `"easeOut" as const` (or any valid Easing literal with `as const`).

**Why:** TypeScript infers `ease: string` but the `Variants` type requires `ease: Easing | Easing[] | undefined`, which is a union of string literals. Without `as const`, TS throws TS2322: Type 'string' is not assignable to type 'Easing'.

**How to apply:**
```ts
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};
```
Alternatively, annotate with `import type { Variants } from "framer-motion"` and type the variable.
