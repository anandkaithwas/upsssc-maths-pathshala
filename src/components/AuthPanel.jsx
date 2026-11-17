import React, { useEffect, useState } from "react";
import { getProgress, supabase, supabaseReady } from "../lib/supabase.js";

export default function AuthPanel({ onSessionChange }) {
  const [session, setSession] = useState(null);
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
    if (!session?.user) return undefined;
    let active = true;
    const refresh = () => getProgress(session.user.id)
      .then((value) => { if (active) setProgress(value); })
      .catch(() => { if (active) setMessage("Progress load नहीं हो सका।"); });
    window.addEventListener("quiz-attempt-saved", refresh);
    return () => { active = false; window.removeEventListener("quiz-attempt-saved", refresh); };
  }, [session]);

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
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setMessage("Login सफल रहा।");
    } catch (error) {
      setMessage(error.message || "Login असफल रहा। केवल आमंत्रित students ही login कर सकते हैं।");
    } finally { setBusy(false); }
  }

  async function resetPassword() {
    if (!email.trim()) { setMessage("पहले अपना invitation वाला email address दर्ज करें।"); return; }
    setBusy(true); setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
      if (error) throw error;
      setMessage("यदि इस email पर account मौजूद है, तो password reset link भेज दिया गया है। अपना email देखें।");
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
    <div className="account-copy"><span className="eyebrow">PRIVATE STUDENT BETA</span><h2>अपने account से login करें</h2><p>यह 25–30 चुने हुए students के लिए सीमित beta है। Login के बाद ही learning area खुलेगा। Account केवल invitation से मिलेगा।</p>
      {session?.user && <div className="account-stats"><div><b>{progress.attempted}</b><small>Attempted</small></div><div><b>{progress.correct}</b><small>Correct</small></div><div><b>{progress.accuracy}%</b><small>Accuracy</small></div></div>}
    </div>
    <div className="account-form">
      {!supabaseReady ? <div className="setup-note"><b>Beta login setup pending</b><p>Staging Supabase project configure होने के बाद invited students login कर पाएँगे। अभी student access बंद है।</p></div>
      : session ? <div className="signed-in"><b>नमस्ते!</b><p>{session.user.email}</p><p className="account-muted">आपका learning progress इस account से sync होगा।</p><button className="btn secondary small" type="button" onClick={signOut} disabled={busy}>Logout</button></div>
      : <><form onSubmit={submit}><label>Invitation वाला email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="अपना account password" /></label><button className="btn primary" disabled={busy}>{busy ? "Please wait…" : "Login to free beta"}</button></form><p className="invite-only-note">Account नहीं है? Pilot coordinator से invitation माँगें। Public registration बंद है।</p><button type="button" className="link" onClick={resetPassword} disabled={busy}>Forgot password?</button></>}
      {message && <p className="auth-message" role="status">{message}</p>}
    </div>
  </div></section>;
}
