# Authentication and Authorization Architecture

## Scope

Sprint 3 introduces the security foundation for Admin CMS authentication and RBAC.

Included:

- admin login
- admin logout
- current authenticated user endpoint
- access and refresh token architecture
- refresh session persistence and revocation
- role and permission middleware foundation

Excluded:

- frontend login UI
- admin dashboard UI
- CRUD/business APIs

## Authentication Flow

1. Client sends credentials to `POST /api/v1/auth/login`.
2. Server validates request with Zod.
3. Credentials are checked using bcrypt against `AdminUser.passwordHash`.
4. Server creates `AdminSession` and issues:
   - access token (short-lived, bearer)
   - refresh token (httpOnly cookie)
5. Refresh token hash is stored in database for revocation and rotation.

## Refresh Flow

1. Client calls `POST /api/v1/auth/refresh` with refresh cookie.
2. Server verifies JWT signature and token type.
3. Server verifies session state (`revokedAt`, `expiresAt`, `deletedAt`).
4. Server compares cookie token with hashed refresh token in `AdminSession`.
5. Server rotates refresh token and returns a new access token.

## Logout Flow

1. Client calls `POST /api/v1/auth/logout`.
2. Server revokes active session from refresh token session id.
3. Server clears refresh cookie.

## Authorization Flow (RBAC)

- Authentication middleware validates bearer access token and attaches `req.authUser`.
- Role middleware enforces hierarchy:
  - `SUPER_ADMIN` > `ADMIN` > `CONTENT_MANAGER` > `EDITOR` > `OPERATIONS` > `SUPPORT`
- Permission middleware composes:
  - role default permissions
  - database role-permission assignments

## Permission System

Prepared baseline permission slugs:

- `manage_events`
- `manage_lessons`
- `manage_gallery`
- `manage_bookings`
- `manage_users`
- `manage_settings`
- `view_dashboard`

Supports custom permission rows via `Permission` and `RolePermission`.

## JWT Lifecycle

- Access token:
  - short lifetime
  - bearer transport
  - includes `sub`, `sid`, `role`, `tokenType`
- Refresh token:
  - longer lifetime
  - httpOnly cookie transport
  - hashed-at-rest in `AdminSession`
  - rotated on refresh

## Security Considerations

- bcrypt password verification and token hash protection
- helmet headers enabled globally
- login and refresh route throttling
- httpOnly refresh token cookie strategy
- centralized auth error responses
- revoked and expired session checks on refresh
- strict environment validation for auth secrets and cookie settings

## Future OAuth Compatibility

OAuth providers can be added by:

1. introducing external identity mapping table (`AdminIdentityProvider`)
2. exchanging provider claims for local `AdminUser`
3. issuing existing local token/session architecture

Current session model already supports this integration path.

## Future MFA Compatibility

MFA can be layered without replacing the token architecture by:

1. adding pre-auth challenge state (`AdminAuthChallenge`)
2. requiring challenge completion before session issuance
3. optionally marking session assurance level in `AdminSession`

## Routes

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
