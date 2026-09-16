export type PaymentKind = "apple_pay" | "card";
export type CauseMode = "one" | "group";

export interface CauseDraft {
  charityId: string;
  percent: number;
}

export interface PendingInviteDraft {
  id: string;
  displayName: string;
  email: string;
}

export interface FriendDraft {
  id: string;
  name: string;
  handle?: string | null;
}
