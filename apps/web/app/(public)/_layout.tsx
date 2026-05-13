import { Slot, usePathname, useRouter } from "expo-router";
import { PublicLayout } from "@/lib/ui/layouts/PublicLayout";
import { useTheme } from "../../src/providers/theme-provider";
import { EThemeMode } from "@/lib/constants/enums";

export default function PublicLayoutRoute() {
  const { mode, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  return (
    <PublicLayout
      isDark={mode === EThemeMode.DARK}
      onThemeToggle={toggle}
      onNavigate={handleNavigate}
      currentRoute={pathname}
    >
      <Slot />
    </PublicLayout>
  );
}
