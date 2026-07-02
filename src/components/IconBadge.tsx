import {
  BookOpen,
  FlaskConical,
  GraduationCap,
  LucideIcon,
  Microscope,
  Presentation
} from "lucide-react";

import type { Service } from "@/lib/content";

const icons: Record<Service["icon"], LucideIcon> = {
  graduation: GraduationCap,
  book: BookOpen,
  microscope: Microscope,
  flask: FlaskConical,
  presentation: Presentation
};

export function IconBadge({ icon, label }: { icon: Service["icon"]; label: string }) {
  const Icon = icons[icon];

  return (
    <span className="icon-badge" aria-label={label}>
      <Icon aria-hidden="true" size={22} />
    </span>
  );
}
