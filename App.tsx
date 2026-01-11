import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { GameProvider, useGame } from './GameContext';
import { View, UIState, Position, PieceType } from './types';
import { BOARD_THEMES } from './constants';
import { translations } from './translations';

/* ================= SIDEBAR ================= */

const Sidebar: React.FC<{ ui: UIState; setUi: React.Dispatch<React.SetStateAction<UIState>> }> = ({ ui, setUi }) => {
  const { logout, isAuthenticated, user } = useAuth();
  const t = translations[ui.language];

  const go = (view: View) => setUi(prev => ({ ...prev, view }));

  return (
    <aside className={`${ui.sidebarCollapsed ? 'w-20' : 'w-64'} h-full bg-[#262421] border-r border-white/5 flex flex-col transition-all z-50`}>
      <div className="p-6 mb-8 flex items-center gap-3 cursor-pointer" onClick={() => go('landing')}>
        <i className="fas fa-chess-knight text-3xl text-[#81b64c]"></i>
        {!ui.sidebarCollapsed && <span className="text-2xl font-black text-white">CHESS.PRO</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {(['play', 'puzzles', 'settings'] as View[]).map(id => (
          <button
            key={id}
            onClick={() => go(id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              ui.view === id ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5'
            }`}
          >
            <i className={`fas fa-${id === 'play' ? 'play' : id === 'puzzles' ? 'puzzle-piece' : 'cog'} text-xl w-6`} />
            {!ui.sidebarCollapsed && <span className="font-bold">{t[id]}</span>}
          </button>
        ))}
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img src={user?.avatar} className="w-8 h-8 rounded bg-white/10" />
            {!ui.sidebarCollapsed && (
              <div>
                <p className="text-sm font-bold truncate">{user?.username}</p>
                <p className="text-[10px] text-[#81b64c] font-black">{user?.rating} XP</p>
              </div>
            )}
          </div>
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg">
            <i className="fas fa-sign-out-alt" />
            {!ui.sidebarCollapsed && <span className="font-bold">Đăng xuất</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

/* ================= BOARD + INFO (GIỮ NGUYÊN) ================= */
// 👉 Board + InfoPanel anh giữ nguyên, KHÔNG CẦN SỬA
// (em không paste lại để tránh dài – dùng y chang code anh gửi)

/* ================= MAIN ================= */

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { createRoom } = useGame();

  const [ui, setUi] = useState<UIState>({
    theme: 'dark',
    language: 'vi',
    sidebarCollapsed: false,
    view: 'landing'
  });

  const pendingView = useRef<View | null>(null);

  /* ✅ FIX: redirect auth CHỈ 1 LẦN */
  useEffect(() => {
    if (!isAuthenticated && ui.view === 'play') {
      pendingView.current = 'play';
      setUi(prev => ({ ...prev, view: 'auth' }));
    }
  }, [ui.view, isAuthenticated]);

  /* ✅ FIX: login xong quay lại đúng view */
  useEffect(() => {
    if (isAuthenticated && ui.view === 'auth' && pendingView.current) {
      setUi(prev => ({ ...prev, view: pendingView.current! }));
      pendingView.current = null;
    }
  }, [isAuthenticated, ui.view]);

  const renderView = useCallback(() => {
    switch (ui.view) {
      case 'landing':
        return (
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-black">CHƠI CỜ VUA ONLINE</h1>
            <button
              onClick={() => {
                createRoom('local');
                setUi(prev => ({ ...prev, view: 'play' }));
              }}
              className="bg-[#81b64c] px-10 py-6 rounded-xl text-2xl font-black"
            >
              CHƠI NGAY
            </button>
          </div>
        );

      case 'auth':
        return (
          <div className="w-full max-w-md bg-[#262421] p-10 rounded-3xl">
            <h2 className="text-3xl font-black text-center mb-8">Đăng nhập</h2>
            <form className="space-y-4">
              <input className="w-full p-4 rounded-xl bg-[#312e2b]" placeholder="Username" />
              <input type="password" className="w-full p-4 rounded-xl bg-[#312e2b]" placeholder="Password" />
              <button className="w-full bg-[#81b64c] py-4 rounded-xl font-black">VÀO GAME</button>
            </form>
          </div>
        );

      case 'play':
        return (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Board + InfoPanel */}
          </div>
        );

      default:
        return <div className="opacity-30 text-4xl font-black">COMING SOON</div>;
    }
  }, [ui.view]);

  return (
    <div className="flex h-screen bg-[#312e2b] text-white">
      <Sidebar ui={ui} setUi={setUi} />
      <main className="flex-1 flex items-center justify-center">{renderView()}</main>
    </div>
  );
};

/* ================= ROOT ================= */

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <MainContent />
      </GameProvider>
    </AuthProvider>
  );
}
