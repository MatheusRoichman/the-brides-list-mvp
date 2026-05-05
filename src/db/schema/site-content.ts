import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "../columns/uuidv7";

export const siteContent = pgTable("site_content", {
  id: uuidv7().primaryKey(),
  coupleName: text("couple_name").notNull(),
  eventLogoUrl: text("event_logo_url").notNull(),
  heroDescription: text("hero_description").notNull(),
  eventTimestamp: timestamp("event_date_time").notNull(),
  eventAddressPrimaryLine: text("event_address_main_line").notNull(),
  eventAddressSecondaryLine: text("event_address_secondary_line").notNull(),
  suggestionsTitle: text("suggestions_title").notNull(),
  suggestionsText: text("suggestions_text").notNull(),
  showPrices: boolean("show_prices").notNull().default(false),
  footerTitle: text("footer_title").notNull(),
  footerText: text("footer_text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});