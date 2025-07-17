import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

// ============= CORE APPLICATION TABLES =============

// Users table for local development
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), 
  email: text("email").unique().notNull(),
  password: text("password"), 
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name"),
  profileImageUrl: text("profile_image_url"),
  jobTitle: text("job_title"),
  company: text("company"),
  phone: text("phone"),
  timezone: text("timezone"),
  preferences: text("preferences", { mode: "json" }),
  socialLinks: text("social_links", { mode: "json" }),
  accountStatus: text("account_status").default("active"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  authProvider: text("auth_provider").default("email"),
  subscriptionStatus: text("subscription_status").default("free"),
  subscriptionPlan: text("subscription_plan").default("basic"),
  subscriptionStartDate: integer("subscription_start_date", { mode: "timestamp" }),
  subscriptionEndDate: integer("subscription_end_date", { mode: "timestamp" }),
  paymentStatus: text("payment_status").default("none"),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  role: text("role").default("user"),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: integer("locked_until", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Contacts table
export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  status: text("status").default("lead"),
  score: integer("score"),
  lastContact: integer("last_contact", { mode: "timestamp" }),
  notes: text("notes"),
  industry: text("industry"),
  location: text("location"),
  favorite: integer("favorite", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

// Deals table
export const deals = sqliteTable("deals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  value: real("value").default(0),
  stage: text("stage").notNull(),
  company: text("company").notNull(),
  contact: text("contact").notNull(),
  contactId: text("contact_id").references(() => contacts.id),
  probability: real("probability").default(0),
  priority: text("priority"),
  notes: text("notes"),
  dueDate: text("due_date"),
  expectedCloseDate: text("expected_close_date"),
  lostReason: text("lost_reason"),
  products: text("products", { mode: "json" }),
  competitors: text("competitors", { mode: "json" }),
  decisionMakers: text("decision_makers", { mode: "json" }),
  lastActivityDate: integer("last_activity_date", { mode: "timestamp" }),
  assignedTo: text("assigned_to"),
  currency: text("currency").default("USD"),
  discountAmount: real("discount_amount").default(0),
  discountPercentage: real("discount_percentage").default(0),
  nextSteps: text("next_steps", { mode: "json" }),
  aiInsights: text("ai_insights", { mode: "json" }),
  daysInStage: integer("days_in_stage").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed", { mode: "boolean" }).default(false),
  dueDate: integer("due_date", { mode: "timestamp" }),
  priority: text("priority").default("medium"),
  category: text("category").default("other"),
  relatedToType: text("related_to_type"),
  relatedToId: text("related_to_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

// Business analysis table
export const businessAnalysis = sqliteTable("business_analysis", {
  id: text("id").primaryKey(),
  businessName: text("business_name").notNull(),
  industry: text("industry"),
  websiteUrl: text("website_url"),
  socialLinks: text("social_links", { mode: "json" }),
  analysisResults: text("analysis_results", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

// Content items table
export const contentItems = sqliteTable("content_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  metadata: text("metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

// Voice profiles table
export const voiceProfiles = sqliteTable("voice_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  voiceId: text("voice_id").notNull(),
  settings: text("settings", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

// ============= INSERT SCHEMAS =============

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
