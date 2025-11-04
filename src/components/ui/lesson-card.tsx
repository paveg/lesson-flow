import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Banknote } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { Lesson } from "@/lib/db/schema"

interface LessonCardProps {
  lesson: Lesson
  onSelect?: (lesson: Lesson) => void
  showBookButton?: boolean
}

export function LessonCard({ lesson, onSelect, showBookButton = true }: LessonCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{lesson.title}</CardTitle>
          {!lesson.isBooked && (
            <Badge variant="secondary" className="ml-2">
              予約可能
            </Badge>
          )}
        </div>
        {lesson.description && (
          <CardDescription className="mt-2">{lesson.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(new Date(lesson.startAt), "yyyy年M月d日 (E) HH:mm", { locale: ja })}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{lesson.durationMinutes}分</span>
        </div>
        <div className="flex items-center text-sm font-semibold">
          <Banknote className="mr-2 h-4 w-4" />
          <span>¥{lesson.price.toLocaleString()}</span>
        </div>
      </CardContent>
      {showBookButton && !lesson.isBooked && onSelect && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => onSelect(lesson)}
          >
            このレッスンを予約する
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
