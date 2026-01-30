import { db } from "./connection.ts"
import { users, habits, entries, tags, habitTags } from "./schema.ts"
import { pathToFileURL } from "node:url"

const seed = () => async() => {
    console.log("🌱 Start database seed...")

    try
    {
        console.log("Clearing existing data...")
        await db.delete(users)
        await db.delete(habits)
        await db.delete(entries)
        await db.delete(tags)
        await db.delete(habitTags)

        console.log("Creating demo user - Claire")

        // [claireUser] is a destructure
        const [claireUser] = await db.insert(users).values({
            email: "claire.e@tech.io",
            password: "claire10987",
            firstName: "Claire",
            lastName: "Ethereal",
            userName: "claire_cutie"
        }).returning()

        console.log("Creating demo tags - Health, Productivity")

        const [healthTag] = await db.insert(tags).values({
            name: "Health",
            color: "#00F7FF",
        }).returning()

        const [productivityTag] = await db.insert(tags).values({
            name: "Productivity",
            color: "#FF6500"
        }).returning()

        console.log("Creating demo habit - Exercise")

        const [exerciseHabit] = await db.insert(habits).values({
            userId: claireUser.id,
            name: "Exercise",
            description: "Doing Cardiovascular Exercises like Jogging for 15 minutes",
            frequency: "daily",
            targetCounts: 1,
            isActive: true,
        }).returning()

        await db.insert(habitTags).values({
            habitId: exerciseHabit.id,
            tagId: healthTag.id,
        }).returning()

        console.log("Adding completion entries")

        const today = new Date()
        today.setHours(12,0,0,0)

        // Completed exercise for a week (7 days, 1 times per day)
        for (let i = 0; i < 7; i++)
        {
            const date = new Date(today)
            // From today then moving to 7 days ago (if it reaches i = 6)
            date.setDate(date.getDate() - i)
            await db.insert(entries).values({
                habitId: exerciseHabit.id,
                completionDate: date,
                note: `Good Job! Keep it up! Streak: ${i}`
            })
        }

        const claireHabits = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, "claire.e@tech.io"),
            with: {
                habits: {
                    with: {
                        entries: true,
                        habitTags: {
                            with: { tag: true },
                        },
                    },
                },
            }
        })

        console.log("✅ Database seeded successfully.")
        console.log("\n📊 Seed Summary:")
        console.log(`- User Claire has ${claireHabits?.habits.length || 0} habits`)
        console.log("\n🔑 Login Credentials:")
        console.log("Email: claire.e@tech.io")
        console.log("Password: claire1098")
    }
    catch (error) {
        console.error('❌ Database seeded failed:', error)
    }
}


// This code is used to prevent automatic execution when the file is imported elsewhere
if (import.meta.url === pathToFileURL(process.argv[1]!).href) {
  seed()()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default seed