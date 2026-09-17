'use client';

import Button from '@/components/common/Button';
import Modal from '@/components/admin/common/Modal';

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  onConfirm,
  onClose,
  danger = false,
  loading = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} maxWidthClassName="max-w-sm">
      <div className="p-6">
        <p className="text-lg font-black text-neutral-900">{title}</p>
        {description ? <p className="mt-2 text-sm font-semibold text-gray-600">{description}</p> : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} isLoading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
