import { createFileRoute } from "@tanstack/react-router";
import { TemplePage } from "@/components/temple-page";

export const Route = createFileRoute("/")({
  component: TemplePage,
});
