CREATE TABLE "business_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"industry" text,
	"website_url" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"analysis_results" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"tenant_id" uuid
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"position" text,
	"status" text DEFAULT 'lead',
	"score" integer,
	"last_contact" timestamp,
	"notes" text,
	"industry" text,
	"location" text,
	"favorite" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"tenant_id" uuid
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"tenant_id" uuid
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"value" numeric DEFAULT '0',
	"stage" text NOT NULL,
	"company" text NOT NULL,
	"contact" text NOT NULL,
	"contact_id" uuid,
	"probability" numeric DEFAULT '0',
	"priority" text,
	"notes" text,
	"due_date" date,
	"expected_close_date" date,
	"lost_reason" text,
	"products" text[],
	"competitors" text[],
	"decision_makers" text[],
	"last_activity_date" timestamp,
	"assigned_to" uuid,
	"currency" text DEFAULT 'USD',
	"discount_amount" numeric DEFAULT '0',
	"discount_percentage" numeric DEFAULT '0',
	"next_steps" text[],
	"ai_insights" jsonb DEFAULT '{}'::jsonb,
	"days_in_stage" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"tenant_id" uuid
);
--> statement-breakpoint
CREATE TABLE "feature_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tier" text NOT NULL,
	"price" numeric NOT NULL,
	"billing_cycle" text DEFAULT 'monthly' NOT NULL,
	"features" jsonb DEFAULT '{}'::jsonb,
	"limits" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feature_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"feature_name" text NOT NULL,
	"usage_count" integer DEFAULT 0,
	"usage_data" jsonb DEFAULT '{}'::jsonb,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partner_billing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"billing_period" text NOT NULL,
	"total_revenue" numeric NOT NULL,
	"total_commission" numeric NOT NULL,
	"total_customers" integer NOT NULL,
	"invoice_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"due_date" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partner_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"clerk_user_id" text NOT NULL,
	"clerk_organization_id" text,
	"package_id" uuid,
	"billing_status" text DEFAULT 'active' NOT NULL,
	"subscription_start" timestamp DEFAULT now(),
	"subscription_end" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_organization_id" text NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"commission_rate" numeric DEFAULT '0.20' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"onboarding_completed" boolean DEFAULT false,
	"custom_domain_enabled" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "partners_clerk_organization_id_unique" UNIQUE("clerk_organization_id")
);
--> statement-breakpoint
CREATE TABLE "revenue_sharing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"billing_period" text NOT NULL,
	"customer_revenue" numeric NOT NULL,
	"partner_commission" numeric NOT NULL,
	"platform_fee" numeric NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"plan_type" text NOT NULL,
	"price" numeric NOT NULL,
	"billing_cycle" text DEFAULT 'monthly' NOT NULL,
	"features" jsonb DEFAULT '{}'::jsonb,
	"usage_limits" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false,
	"due_date" timestamp,
	"priority" text DEFAULT 'medium',
	"category" text DEFAULT 'other',
	"related_to_type" text,
	"related_to_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"tenant_id" uuid
);
--> statement-breakpoint
CREATE TABLE "tenant_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false,
	"stripe_subscription_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'customer' NOT NULL,
	"parent_tenant_id" uuid,
	"subdomain" text,
	"custom_domain" text,
	"status" text DEFAULT 'active' NOT NULL,
	"branding_config" jsonb DEFAULT '{}'::jsonb,
	"feature_flags" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tenants_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "tenants_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "usage_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_id" uuid,
	"usage_type" text NOT NULL,
	"usage_value" numeric NOT NULL,
	"billing_period" text NOT NULL,
	"reset_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"tenant_id" uuid,
	"is_system" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"first_name" text,
	"last_name" text,
	"profile_image_url" text,
	"full_name" text,
	"job_title" text,
	"company" text,
	"phone" text,
	"timezone" text,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"account_status" text DEFAULT 'active',
	"email_verified" boolean DEFAULT false,
	"auth_provider" text DEFAULT 'email',
	"replit_user_id" text,
	"google_id" text,
	"subscription_status" text DEFAULT 'free',
	"subscription_plan" text DEFAULT 'basic',
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"payment_status" text DEFAULT 'none',
	"tenant_id" uuid,
	"role_id" uuid,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"is_admin" boolean DEFAULT false,
	"role" text DEFAULT 'user',
	"last_login_at" timestamp,
	"login_attempts" integer DEFAULT 0,
	"locked_until" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "voice_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"voice_id" text NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"tenant_id" uuid
);
--> statement-breakpoint
ALTER TABLE "business_analysis" ADD CONSTRAINT "business_analysis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_analysis" ADD CONSTRAINT "business_analysis_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_usage" ADD CONSTRAINT "feature_usage_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_billing" ADD CONSTRAINT "partner_billing_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_customers" ADD CONSTRAINT "partner_customers_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_customers" ADD CONSTRAINT "partner_customers_package_id_feature_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."feature_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_sharing" ADD CONSTRAINT "revenue_sharing_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_sharing" ADD CONSTRAINT "revenue_sharing_customer_id_partner_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."partner_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "tenant_subscriptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "tenant_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_customer_id_partner_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."partner_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_user_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_profiles" ADD CONSTRAINT "voice_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_profiles" ADD CONSTRAINT "voice_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_business_analysis_tenant" ON "business_analysis" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_contacts_tenant" ON "contacts" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_contacts_user_tenant" ON "contacts" USING btree ("user_id","tenant_id");--> statement-breakpoint
CREATE INDEX "idx_content_items_tenant" ON "content_items" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_deals_tenant" ON "deals" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_deals_user_tenant" ON "deals" USING btree ("user_id","tenant_id");--> statement-breakpoint
CREATE INDEX "idx_feature_usage_tenant_feature" ON "feature_usage" USING btree ("tenant_id","feature_name");--> statement-breakpoint
CREATE INDEX "idx_feature_usage_period" ON "feature_usage" USING btree ("period_start","period_end");--> statement-breakpoint
CREATE INDEX "idx_partner_billing_partner" ON "partner_billing" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_billing_period" ON "partner_billing" USING btree ("billing_period");--> statement-breakpoint
CREATE INDEX "idx_partner_customers_partner" ON "partner_customers" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_customers_clerk_user" ON "partner_customers" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "idx_partners_clerk_org" ON "partners" USING btree ("clerk_organization_id");--> statement-breakpoint
CREATE INDEX "idx_partners_tenant" ON "partners" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_revenue_sharing_partner" ON "revenue_sharing" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_revenue_sharing_period" ON "revenue_sharing" USING btree ("billing_period");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_tasks_tenant" ON "tasks" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_user_tenant" ON "tasks" USING btree ("user_id","tenant_id");--> statement-breakpoint
CREATE INDEX "idx_tenant_subscriptions_tenant" ON "tenant_subscriptions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_tenant_subscriptions_status" ON "tenant_subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tenants_subdomain" ON "tenants" USING btree ("subdomain");--> statement-breakpoint
CREATE INDEX "idx_tenants_custom_domain" ON "tenants" USING btree ("custom_domain");--> statement-breakpoint
CREATE INDEX "idx_tenants_parent" ON "tenants" USING btree ("parent_tenant_id");--> statement-breakpoint
CREATE INDEX "idx_usage_tracking_tenant" ON "usage_tracking" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_usage_tracking_customer" ON "usage_tracking" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_usage_tracking_period" ON "usage_tracking" USING btree ("billing_period");--> statement-breakpoint
CREATE INDEX "idx_users_tenant" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_users_email_tenant" ON "users" USING btree ("email","tenant_id");--> statement-breakpoint
CREATE INDEX "idx_users_subscription" ON "users" USING btree ("subscription_status");--> statement-breakpoint
CREATE INDEX "idx_users_replit" ON "users" USING btree ("replit_user_id");--> statement-breakpoint
CREATE INDEX "idx_users_google" ON "users" USING btree ("google_id");--> statement-breakpoint
CREATE INDEX "idx_voice_profiles_tenant" ON "voice_profiles" USING btree ("tenant_id");