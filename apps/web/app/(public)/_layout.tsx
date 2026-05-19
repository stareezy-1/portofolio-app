import { Slot, usePathname, useRouter } from "expo-router";
import { PublicLayout } from "@/lib/ui/layouts/PublicLayout";

export default function PublicLayoutRoute() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  return (
    <PublicLayout
      isDark={true}
      onNavigate={handleNavigate}
      currentRoute={pathname}
    >
      <Slot />
    </PublicLayout>
  );
}
