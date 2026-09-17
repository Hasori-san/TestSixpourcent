import React, { useState } from 'react';
import { useAdminMedia } from '../../context/AdminMediaContext';
import { Lock, X, KeyRound, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAdmin } = useAdminMedia();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAdmin(password);
    if (success) {
      setPassword('');
      closeLoginModal();
    } else {
      setError('Mot de passe administrateur incorrect. Utilisez le code par défaut indiqué ci-dessous.');
    }
  };

  return (
    <div
      id="admin-login-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={closeLoginModal}
    >
      <div
        id="admin-login-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#1e1e1e] text-[#f0f0f1] rounded-2xl border border-[#3c434a] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#2c3338] px-6 py-5 border-b border-[#3c434a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#839b64] text-[#1e1e1e] flex items-center justify-center font-black">
              <Lock className="w-4 h-4 text-[#1e1e1e]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#f0f0f1]">Espace Administrateur</h3>
              <p className="text-xs text-[#a7aaad] font-mono">Médiathèque & Gestion du site Six%</p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg hover:bg-[#3c434a] text-[#a7aaad] hover:text-[#f0f0f1] transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-[#2c3338]/60 border border-[#3c434a] text-xs text-[#c3c4c7] leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#839b64] shrink-0 mt-0.5" />
            <div>
              Cet espace permet d'accéder à la <strong>banque d'images style WordPress</strong> et de modifier facilement n'importe quelle photo du média.
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#a7aaad] mb-2">
              Mot de passe d'administration
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a7aaad]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Entrez le mot de passe admin..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#121212] border border-[#3c434a] text-sm text-[#f0f0f1] placeholder:text-[#646970] focus:outline-none focus:border-[#839b64] focus:ring-1 focus:ring-[#839b64] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#a7aaad] hover:text-[#f0f0f1] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#b32d2e]/15 border border-[#b32d2e]/40 text-xs text-[#ff8085] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Helper hint for default password */}
          <div className="p-3 rounded-lg bg-[#839b64]/10 border border-[#839b64]/25 flex items-center justify-between text-xs font-mono">
            <span className="text-[#a7aaad]">Code administrateur par défaut :</span>
            <code className="px-2 py-0.5 rounded bg-[#839b64]/20 text-[#839b64] font-bold">
              admin2026
            </code>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeLoginModal}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#a7aaad] hover:text-[#f0f0f1] hover:bg-[#2c3338] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
