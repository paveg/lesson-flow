"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingUrlCardProps {
  bookingUrl: string
}

export function BookingUrlCard({ bookingUrl }: BookingUrlCardProps) {
  const { toast } = useToast()

  function copyBookingUrl() {
    navigator.clipboard.writeText(bookingUrl)
    toast({
      title: "コピーしました",
      description: "予約URLをクリップボードにコピーしました",
    })
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>あなたの予約ページ</CardTitle>
        <CardDescription>
          このURLをSNSやウェブサイトでシェアして、予約を受け付けましょう
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="flex-1 rounded-md bg-muted p-3 font-mono text-sm">{bookingUrl}</div>
          <Button size="icon" variant="outline" onClick={copyBookingUrl}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" asChild>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
