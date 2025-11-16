import { createContext, ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { translations } from '@/locales/translations';

type ConfirmModalConfig = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

type SuccessModalConfig = {
  title: string;
  description: string;
  onSuccess?: () => void;
};

type ModalType = 'confirm' | 'success';

type ModalConfig = {
  type: ModalType;
  config: ConfirmModalConfig | SuccessModalConfig;
};

type ModalContextType = {
  confirm: (config: ConfirmModalConfig) => void;
  success: (config: SuccessModalConfig) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalConfig | null>(null);
  const { t } = useTranslation();

  const confirm = (config: ConfirmModalConfig) => {
    setModalState({ type: 'confirm', config });
    setIsOpen(true);
  };

  const success = (config: SuccessModalConfig) => {
    setModalState({ type: 'success', config });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (modalState?.type === 'confirm') {
      const config = modalState.config as ConfirmModalConfig;
      if (config.onConfirm) {
        config.onConfirm();
      }
    }
    closeModal();
  };

  const handleCancel = () => {
    if (modalState?.type === 'confirm') {
      const config = modalState.config as ConfirmModalConfig;
      if (config.onCancel) {
        config.onCancel();
      }
    }
    closeModal();
  };

  const handleSuccess = () => {
    if (modalState?.type === 'success') {
      const config = modalState.config as SuccessModalConfig;
      if (config.onSuccess) {
        config.onSuccess();
      }
    }
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalState(null);
  };

  const renderFooter = () => {
    if (modalState?.type === 'confirm') {
      return (
        <DialogFooter className="flex gap-2 justify-end flex-row">
          <Button onClick={handleCancel} size="sm" variant="outline">
            {t(translations.actions.cancel)}
          </Button>
          <Button onClick={handleConfirm} size="sm">
            {t(translations.actions.confirm)}
          </Button>
        </DialogFooter>
      );
    }

    if (modalState?.type === 'success') {
      return (
        <DialogFooter className="flex gap-2 justify-end flex-row">
          <Button onClick={handleSuccess} size="sm" variant="default">
            {t(translations.actions.confirm)}
          </Button>
        </DialogFooter>
      );
    }

    return null;
  };

  return (
    <ModalContext.Provider value={{ confirm, success }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-[400px] p-4 rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              {modalState?.config.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-start">
              {modalState?.config.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {renderFooter()}
        </AlertDialogContent>
      </AlertDialog>
    </ModalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
