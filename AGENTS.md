<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Auth: Lovable Cloud email/password; protected pages live under `src/routes/_authenticated/` (client-only gate redirecting to `/entrar`). Why: session is in localStorage, so the gate must run in the browser.
- User profile data lives in `public.profiles` (created by signup trigger, RLS own-row only). Why: never trust auth metadata for app data access.
