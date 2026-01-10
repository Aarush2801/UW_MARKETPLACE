# UW_MARKETPLACE Contract (Source of Truth)

## Auth
- Only users with email ending in @uwaterloo.ca are allowed.

## Core tables (V1)
- profiles: id, email, display_name, created_at
- listings: id, seller_id, title, description, price_cents, category, condition, status, created_at
- listing_images: id, listing_id, url, created_at

## Storage
- Bucket: listing-images

## Required flows
- Auth (UW email only)
- Create listing
- Browse listings
- View listing
