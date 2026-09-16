import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";

import { AuthField } from "~/features/auth/AuthField";
import { ScreenCopy } from "~/features/onboarding/components/ScreenCopy";
import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { trpc } from "~/utils/api";
import { useCommitment } from "../CommitmentProvider";
import { RadioRow } from "../components/RadioRow";

export function VerifierScreen() {
  const friends = useQuery(trpc.friend.list.queryOptions());
  const list = friends.data ?? [];

  if (list.length === 0) {
    return <InviteForm />;
  }

  return <FriendList friends={list} />;
}

function FriendList({
  friends,
}: {
  friends: { id: string; name: string; handle?: string | null }[];
}) {
  const { friend, pendingInvite, setFriend, setPendingInvite } =
    useCommitment();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View>
      <ScreenCopy
        eyebrow="WHO CHECKS THE PROOF"
        title="Pick someone you trust."
        description="They see this action, deadline, and proof — never payment details."
      />
      <SurfaceCard style={{ marginTop: 22 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Invite a person"
          onPress={() => setSheetOpen(true)}
          testID="commitment-open-invite"
          style={{
            minHeight: 64,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <LimeTile name="add" />
          <Text style={{ flex: 1, fontWeight: "600" }}>Invite a person</Text>
        </Pressable>
        {pendingInvite ? (
          <RadioRow
            selected={!friend}
            onPress={() => setFriend(null)}
            title={pendingInvite.displayName}
            caption="Pending — invite sent"
            leading={<LimeTile name="mail-outline" />}
          />
        ) : null}
        {friends.map((item) => (
          <RadioRow
            key={item.id}
            selected={friend?.id === item.id}
            onPress={() => {
              setPendingInvite(null);
              setFriend({
                id: item.id,
                name: item.name,
                handle: item.handle,
              });
            }}
            title={item.name}
            caption={item.handle ? `@${item.handle}` : "Accepted friend"}
            leading={<LimeTile name="person-outline" />}
            testID={`commitment-friend-${item.id}`}
          />
        ))}
      </SurfaceCard>
      <PrivacyRecap />
      <InviteSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </View>
  );
}

function InviteForm() {
  const {
    pendingInvite,
    inviteName,
    inviteEmail,
    setInviteName,
    setInviteEmail,
  } = useCommitment();

  return (
    <View>
      <ScreenCopy
        eyebrow="WHO CHECKS THE PROOF"
        title="Invite someone you trust."
        description="A verifier confirms your proof. Add one person to continue."
      />
      {pendingInvite ? (
        <SurfaceCard style={{ marginTop: 22 }}>
          <RadioRow
            selected
            onPress={() => undefined}
            title={pendingInvite.displayName}
            caption="Pending — invite sent"
            leading={<LimeTile name="mail-outline" />}
          />
        </SurfaceCard>
      ) : null}
      <View style={{ marginTop: pendingInvite ? 16 : 22, gap: 14 }}>
        <AuthField
          label="Name"
          value={inviteName}
          onChangeText={setInviteName}
          placeholder="Sam Rivera"
          autoComplete="name"
          textContentType="name"
          testID="commitment-invite-name"
        />
        <AuthField
          label="Email"
          value={inviteEmail}
          onChangeText={setInviteEmail}
          placeholder="sam@example.com"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          testID="commitment-invite-email"
        />
        <Text style={{ fontSize: 12, lineHeight: 16, opacity: 0.7 }}>
          They get an email with what they will and will not see.
        </Text>
      </View>
      <PrivacyRecap />
    </View>
  );
}

function InviteSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { setPendingInvite, setFriend } = useCommitment();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createInvite = useMutation(
    trpc.invitation.createEmail.mutationOptions({
      onSuccess: (result) => {
        setFriend(null);
        setPendingInvite({
          id: result.id,
          displayName: result.displayName ?? displayName,
          email: result.email ?? email,
        });
        onClose();
      },
      onError: (err) => {
        setError(err.message);
      },
    }),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close invite"
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(14,12,13,0.28)" }}
      />
      <View
        style={{
          backgroundColor: colors.field,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: spacing.screenX,
          paddingTop: 12,
          paddingBottom: 28,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: 44,
            height: 4,
            borderRadius: 999,
            backgroundColor: colors.hairline,
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: colors.ink,
            marginBottom: 16,
          }}
        >
          Invite a person
        </Text>
        <View style={{ gap: 14 }}>
          <AuthField
            label="Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Sam Rivera"
            autoComplete="name"
            testID="commitment-sheet-name"
          />
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="sam@example.com"
            autoComplete="email"
            keyboardType="email-address"
            testID="commitment-sheet-email"
          />
          {error ? (
            <Text style={{ color: "#B42318", fontSize: 13 }}>{error}</Text>
          ) : (
            <Text style={{ fontSize: 12, lineHeight: 16, color: colors.muted }}>
              They get an email with what they will and will not see.
            </Text>
          )}
          <CapsuleButton
            label={createInvite.isPending ? "Sending…" : "Send invite"}
            onPress={() => createInvite.mutate({ displayName, email })}
            disabled={createInvite.isPending}
            testID="commitment-sheet-send"
          />
        </View>
      </View>
    </Modal>
  );
}

function PrivacyRecap() {
  const { type } = useTheme();

  return (
    <SurfaceCard style={{ marginTop: 12 }}>
      <Text style={type.callout}>What they see</Text>
      <Text style={[type.caption, { marginTop: 6 }]}>
        Your action, deadline, and proof. Never payment details or other
        activity. You choose a verifier for each commitment.
      </Text>
    </SurfaceCard>
  );
}
