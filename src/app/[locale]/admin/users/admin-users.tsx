"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";
import { toggleUserActive, resetUserPassword } from "@/actions/admin";
import type { Dictionary } from "@/i18n/get-dictionary";

type SerializedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: string;
  membershipTier: string;
  rewardPoints: number;
  createdAt: string;
  orderCount: number;
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.name}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.email}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.role}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.membershipTier}</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">{t.totalOrders}</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.joined}</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">{t.status}</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isDisabled = user.accountType === "disabled";
                  const isAdmin = user.role === "admin";

                  return (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isAdmin
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isAdmin ? t.admin : t.user}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-slate-600">{user.membershipTier}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">{user.orderCount}</td>
                      <td className="px-6 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isDisabled
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isDisabled ? t.inactive : t.active}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!isAdmin && (
                            <>
                              <button
                                onClick={() => handleToggle(user.id)}
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
                                onClick={() => setConfirmModal({ userId: user.id, userName: user.name })}
                                disabled={isPending}
                                className="text-xs font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                              >
                                {t.resetPassword}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset Password Confirmation Modal */}
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
      if (e.key === "Escape") onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-6 pb-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 shrink-0">
            <span className="material-symbols-outlined text-2xl text-orange-600">lock_reset</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t.resetPassword}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{userName}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-slate-600">{t.resetPasswordConfirm}</p>
        </div>

        {/* Actions */}
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
