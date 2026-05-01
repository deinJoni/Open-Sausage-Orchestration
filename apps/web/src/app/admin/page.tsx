"use client";

import { IssueInvitePanel } from "./_components/issue-invite-panel";

export default function AdminPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl text-foreground">Admin</h1>
        <p className="text-muted-foreground">
          Issue invite codes for new artists
        </p>
      </div>

      <IssueInvitePanel />
    </div>
  );
}
