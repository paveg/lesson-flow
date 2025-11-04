import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "../button"

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("should render button with default variant", () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-primary")
  })

  it("should render button with secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-secondary")
  })

  it("should render button with outline variant", () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("border")
  })

  it("should render disabled button", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("should render button with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole("button")
    expect(button).toHaveClass("h-9")

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole("button")
    expect(button).toHaveClass("h-11")
  })
})
