import { Suspense } from "react";
import { SignCatalog } from "@/components/signs/SignCatalog";

export default function SignsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignCatalog />
    </Suspense>
  );
}
