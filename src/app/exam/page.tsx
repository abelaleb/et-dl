import { Suspense } from "react";
import { ExamRunner } from "@/components/exam/ExamRunner";

export default function ExamPage() {
  return (
    <div className="py-6 sm:py-10">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <ExamRunner />
      </Suspense>
    </div>
  );
}
