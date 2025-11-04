import { z } from "zod"

export const createLessonSchema = z.object({
  title: z.string().min(1, "レッスンタイトルは必須です"),
  description: z.string().optional(),
  price: z.coerce.number().min(100, "料金は100円以上である必要があります"),
  durationMinutes: z.coerce.number().default(60),
  startAt: z.date({
    required_error: "開始日時は必須です",
  }),
  meetingUrl: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  maxStudents: z.coerce.number().min(1, "定員は1名以上である必要があります").default(1),
})

export type CreateLessonInput = z.infer<typeof createLessonSchema>
