"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import RoleGuardModal from "./RoleGuardModal";

export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isLoggedIn, user, loading, openLogin } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      openLogin();                       // ← show login modal instead of redirect
    } else if (
      allowedRoles &&
      user?.role &&
      !allowedRoles.includes(user.role)
    ) {
      setShowRoleModal(true);
    }
  }, [isLoggedIn, user, loading, allowedRoles, openLogin]);

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", background: "var(--color-pageBg)" }}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        style={{ minHeight: "100vh", background: "var(--color-pageBg)" }}
      />
    );
  }

  if (
    allowedRoles &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <RoleGuardModal
        open={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          router.push("/");
        }}
      />
    );
  }

  return <>{children}</>;
}