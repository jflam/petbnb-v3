# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Run Commands
- Full stack dev: `npm run dev` (runs client and server concurrently)
- Client dev: `cd client && npm run dev`
- Server dev: `cd server && npm run dev`
- Database: `cd server && npm run migrate` (migrations), `npm run seed` (seed data)
- Tests: Use Jest for unit tests, Playwright for e2e tests

## Code Style & Guidelines
- React components must be named PascalCase with explicit return types
- Import order: external → shared → local
- Prefer React Testing Library over Enzyme
- Database schema uses Knex migrations/seeds with SQLite
- REST API endpoints follow patterns in specs/homepage_implementation_plan.md
- Use TypeScript for type safety in both client and server
- Consistent component structure: props interface, context consumption documented
- Follow accessibility best practices: axe-core, keyboard nav, ARIA labels