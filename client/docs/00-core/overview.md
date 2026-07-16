# Project Overview

## Identity

- **Name**: DaLiz
- **Type**: Single Page Application (SPA) — Delivery & Route Management System
- **Language**: Spanish (UI, labels, notifications) + English (code identifiers)
- **Target location**: Aguachica, Cesar, Colombia

## Purpose

DaLiz solves the logistics problem of managing last-mile deliveries in Aguachica. It provides:
- Interactive map visualization of all delivery points
- Route planning and optimization for delivery workers
- Real-time route execution (start → mark visited → complete)
- Historical analysis of completed routes with effectiveness metrics

## Users

**Single persona**: Delivery worker / dispatcher.

- Logs in to the platform
- Views all pending deliveries on the map
- Creates routes by grouping deliveries
- Executes routes in the field (in_progress, mark as visited, complete)
- Reviews historical route performance

There are no roles, permissions, or admin/regular distinctions.

## Scope

### In Scope
- JWT authentication (login, register)
- Interactive Leaflet map centered on Aguachica
- Delivery CRUD (create on map, read, delete, status update)
- Route lifecycle: draft → in_progress → paused → completed
- Route history with analytics (completion rate, active time, packages)
- Responsive layout (desktop + mobile) with collapsible sidebar

### Out of Scope
- Multi-tenant / multi-organization
- Roles and permissions
- User profile management
- Offline support / PWA
- Payment processing
- Customer-facing portal
- Internationalization (Spanish only)

## Related

- `docs/00-core/tech-stack.md` — full technology list
- `docs/00-core/glossary.md` — business terms dictionary
- `docs/02-domain/entities.md` — business entities
- `docs/decision-log.md` — architectural decisions
