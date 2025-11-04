import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LessonCard } from "../lesson-card"
import type { Lesson } from "@/lib/db/schema"

const mockLesson: Lesson = {
  id: "1",
  instructorId: "instructor-1",
  title: "Test Lesson",
  description: "This is a test lesson description",
  price: 1000,
  durationMinutes: 60,
  startAt: new Date("2025-12-01T10:00:00"),
  isBooked: false,
  maxStudents: 5,
  meetingUrl: "https://meet.google.com/test",
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("LessonCard", () => {
  it("should render lesson title and description", () => {
    render(<LessonCard lesson={mockLesson} />)
    expect(screen.getByText("Test Lesson")).toBeInTheDocument()
    expect(screen.getByText("This is a test lesson description")).toBeInTheDocument()
  })

  it("should render lesson price", () => {
    render(<LessonCard lesson={mockLesson} />)
    expect(screen.getByText("¥1,000")).toBeInTheDocument()
  })

  it("should render lesson duration", () => {
    render(<LessonCard lesson={mockLesson} />)
    expect(screen.getByText("60分")).toBeInTheDocument()
  })

  it("should render lesson date", () => {
    render(<LessonCard lesson={mockLesson} />)
    expect(screen.getByText(/2025年12月1日/)).toBeInTheDocument()
  })

  it("should show booking badge when lesson is not booked", () => {
    render(<LessonCard lesson={mockLesson} />)
    expect(screen.getByText("予約可能")).toBeInTheDocument()
  })

  it("should not show booking badge when lesson is booked", () => {
    const bookedLesson = { ...mockLesson, isBooked: true }
    render(<LessonCard lesson={bookedLesson} />)
    expect(screen.queryByText("予約可能")).not.toBeInTheDocument()
  })

  it("should render book button when showBookButton is true", () => {
    const onSelect = vi.fn()
    render(<LessonCard lesson={mockLesson} onSelect={onSelect} showBookButton={true} />)
    expect(screen.getByRole("button", { name: /このレッスンを予約する/i })).toBeInTheDocument()
  })

  it("should not render book button when showBookButton is false", () => {
    render(<LessonCard lesson={mockLesson} showBookButton={false} />)
    expect(
      screen.queryByRole("button", { name: /このレッスンを予約する/i })
    ).not.toBeInTheDocument()
  })

  it("should call onSelect when book button is clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<LessonCard lesson={mockLesson} onSelect={onSelect} />)

    const button = screen.getByRole("button", { name: /このレッスンを予約する/i })
    await user.click(button)

    expect(onSelect).toHaveBeenCalledWith(mockLesson)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("should not render book button when lesson is booked", () => {
    const bookedLesson = { ...mockLesson, isBooked: true }
    const onSelect = vi.fn()
    render(<LessonCard lesson={bookedLesson} onSelect={onSelect} />)
    expect(
      screen.queryByRole("button", { name: /このレッスンを予約する/i })
    ).not.toBeInTheDocument()
  })
})
