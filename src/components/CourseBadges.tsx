import { HStack } from "@seed-design/react";
import { Badge } from "seed-design/ui/badge";
import type { Course } from "../lib/sheet";

export function requirementTone(value: string) {
  if (value.startsWith("필수")) return "critical" as const;
  if (value === "권장") return "informative" as const;
  return "neutral" as const;
}

export function CourseBadges({ course }: { course: Course }) {
  return (
    <HStack gap="x1_5" wrap>
      <Badge tone={requirementTone(course.이수구분)} variant="weak" size="medium">
        {course.이수구분}
      </Badge>
      <Badge tone="brand" variant="weak" size="medium">
        {course.교육방식}
      </Badge>
      <Badge tone="neutral" variant="weak" size="medium">
        {course.분야}
      </Badge>
    </HStack>
  );
}
