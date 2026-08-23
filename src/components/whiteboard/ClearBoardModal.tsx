import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useI18n } from '../../i18n';

interface ClearBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearBoardModal: React.FC<ClearBoardModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold font-brand text-slate-900 dark:text-white">
            {t.whiteboard.clearConfirmTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t.whiteboard.clearConfirmDesc}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            {t.whiteboard.cancel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
          >
            {t.whiteboard.clearBoard}
          </button>
        </div>
      </div>
    </Modal>
  );
};
