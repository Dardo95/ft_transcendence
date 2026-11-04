# Temporary Game Lab frontend preview

This patch is for local development only. It is not intended to be committed or pushed.

## Files included

- `frontend/src/App.tsx`: makes `/game` available and keeps `/game/:id` for reconnecting to a session.
- `frontend/src/pages/LobbyPage.tsx`: adds a temporary Game Lab entry point and preserves the existing chat/lobby socket while navigating from `/lobby` to `/game`.
- `frontend/src/pages/GamePage.tsx`: temporary matchmaking and live-game UI.
- `frontend/src/pages/GamePage.css`: styling for the temporary screen and board.
- `frontend/src/features/game/components/GameBoard.tsx`: renders the authoritative board snapshot and game entities.

No dependency or lockfile changes are required. It uses the existing `gameSocket`, `chatSocket`, React Router and shared game types.

## Apply locally

From the repository root, extract this ZIP and allow it to merge the `frontend/` folder into the project. Alternatively, copy the included files to the exact paths listed above.

Start the backend and frontend using the repository's normal development commands. Log in, open the Lobby page, then click **Abrir Game Lab (dev)**. The Lobby-to-Game Lab navigation intentionally keeps the chat namespace connected because the current ChatGateway removes a user from their lobby when that socket disconnects.

The Game Lab defaults to Practice. Select a mode and click **Iniciar partida**. Keyboard controls while the game is RUNNING:

- `W`, `A`, `S`, `D` or arrow keys: move.
- `Space`: place a bomb.

For Public and Private matchmaking, every lobby member who should receive the match must also have the Game Lab page open so their `/game` Socket.IO namespace is connected.

## Current preview limitations

- This is a temporary developer UI, not the final game design.
- It renders the server's 20 Hz snapshots using a CSS grid; it does not simulate gameplay in the browser.
- Only `map1` is exposed in the selector. In the source ZIP used to prepare this preview, `map1.txt`, `map2.txt` and `map3.txt` contain the same layout.
- The current backend controls movement while the match status is `RUNNING`. Overtime is displayed if a future backend snapshot reports it, but controls are not enabled for Overtime in this preview.
- The page expects the existing HttpOnly `access_token` cookie and the configured `/game` namespace. It does not read or expose the JWT in JavaScript.

## Remove the preview

If the affected files had no unrelated local changes before applying this patch, run from the repository root:

```bash
git restore frontend/src/App.tsx frontend/src/pages/LobbyPage.tsx frontend/src/pages/GamePage.tsx
rm frontend/src/pages/GamePage.css
rm frontend/src/features/game/components/GameBoard.tsx
```

If any of those files already had local work, save a copy before applying this patch and restore that copy instead of using `git restore`.
