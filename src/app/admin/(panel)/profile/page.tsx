"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/types";
import { api, errorMessage } from "@/lib/admin-api";
import { useAuth } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/ui";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [profile, setProfile] = useState({ name: user.name, designation: user.designation, bio: user.bio });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [profileError, setProfileError] = useState("");
  const [pwError, setPwError] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setBusy(true);
    try {
      const res = await api.put<{ user: AdminUser }>("/auth/profile", profile);
      setUser(res.user);
      toast("Profile saved");
    } catch (err) {
      setProfileError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (pw.newPassword !== pw.confirm) return setPwError("New passwords do not match.");
    setBusy(true);
    try {
      await api.put("/auth/password", { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      toast("Password changed. Other devices have been signed out.");
    } catch (err) {
      setPwError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function logoutAll() {
    if (!confirm("Sign out from all devices, including this one?")) return;
    await api.post("/auth/logout-all").catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="a-stack" style={{ maxWidth: 640 }}>
      <form className="a-card a-card-pad a-stack" onSubmit={saveProfile}>
        <h2 style={{ margin: 0 }}>Profile</h2>
        {profileError && <div className="a-alert error">{profileError}</div>}
        <div className="a-field">
          <label>Email</label>
          <input className="a-input" value={user.email} disabled />
        </div>
        <div className="a-grid-2">
          <div className="a-field">
            <label htmlFor="p-name">Name</label>
            <input id="p-name" className="a-input" maxLength={80} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="a-field">
            <label htmlFor="p-desig">Designation</label>
            <input id="p-desig" className="a-input" maxLength={80} value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
          </div>
        </div>
        <div className="a-field">
          <label htmlFor="p-bio">Bio</label>
          <textarea id="p-bio" className="a-textarea" maxLength={500} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </div>
        <div><button className="a-btn a-btn-primary" disabled={busy}>Save profile</button></div>
      </form>

      <form className="a-card a-card-pad a-stack" onSubmit={changePassword}>
        <h2 style={{ margin: 0 }}>Change password</h2>
        {pwError && <div className="a-alert error">{pwError}</div>}
        <div className="a-field">
          <label htmlFor="pw-cur">Current password</label>
          <input id="pw-cur" type="password" className="a-input" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        </div>
        <div className="a-grid-2">
          <div className="a-field">
            <label htmlFor="pw-new">New password</label>
            <input id="pw-new" type="password" className="a-input" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          </div>
          <div className="a-field">
            <label htmlFor="pw-conf">Confirm new password</label>
            <input id="pw-conf" type="password" className="a-input" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </div>
        </div>
        <span className="a-hint">At least 10 characters, with letters and numbers.</span>
        <div><button className="a-btn a-btn-dark" disabled={busy}>Change password</button></div>
      </form>

      <div className="a-card a-card-pad">
        <h2>Security</h2>
        <p className="a-muted" style={{ whiteSpace: "normal", marginBottom: 12 }}>Lost a phone or used a shared computer? Sign out everywhere.</p>
        <button className="a-btn a-btn-danger" onClick={logoutAll}>Sign out of all devices</button>
      </div>
    </div>
  );
}
