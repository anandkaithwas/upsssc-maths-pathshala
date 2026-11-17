import React, { useEffect, useState } from "react";
import { getProgress, supabase, supabaseReady } from "../lib/supabase.js";

export default function AuthPanel({ onSessionChange }) {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState({ attempted: 0, correct: 0, accuracy: 0 });

  useEffect(() => {
    if (!supabase) { onSessionChange?.(null); return undefined; }
    let active = true;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      onSessionChange?.(next?.user ?? null);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (active) { setSession(data.session); onSessionChange?.(data.session?.user ?? null); }
    }).catch((error) => { if (active) setMessage(error.message || "Session load नहीं हो सका।"); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [onSessionChange]);

  useEffect(() => {
    let active = true;
    if (!session?.user) {
      setProgress({ attempted: 0, correct: 0, accuracy: 0 });
      return () => { active = false; };
    }
    getProgress(session.user.id)
      .then((value) => { if (active) setProgress(value); })
      .catch(() => { if (active) setMessage("Progress load नहीं हो सका।"); });
    return () => { active = false; };
  }, [session]);

  async function submit(event) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setMessage("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        setMessage(data.session ? "Account बन गया। आप signed in हैं।" : "Verification email भेजा गया है। Email verify करके login करें।");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setMessage("Login सफल रहा।");
      }
    } catch (error) { setMessage(error.message || "Authentication असफल रहा।"); }
    finally { setBusy(false); }
  }

  async function resetPassword() {
    if (!email.trim()) { setMessage("पहले अपना email address दर्ज करें।"); return; }
    setBusy(true); setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
      if (error) throw error;
      setMessage("Password reset link भेज दिया गया है। अपना email देखें।");
    } catch (error) { setMessage(error.message || "Password reset request असफल रहा।"); }
    finally { setBusy(false); }
  }

  async function signOut() {
    setBusy(true);
    try { const { error } = await supabase.auth.signOut(); if (error) throw error; setMessage("आप logout हो गए हैं।"); }
    catch (error) { setMessage(error.message || "Logout असफल रहा।"); }
    finally { setBusy(false); }
  }

  return <section className="account-wrap wrap" id="account"><div className="account-card">
    <div className="account-copy"><span className="eyebrow">YOUR LEARNING, SAVED</span><h2>अपनी तैयारी का progress track करें</h2><p>Free account बनाकर quiz attempts, accuracy और learning history सुरक्षित रखें।</p>
      {session?.user && <div className="account-stats"><div><b>{progress.attempted}</b><small>Attempted</small></div><div><b>{progress.correct}</b><small>Correct</small></div><div><b>{progress.accuracy}%</b><small>Accuracy</small></div></div>}
    </div>
    <div className="account-form">
      {!supabaseReady ? <div className="setup-note"><b>Account setup pending</b><p>Staging Supabase project configure होने पर registration और progress sync चालू होंगे।</p></div>
      : session ? <div className="signed-in"><b>नमस्ते!</b><p>{session.user.email}</p><p className="account-muted">आपका progress इस account से sync होगा।</p><button className="btn secondary small" type="button" onClick={signOut} disabled={busy}>Logout</button></div>
      : <><div className="auth-tabs"><button type="button" className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setMessage(""); }}>Login</button><button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setMessage(""); }}>Create account</button></div>
        <form onSubmit={submit}><label>Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength="8" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="कम से कम 8 characters" /></label><button className="btn primary" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create free account" : "Login"}</button></form>
        {mode === "signin" && <button type="button" className="link" onClick={resetPassword} disabled={busy}>Forgot password?</button>}</>}
      {message && <p className="auth-message" role="status">{message}</p>}
    </div>
  </div></section>;
}
