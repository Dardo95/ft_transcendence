/**
 * User-related type definitions.
 * Category: Types
 *
 * Contains:
 * - User profile information.
 * - User identity data.
 * - User-related application types.
 *
 * These types contain no UI, API or business logic.
 */

export interface User {
	id: number;
	username: string;
	email: string;
	avatarUrl?: string;
}
