import { describe, it, expect } from "vitest"
import { createLessonSchema } from "../lesson"

describe("createLessonSchema", () => {
  it("should validate valid lesson data", () => {
    const validData = {
      title: "Test Lesson",
      description: "This is a test lesson",
      price: 1000,
      durationMinutes: 60,
      startAt: new Date("2025-12-01T10:00:00"),
      meetingUrl: "https://meet.google.com/abc-def-ghi",
      maxStudents: 5,
    }

    const result = createLessonSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("should reject price less than 100", () => {
    const invalidData = {
      title: "Test Lesson",
      price: 50,
      durationMinutes: 60,
      startAt: new Date("2025-12-01T10:00:00"),
      maxStudents: 1,
    }

    const result = createLessonSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it("should reject empty title", () => {
    const invalidData = {
      title: "",
      price: 1000,
      durationMinutes: 60,
      startAt: new Date("2025-12-01T10:00:00"),
      maxStudents: 1,
    }

    const result = createLessonSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it("should accept optional fields as undefined", () => {
    const validData = {
      title: "Test Lesson",
      price: 1000,
      durationMinutes: 60,
      startAt: new Date("2025-12-01T10:00:00"),
      maxStudents: 1,
    }

    const result = createLessonSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("should validate date type for startAt", () => {
    const invalidData = {
      title: "Test Lesson",
      price: 1000,
      durationMinutes: 60,
      startAt: "invalid-date",
      maxStudents: 1,
    }

    const result = createLessonSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
