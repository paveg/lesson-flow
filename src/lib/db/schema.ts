import { pgTable, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed'])
export const planEnum = pgEnum('plan', ['free', 'pro'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'past_due'])

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  profileImageUrl: text('profile_image_url'),
  stripeAccountId: text('stripe_account_id').unique(),
  onboardingAt: timestamp('onboarding_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const lessons = pgTable('lessons', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  instructorId: text('instructor_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // 円単位
  durationMinutes: integer('duration_minutes').notNull().default(60),
  startAt: timestamp('start_at').notNull(),
  meetingUrl: text('meeting_url'), // オンライン会議URL (Zoom, Google Meet, Teamsなど)
  maxStudents: integer('max_students').notNull().default(1),
  isBooked: boolean('is_booked').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  lessonId: text('lesson_id').notNull().unique().references(() => lessons.id),
  studentEmail: text('student_email').notNull(),
  studentName: text('student_name').notNull(),
  paymentIntentId: text('payment_intent_id').notNull().unique(),
  amount: integer('amount').notNull(),
  status: bookingStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().unique().references(() => users.id),
  plan: planEnum('plan').notNull().default('free'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripePriceId: text('stripe_price_id'),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Lesson = typeof lessons.$inferSelect
export type NewLesson = typeof lessons.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
