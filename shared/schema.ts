import { pgTable, text, serial, integer, boolean, uuid, timestamp, numeric, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for basic authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  jobTitle: text("job_title"),
  company: text("company"),
  phone: text("phone"),
  timezone: text("timezone"),
  preferences: jsonb("preferences").default({}),
  socialLinks: jsonb("social_links").default({}),
  accountStatus: text("account_status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  status: text("status").default("lead"), // lead, prospect, customer, churned
  score: integer("score"),
  lastContact: timestamp("last_contact"),
  notes: text("notes"),
  industry: text("industry"),
  location: text("location"),
  favorite: boolean("favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
});

// Deals table
export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  value: numeric("value").default("0"),
  stage: text("stage").notNull(), // qualification, initial, negotiation, proposal, closed-won, closed-lost
  company: text("company").notNull(),
  contact: text("contact").notNull(),
  contactId: uuid("contact_id").references(() => contacts.id),
  probability: numeric("probability").default("0"),
  priority: text("priority"), // low, medium, high
  notes: text("notes"),
  dueDate: date("due_date"),
  expectedCloseDate: date("expected_close_date"),
  lostReason: text("lost_reason"),
  products: text("products").array(),
  competitors: text("competitors").array(),
  decisionMakers: text("decision_makers").array(),
  lastActivityDate: timestamp("last_activity_date"),
  assignedTo: uuid("assigned_to"),
  currency: text("currency").default("USD"),
  discountAmount: numeric("discount_amount").default("0"),
  discountPercentage: numeric("discount_percentage").default("0"),
  nextSteps: text("next_steps").array(),
  aiInsights: jsonb("ai_insights").default({}),
  daysInStage: integer("days_in_stage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  dueDate: timestamp("due_date"),
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category").default("other"), // call, email, meeting, follow-up, other
  relatedToType: text("related_to_type"), // contact, deal
  relatedToId: uuid("related_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
});

// Business analysis table
export const businessAnalysis = pgTable("business_analysis", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("business_name").notNull(),
  industry: text("industry"),
  websiteUrl: text("website_url"),
  socialLinks: jsonb("social_links").default({}),
  analysisResults: jsonb("analysis_results").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
});

// Content items table
export const contentItems = pgTable("content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: text("type").notNull(), // podcast, audiobook, video, voice_over
  url: text("url").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
});

// Voice profiles table
export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  voiceId: text("voice_id").notNull(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessAnalysisSchema = createInsertSchema(businessAnalysis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoiceProfileSchema = createInsertSchema(voiceProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type BusinessAnalysis = typeof businessAnalysis.$inferSelect;
export type InsertBusinessAnalysis = z.infer<typeof insertBusinessAnalysisSchema>;

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;

export type VoiceProfile = typeof voiceProfiles.$inferSelect;
export type InsertVoiceProfile = z.infer<typeof insertVoiceProfileSchema>;
