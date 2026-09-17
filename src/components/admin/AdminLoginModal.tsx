import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle, X, KeyRound } from 'lucide-react';
import { verifyAdminPassword, setSessionAdminAuthenticated } from '../../lib/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez saisir le mot de passe administrateur.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isValid = await verifyAdminPassword(password);
      if (isValid) {
        setSessionAdminAuthenticated(true);
        setPassword('');
        onLoginSuccess();
      } else {
        setError('Mot de passe incorrect. Accès non autorisé.');
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    } catch {
      setError('Une erreur est survenue lors de la vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-login-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3f241c]/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#eae5da] w-full max-w-md rounded-2xl border-2 border-[#3f241c] shadow-2xl overflow-hidden text-[#3f241c] relative">
        {/* Header decoration */}
        <div className="bg-[#3f241c] text-[#eae5da] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#839b64] text-[#eae5da] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#839b64] font-bold block">
                Six% — Administration
              </span>
              <h3 className="text-base font-bold text-[#eae5da]">
                Accès Rédaction & Gestion
              </h3>
            </div>
          </div>
          <button
            id="close-admin-login-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#eae5da]/70 hover:text-[#eae5da] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#ded8cc] border border-[#3f241c]/15 text-xs text-[#3f241c]/85 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-[#839b64] shrink-0 mt-0.5" />
            <p>
              Cet espace permet de gérer les dossiers d'investigation, d'éditer les publications et d'administrer les éléments éditoriaux du média Six%.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3f241c]"
            >
              Mot de passe confidentiel
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3f241c]/50">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Entrez votre mot de passe d'accès..."
                className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] focus:ring-2 focus:ring-[#839b64]/30 outline-none text-sm text-[#3f241c] font-mono transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                id="toggle-password-visibility-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#3f241c]/60 hover:text-[#3f241c] transition-colors cursor-pointer"
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              id="admin-login-error"
              className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2 animate-in fade-in"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-admin-login-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#3f241c]/20 hover:bg-[#ded8cc] text-xs font-bold text-[#3f241c] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              id="submit-admin-login-btn"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Accéder à l'administration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
