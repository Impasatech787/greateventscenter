"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BookingCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-center text-center">
          <div className="flex flex-col items-center">
            {" "}
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
              aria-hidden="true"
            >
              <span className="text-3xl font-semibold leading-none">×</span>
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription className="max-w-sm">
              We couldn&apos;t process your payment. This could be due to card
              issues, insufficient funds, or a temporary network error.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* {bookingId ? (
            <div className="text-sm text-muted-foreground">
              Reference{" "}
              <span className="font-medium text-foreground">#{bookingId}</span>
            </div>
          ) : null} */}

          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm">
            <div className="font-medium text-destructive">
              Common reasons for payment failure:
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-destructive">
              <li>Insufficient funds in your account</li>
              <li>Incorrect card details</li>
              <li>Card expired or blocked</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full gap-2">
            <Button
              type="button"
              className="flex-1"
              variant="destructive"
              onClick={() => router.back()}
            >
              Try Again
            </Button>
            <Button
              type="button"
              className="flex-1"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="mailto:hello@greatevents.com"
            >
              Contact Support
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
