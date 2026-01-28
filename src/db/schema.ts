import { pgTableCreator, uuid, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const createTable = pgTableCreator((name) => name)

export const users = createTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255}).notNull().unique(),
    userName: varchar("username", { length: 50}).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 50}).notNull(),
    lastName: varchar("last_name", { length: 50}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
})

export const habits = createTable("habits", {
    id: uuid("id").primaryKey().defaultRandom(),
    // If user gets deleted, the habits is also deleted.
    // user <- habits
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade"}).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    frequency: varchar("frequency", { length: 20 }).notNull(),
    targetCounts: integer("target_count").default(1),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at")
})

export const entries = createTable("entries", {
    id: uuid("id").primaryKey().defaultRandom(),
    // If the habits get deleted, the entries is also deleted.
    // user <- habits <- entries
    habitId: uuid("habit_id").references( ()=> habits.id, { onDelete: "cascade" }).notNull(),
    completionDate: timestamp("completion_date").defaultNow().notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
})

export const tags = createTable("tags", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50}).notNull().unique(),
    color: varchar("color_hex", { length: 7 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
})

export const habitTags = createTable("habitTags", {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id").references( () => habits.id, { onDelete: "cascade" }).notNull(),
    tagId: uuid("tag_id").references( () => tags.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at")
})

// Users -> Habits (One-Many)
export const userRelations = relations(users, ({many}) => ({
    habits: many(habits),
}))

// Habits -> User (Many-One) - refer to userRelations (One User, Many Habits)
// Habits -> Entries (Many-One) - (One Habit, Many Entries)
// Habits -> HabitTags (Many-One) - (One Habit, Many Tags)
export const habitRelations = relations(habits, ({one, many}) => ({
    user: one(users, {
        fields: [habits.userId],
        references: [users.id],
    }),
    entries:  many(entries),
    habitTags: many(habitTags),
}))

// Entries -> Habits (One-One)
export const entriesRelations = relations(entries, ({one}) => ({
    habit: one(habits, {
        fields: [entries.habitId],
        references: [habits.id],
    })
}))

// Tags -> HabitTags (Many-One) - (One Tag, Many HabitTags)
export const tagsRelations = relations(tags, ({many}) => ({
    habitTags: many(habitTags)
}))

// HabitTags -> Habit (Many-One) - (One Habit, Many HabitTags)
// HabitTags -> Tag (Many-One) - (One Tag, Many HabitTags)
export const habitTagsRelations = relations(habitTags, ({one}) => ({
    habit: one(habits, {
        fields: [habitTags.id],
        references: [habits.id]
    }),
    tag: one(tags, {
        fields: [habitTags.tagId],
        references: [tags.id]
    })
}))

// Creating TypeScript types with the same fields as the database table (useful for consistency and type inference)
// These are compile-time types (not runtime models) and match the schema as defined in this file.
// $inferSelect = SELECT * FROM [table]
export type User = typeof users.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type HabitTag = typeof habitTags.$inferSelect;

// createInsertSchema is a Zod Schema
// Runtime Validation which can check TypeScript Types before database insertion to ensure database integrity
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
