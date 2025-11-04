"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { createLessonSchema, type CreateLessonInput } from "@/lib/validations/lesson"
import { createLesson } from "@/app/actions/lessons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface CreateLessonFormProps {
  children: React.ReactNode
}

export function CreateLessonForm({ children }: CreateLessonFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<CreateLessonInput>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 1000,
      durationMinutes: 60,
      startAt: new Date(),
      meetingUrl: "",
      maxStudents: 1,
    },
  })

  async function onSubmit(data: CreateLessonInput) {
    setIsSubmitting(true)
    try {
      const result = await createLesson(data)

      if (!result.success) {
        throw new Error(result.message || "レッスンの作成に失敗しました")
      }

      toast({
        title: "レッスンを作成しました",
        description: "レッスンが正常に作成されました",
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "レッスンの作成に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新しいレッスンを作成</DialogTitle>
          <DialogDescription>
            レッスンの詳細を入力してください。すべての必須項目を入力する必要があります。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>レッスンタイトル *</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 英会話レッスン（60分）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="レッスンの内容や目的を説明してください"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>料金（円） *</FormLabel>
                    <FormControl>
                      <Input type="number" min={100} placeholder="1000" {...field} />
                    </FormControl>
                    <FormDescription>最低100円以上</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>レッスン時間（分）</FormLabel>
                    <FormControl>
                      <Input type="number" min={15} placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日時 *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : new Date()
                        field.onChange(date)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meetingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>オンライン会議URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://meet.google.com/... または https://zoom.us/j/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Google Meet、Zoom、Teamsなどのオンライン会議URLを入力してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>定員</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>同時に受け入れる生徒数</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "作成中..." : "レッスンを作成"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
