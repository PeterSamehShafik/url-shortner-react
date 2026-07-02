import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainLayout>
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <h1 className="text-7xl font-extrabold tracking-tight text-primary">
              404
            </h1>

            <h2 className="mt-4 text-3xl font-semibold">Page Not Found</h2>

            <p className="mt-3 text-muted-foreground">
              Sorry, the page you're looking for doesn't exist or the shortened
              link is no longer available.
            </p>
            <Button asChild className="mt-8">
              <Link to="/">Go Back Home</Link>
            </Button>
          </div>
        </main>
      </MainLayout>
    </div>
  );
}
