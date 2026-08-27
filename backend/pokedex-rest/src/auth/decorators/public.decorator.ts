import { SetMetadata } from '@nestjs/common';

/**
 * `JwtGuard` resolves this handler-first, so `@Public(false)` on a method
 * re-guards a single route inside an otherwise `@Public()` controller —
 * which is how `AuthController` exposes one authenticated endpoint.
 */
export const Public = (isPublic = true) => SetMetadata('isPublic', isPublic);
