// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../features/auth/store/useAuthStore';
// import { useSocketStore } from '../stores/useSocketStore';
import { useLanguage } from '../locales/useLanguage';
import { LobbyChat } from '../features/chat/components/LobbyChat';
import { Card } from '@/components/ui/card';

export function LobbyPage() {
  // const { user } = useAuthStore();
  // const { connect } = useSocketStore();
  const { t } = useLanguage();
  // const navigate = useNavigate();

  // Ensures WebSocket connection in the Lobby
  // useEffect(() => {
  //   connect();
  // }, [connect]);

  return (
    <div className="w-full max-w-4xl rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center">
      {/* Lobby Header */}
      <h1 className="mb-2 text-2xl font-bold text-orange-400">
        {t('app.Lobby') || 'Lobby'}
      </h1>
      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Game Modes and Scenario */}
        <div className="lg:col-span-2">
          <Card className="flex h-190 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 shadow-xl">
            <p className="text-sm text-zinc-400">
              {t('lobby.gameModes') || 'Modos de juego en construcción...'}
            </p>
          </Card>
        </div>

        {/* Right Column: Friends and Modular Chat */}
        <div className="flex flex-col gap-6">
          {/* Friends List */}
          <Card className="flex h-80 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-4 shadow-xl">
            <p className="text-sm text-zinc-400">
              {t('lobby.friends') || 'Lista de amigos en construcción...'}
            </p>
          </Card>

          {/* Chat */}
          <LobbyChat />
        </div>
      </div>
    </div>
  );
}
