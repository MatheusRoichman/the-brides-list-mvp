CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"short_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"marketplace" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"min_price" numeric(10, 2),
	"max_price" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" uuid PRIMARY KEY NOT NULL,
	"couple_name" text NOT NULL,
	"event_logo_url" text NOT NULL,
	"hero_description" text NOT NULL,
	"event_date_time" timestamp NOT NULL,
	"event_address_main_line" text NOT NULL,
	"event_address_secondary_line" text NOT NULL,
	"suggestions_title" text NOT NULL,
	"suggestions_text" text NOT NULL,
	"show_prices" boolean DEFAULT false NOT NULL,
	"footer_title" text NOT NULL,
	"footer_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
