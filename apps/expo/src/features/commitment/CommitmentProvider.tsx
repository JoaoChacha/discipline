import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

import {
  assertCauseAllocations,
  isValidEmail,
  stakeOutcome,
} from "@discipline/validators";

import type {
  CauseDraft,
  CauseMode,
  FriendDraft,
  PaymentKind,
  PendingInviteDraft,
} from "./types";
import { defaultDueAt } from "./format";

export const FIRST_STEP = 1;
export const LAST_STEP = 5;

interface CommitmentContextValue {
  step: number;
  title: string;
  dueAt: Date;
  amountCents: number;
  causeMode: CauseMode;
  causes: CauseDraft[];
  friend: FriendDraft | null;
  pendingInvite: PendingInviteDraft | null;
  inviteName: string;
  inviteEmail: string;
  paymentKind: PaymentKind;
  consented: boolean;
  submitting: boolean;
  setTitle: (value: string) => void;
  setDueAt: (value: Date) => void;
  setAmountCents: (value: number) => void;
  setCauseMode: (value: CauseMode) => void;
  setCauses: (value: CauseDraft[]) => void;
  setFriend: (value: FriendDraft | null) => void;
  setPendingInvite: (value: PendingInviteDraft | null) => void;
  setInviteName: (value: string) => void;
  setInviteEmail: (value: string) => void;
  setPaymentKind: (value: PaymentKind) => void;
  setConsented: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  canAdvance: boolean;
}

const CommitmentContext = createContext<CommitmentContextValue | null>(null);

export function CommitmentProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(FIRST_STEP);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState(defaultDueAt);
  const [amountCents, setAmountCents] = useState(2500);
  const [causeMode, setCauseMode] = useState<CauseMode>("group");
  const [causes, setCauses] = useState<CauseDraft[]>([]);
  const [friend, setFriend] = useState<FriendDraft | null>(null);
  const [pendingInvite, setPendingInvite] = useState<PendingInviteDraft | null>(
    null,
  );
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [paymentKind, setPaymentKind] = useState<PaymentKind>("apple_pay");
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const goTo = useCallback((nextStep: number) => {
    setStep(Math.max(FIRST_STEP, Math.min(LAST_STEP, nextStep)));
  }, []);

  const next = useCallback(() => {
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }, []);

  const back = useCallback(() => {
    setStep((current) => Math.max(FIRST_STEP, current - 1));
  }, []);

  const canAdvance = useMemo(() => {
    if (step === 1)
      return title.trim().length >= 3 && dueAt.getTime() > Date.now();
    if (step === 2) return amountCents >= 100;
    if (step === 3) {
      try {
        assertCauseAllocations(causes);
        return true;
      } catch {
        return false;
      }
    }
    if (step === 4) {
      return (
        Boolean(friend ?? pendingInvite) ||
        (inviteName.trim().length >= 2 && isValidEmail(inviteEmail))
      );
    }
    return consented && !submitting;
  }, [
    amountCents,
    causes,
    consented,
    dueAt,
    friend,
    inviteEmail,
    inviteName,
    pendingInvite,
    step,
    submitting,
    title,
  ]);

  const value = useMemo(
    () => ({
      step,
      title,
      dueAt,
      amountCents,
      causeMode,
      causes,
      friend,
      pendingInvite,
      inviteName,
      inviteEmail,
      paymentKind,
      consented,
      submitting,
      setTitle,
      setDueAt,
      setAmountCents,
      setCauseMode,
      setCauses,
      setFriend,
      setPendingInvite,
      setInviteName,
      setInviteEmail,
      setPaymentKind,
      setConsented,
      setSubmitting,
      next,
      back,
      goTo,
      canAdvance,
    }),
    [
      amountCents,
      back,
      canAdvance,
      causeMode,
      causes,
      consented,
      dueAt,
      friend,
      goTo,
      inviteEmail,
      inviteName,
      next,
      paymentKind,
      pendingInvite,
      step,
      submitting,
      title,
    ],
  );

  return (
    <CommitmentContext.Provider value={value}>
      {children}
    </CommitmentContext.Provider>
  );
}

export function useCommitment() {
  const value = use(CommitmentContext);
  if (!value) {
    throw new Error("useCommitment must be used inside CommitmentProvider");
  }
  return value;
}

export function useStakeMath() {
  const { amountCents } = useCommitment();
  return stakeOutcome(amountCents);
}
