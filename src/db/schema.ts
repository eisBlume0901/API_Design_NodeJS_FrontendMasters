import { pgTableCreator, uuid, varchar, text, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

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