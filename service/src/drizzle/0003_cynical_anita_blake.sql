CREATE TABLE "flashcard_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"flashcard_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"front_text" text NOT NULL,
	"back_text" text NOT NULL,
	"reference_link" varchar(500),
	"available_on" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "flashcards_front_text_unique" UNIQUE("front_text"),
	CONSTRAINT "flashcards_back_text_unique" UNIQUE("back_text"),
	CONSTRAINT "flashcards_available_on_unique" UNIQUE("available_on")
);
--> statement-breakpoint
ALTER TABLE "flashcard_views" ADD CONSTRAINT "flashcard_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_views" ADD CONSTRAINT "flashcard_views_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;