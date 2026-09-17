import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  FolderOpen,
  Image as ImageIcon,
  User,
  Shield,
  Mail,
  Lock,
  Phone,
  Tag,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Journalist } from '../../types';
import { MediaLibrary } from './MediaLibrary';

interface JournalistEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (journalist: Journalist) => void;
  journalistToEdit?: Journalist | null;
}

const SUGGESTED_AVATARS = [
  { label: 'Reporter 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Reporter 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Reporter 3', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Reporter 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Reporter 5', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
  { label: 'Reporter 6', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
];

export const JournalistEditorModal: React.FC<JournalistEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  journalistToEdit,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState(SUGGESTED_AVATARS[0].url);
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [pgpFingerprint, setPgpFingerprint] = useState('');
  const [signalPhone, setSignalPhone] = useState('');
  const [joinedYear, setJoinedYear] = useState('2024');

  // Media picker sub-modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (journalistToEdit) {
      setName(journalistToEdit.name);
      setRole(journalistToEdit.role);
      setAvatar(journalistToEdit.avatar);
      setBio(journalistToEdit.bio);
      setSpecialties(journalistToEdit.specialties || []);
      setEmail(journalistToEdit.email || '');
      setPgpFingerprint(journalistToEdit.pgpFingerprint || '');
      setSignalPhone(journalistToEdit.signalPhone || '');
      setJoinedYear(journalistToEdit.joinedYear || '2024');
    } else {
      setName('');
      setRole('Journaliste d\'investigation');
      setAvatar(SUGGESTED_AVATARS[0].url);
      setBio('');
      setSpecialties(['Investigation']);
      setEmail('');
      setPgpFingerprint('');
      setSignalPhone('');
      setJoinedYear(new Date().getFullYear().toString());
    }
  }, [journalistToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specToRemove: string) => {
    setSpecialties(specialties.filter((s) => s !== specToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Veuillez renseigner le nom du journaliste.');
      return;
    }

    const updatedJournalist: Journalist = {
      id: journalistToEdit?.id || `journalist-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Journaliste d\'investigation',
      avatar: avatar.trim() || SUGGESTED_AVATARS[0].url,
      bio: bio.trim(),
      specialties: specialties.length > 0 ? specialties : ['Investigation'],
      email: email.trim() || undefined,
      pgpFingerprint: pgpFingerprint.trim() || undefined,
      signalPhone: signalPhone.trim() || undefined,
      joinedYear: joinedYear.trim() || undefined,
    };

    onSave(updatedJournalist);
    onClose();
  };

  return (
    <div
      id="journalist-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#3f241c]/80 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#eae5da] text-[#3f241c] w-full max-w-2xl rounded-3xl border-2 border-[#3f241c] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#3f241c] text-[#eae5da] flex items-center justify-between shrink-0 border-b-2 border-[#839b64]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#839b64] text-[#3f241c] flex items-center justify-center font-bold">
              <User className="w-4 h-4 text-[#eae5da]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                {journalistToEdit ? `Modifier le profil de ${journalistToEdit.name}` : 'Nouveau journaliste de la rédaction'}
              </h3>
              <p className="text-[11px] font-mono text-[#839b64]">
                Cellule d'investigation Six% • Fiche rédacteur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer text-[#eae5da]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Section 1: Photo de profil (Avatar) */}
          <div className="p-4 rounded-2xl bg-[#f4f0e8] border border-[#3f241c]/15 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase text-[#3f241c] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#839b64]" />
                <span>Photo de profil du journaliste</span>
              </label>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Choisir dans la médiathèque</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt={name || 'Aperçu'}
                  className="w-20 h-20 rounded-full object-cover border-3 border-[#839b64] shadow-md bg-[#3f241c]/10"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                >
                  <FolderOpen className="w-4 h-4 mb-0.5" />
                  <span>Changer</span>
                </button>
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/... ou URL issue de la médiathèque"
                  className="w-full px-3 py-2 rounded-xl bg-[#eae5da] border border-[#3f241c]/25 text-xs font-mono outline-none focus:border-[#839b64]"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] font-mono text-[#3f241c]/60 shrink-0">Suggestions :</span>
                  {SUGGESTED_AVATARS.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(sug.url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        avatar === sug.url ? 'border-[#839b64] scale-110 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={sug.label}
                    >
                      <img src={sug.url} alt={sug.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Identité & Rôle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Aprilia Narducci"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
                Rôle éditorial / Titre
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="ex. Grand reporter & data-investigatrice"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-sm"
              />
            </div>
          </div>

          {/* Section 3: Biographie */}
          <div>
            <label className="block text-xs font-bold font-mono uppercase text-[#3f241c] mb-1">
              Biographie & Parcours d'investigation
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Présentation des travaux, prix remportés, thèmes de recherche majeurs..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 focus:border-[#839b64] outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Section 4: Domaines d'expertise / Spécialités */}
          <div className="space-y-2">
            <label className="block text-xs font-bold font-mono uppercase text-[#3f241c]">
              Domaines d'expertise & Spécialités
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {specialties.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#839b64]/20 border border-[#839b64]/30 text-xs font-mono font-bold text-[#3f241c]"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(spec)}
                    className="hover:text-red-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSpecialty();
                  }
                }}
                placeholder="Ajouter une compétence (ex. Paradis fiscaux, Déforestation...)"
                className="flex-1 px-3 py-2 rounded-xl bg-[#f4f0e8] border border-[#3f241c]/25 outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-3.5 py-2 rounded-xl bg-[#3f241c] text-[#eae5da] text-xs font-bold hover:bg-[#2b1812] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Section 5: Coordonnées sécurisées & Intégration */}
          <div className="p-4 rounded-2xl bg-[#f4f0e8] border border-[#3f241c]/15 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-[#839b64] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Canaux de transmission sécurisée & Rédaction</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#3f241c] mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#839b64]" />
                  <span>Adresse e-mail chiffrée</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@six-pourcent.media"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#eae5da] border border-[#3f241c]/25 text-xs outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#3f241c] mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#839b64]" />
                  <span>Ligne Signal (chiffrée)</span>
                </label>
                <input
                  type="text"
                  value={signalPhone}
                  onChange={(e) => setSignalPhone(e.target.value)}
                  placeholder="+33 6 ** ** ** **"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#eae5da] border border-[#3f241c]/25 text-xs outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono font-bold text-[#3f241c] mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#839b64]" />
                  <span>Empreinte PGP publique</span>
                </label>
                <input
                  type="text"
                  value={pgpFingerprint}
                  onChange={(e) => setPgpFingerprint(e.target.value)}
                  placeholder="ex. 4F8A 29D1 8C7B 301E 998A E83B 21A5 7F04"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#eae5da] border border-[#3f241c]/25 text-xs outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#3f241c] mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#839b64]" />
                  <span>Année d'intégration à Six%</span>
                </label>
                <input
                  type="text"
                  value={joinedYear}
                  onChange={(e) => setJoinedYear(e.target.value)}
                  placeholder="2023"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#eae5da] border border-[#3f241c]/25 text-xs outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-[#3f241c]/20 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#3f241c]/20 hover:bg-[#ded8cc] text-xs font-bold text-[#3f241c] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#839b64] hover:bg-[#728956] text-[#eae5da] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{journalistToEdit ? 'Enregistrer les modifications' : 'Créer le profil'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sub-modal: Media Picker */}
      {isMediaPickerOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-[#3f241c]/85 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMediaPickerOpen(false);
          }}
        >
          <div className="bg-[#eae5da] w-full max-w-4xl rounded-2xl border-2 border-[#3f241c] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-[#3f241c] text-[#eae5da] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#839b64]" />
                <div>
                  <h3 className="font-bold text-sm">
                    Médiathèque • Choisir la photo de profil de {name || 'ce journaliste'}
                  </h3>
                  <p className="text-[11px] font-mono text-[#839b64]">
                    Sélectionnez une photo existante ou téléversez un nouveau portrait depuis votre ordinateur
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer text-[#eae5da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <MediaLibrary
                articles={[]}
                isPickerMode={true}
                onSelectImage={(url) => {
                  setAvatar(url);
                  setIsMediaPickerOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
