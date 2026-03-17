"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toggleUserActive, resetUserPassword } from "@/actions/admin";
import type { Dictionary } from "@/i18n/get-dictionary";

type SerializedAddress = {
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

type SerializedOrder = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
};

type SerializedUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  accountType: string;
  membershipTier: string;
  rewardPoints: number;
  createdAt: string;
  orderCount: number;
  wishlistCount: number;
  reviewCount: number;
  addresses: SerializedAddress[];
  recentOrders: SerializedOrder[];
};

const statusColors: Record<string, string> = {
  processing: "bg-orange-100 text-orange-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminUsers({
  dict,
  users,
}: {
  dict: Dictionary;
  users: SerializedUser[];
}) {
  const t = dict.admin;
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  function handleToggle(userId: string) {
    startTransition(async () => {
      await toggleUserActive(userId);
    });
  }

  function handleResetConfirm() {
    if (!confirmModal) return;
    const { userId } = confirmModal;
    startTransition(async () => {
      await resetUserPassword(userId);
      setConfirmModal(null);
    });
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t.usersTitle}</h1>
        <p className="text-slate-500 mt-1">{t.usersSubtitle}</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 text-slate-400">{t.noUsers}</div>
      ) : (
        <div className="space-y-4">
          {users.map((user, idx) => {
            const isDisabled = user.accountType === "disabled";
            const isAdmin = user.role === "admin";
            const expanded = expandedId === user.id;

            return (
              <UserCard
                key={user.id}
                user={user}
                t={t}
                isDisabled={isDisabled}
                isAdmin={isAdmin}
                expanded={expanded}
                isPending={isPending}
                even={idx % 2 === 0}
                onToggle={() => setExpandedId(expanded ? null : user.id)}
                onToggleActive={() => handleToggle(user.id)}
                onResetPassword={() => setConfirmModal({ userId: user.id, userName: user.name })}
              />
            );
          })}
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          t={t}
          userName={confirmModal.userName}
          isPending={isPending}
          onConfirm={handleResetConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}

function UserCard({
  user,
  t,
  isDisabled,
  isAdmin,
  expanded,
  isPending,
  even,
  onToggle,
  onToggleActive,
  onResetPassword,
}: {
  user: SerializedUser;
  t: Dictionary["admin"];
  isDisabled: boolean;
  isAdmin: boolean;
  expanded: boolean;
  isPending: boolean;
  even: boolean;
  onToggle: () => void;
  onToggleActive: () => void;
  onResetPassword: () => void;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 shadow-sm overflow-hidden ${even ? "bg-white" : "bg-slate-100"}`}>
      {/* User summary row */}
      <div className="flex items-center gap-4 p-4">
        {/* Avatar */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl text-primary">person</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 truncate">{user.name}</h3>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isAdmin ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {isAdmin ? t.admin : t.user}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isDisabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {isDisabled ? t.inactive : t.active}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {user.email} · <span className="capitalize">{user.membershipTier}</span> · {t.totalOrders}: {user.orderCount} · {formatDate(user.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-xs"
          >
            <span className="material-symbols-outlined text-base">
              {expanded ? "expand_less" : "expand_more"}
            </span>
            {expanded ? t.close : t.userDetails}
          </button>
          {!isAdmin && (
            <>
              <button
                onClick={onToggleActive}
                disabled={isPending}
                className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ${
                  isDisabled
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                } disabled:opacity-50`}
              >
                {isDisabled ? t.activate : t.deactivate}
              </button>
              <button
                onClick={onResetPassword}
                disabled={isPending}
                className="text-xs font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {t.resetPassword}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-100 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info */}
            <div>
              <h4 className="font-bold text-slate-700 mb-3">{t.userInfo}</h4>
              <div className="space-y-3 text-sm">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.email}</p>
                  <p className="text-slate-900">{user.email}</p>
                </div>
                {user.phone && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.phone}</p>
                    <p className="text-slate-900">{user.phone}</p>
                  </div>
                )}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.membershipTier}</p>
                  <p className="text-slate-900 capitalize">{user.membershipTier}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <p className="text-lg font-bold text-slate-900">{user.rewardPoints}</p>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{t.rewardPoints}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <p className="text-lg font-bold text-slate-900">{user.wishlistCount}</p>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{t.wishlist}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <p className="text-lg font-bold text-slate-900">{user.reviewCount}</p>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{t.reviews}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h4 className="font-bold text-slate-700 mb-3">{t.recentOrders}</h4>
              {user.recentOrders.length > 0 ? (
                <div className="space-y-2">
                  {user.recentOrders.map((order) => (
                    <div key={order.orderNumber} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{order.orderNumber}</p>
                        <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(order.total)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[order.status] || statusColors.processing}`}>
                          {t[order.status as keyof typeof t] as string}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-center text-slate-400 text-sm">
                  {t.noOrders}
                </div>
              )}
            </div>

            {/* Addresses */}
            <div>
              <h4 className="font-bold text-slate-700 mb-3">{t.addresses}</h4>
              {user.addresses.length > 0 ? (
                <div className="space-y-2">
                  {user.addresses.map((addr, addrIdx) => (
                    <div key={addrIdx} className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p>{addr.firstName} {addr.lastName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p>{addr.country}</p>
                      {addr.phone && <p className="text-slate-400 mt-1">{addr.phone}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-center text-slate-400 text-sm">
                  {t.noAddresses}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmModal({
  t,
  userName,
  isPending,
  onConfirm,
  onCancel,
}: {
  t: Dictionary["admin"];
  userName: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onCancel();
    },
    [onCancel, isPending]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={isPending ? undefined : onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-6 pb-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 shrink-0">
            <span className="material-symbols-outlined text-2xl text-orange-600">lock_reset</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t.resetPassword}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{userName}</p>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-slate-600">{t.resetPasswordConfirm}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isPending && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isPending ? t.processing : t.resetPassword}
          </button>
        </div>
      </div>
    </div>
  );
}
