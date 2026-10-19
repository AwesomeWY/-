import React, { useState, useRef } from 'react';
import { X, Download, Upload, Trash2, ShieldCheck, Check, AlertTriangle } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { UserProfile } from '../../types';

interface BackupModalProps {
  profile: UserProfile;
  onClose: () => void;
  onDataChanged: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  profile,
  onClose,
  onDataChanged,
  onUpdateProfile,
}) => {
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    const updated = { ...profile, nickname: nicknameInput.trim() };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = async () => {
    try {
      const data = await StorageService.exportAllData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const nowStr = new Date().toISOString().split('T')[0];

      const a = document.createElement('a');
      a.href = url;
      a.download = `team-earth-backup-${nowStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('데이터 내보내기에 실패했습니다.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await StorageService.importAllData(parsed);
      setErrorMsg(null);
      alert('데이터가 성공적으로 복구되었습니다!');
      onDataChanged();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '유효하지 않은 백업 파일입니다.';
      setErrorMsg(msg);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = async () => {
    await StorageService.resetAllData();
    alert('모든 실천 데이터가 초기화되었습니다.');
    onDataChanged();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#347A52]" />
            <h3 className="text-base font-bold text-stone-900">
              설정 및 데이터 관리
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 py-4">
          {/* Nickname setting */}
          <form onSubmit={handleSaveNickname} className="space-y-2">
            <label
              htmlFor="nickname-input"
              className="text-xs font-bold text-stone-800 block"
            >
              사용자 닉네임
            </label>
            <div className="flex items-center gap-2">
              <input
                id="nickname-input"
                type="text"
                maxLength={15}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="지구버디 닉네임"
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-colors flex items-center gap-1"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>저장됨</span>
                  </>
                ) : (
                  <span>수정</span>
                )}
              </button>
            </div>
          </form>

          {/* Backup & Restore */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <p className="text-xs font-bold text-stone-800">
              데이터 백업 및 복구
            </p>
            <p className="text-[11px] text-stone-500">
              회원가입 없이 브라우저에 안전하게 보관되며, 언제든 JSON 파일로 내려받아 다른 기기로 옮길 수 있습니다.
            </p>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="min-h-[44px] px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>JSON 내보내기</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[44px] px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4 text-sky-700" />
                <span>JSON 복구하기</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-stone-100">
            {isResetConfirming ? (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>정말 모든 기록을 초기화하시겠습니까?</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  모든 실천 로그와 XP가 삭제되며 복구할 수 없습니다.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    네, 초기화합니다
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResetConfirming(false)}
                    className="py-1.5 px-3 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsResetConfirming(true)}
                className="w-full text-stone-400 hover:text-rose-600 text-xs flex items-center justify-center gap-1 py-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>데이터 전체 초기화</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
