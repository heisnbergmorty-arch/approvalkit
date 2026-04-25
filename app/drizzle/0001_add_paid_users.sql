CREATE TABLE IF NOT EXISTS "paidUsers" (
	"email" text PRIMARY KEY NOT NULL,
	"gumroadSaleId" text NOT NULL,
	"gumroadProductId" text,
	"paidAt" timestamp DEFAULT now() NOT NULL,
	"refundedAt" timestamp
);
