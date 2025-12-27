"use client";

import { Icon } from "@iconify/react";

type NotesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onChange: (notes: string) => void;
  onSave: () => void;
  title?: string;
};

export default function NotesModal({
  isOpen,
  onClose,
  notes,
  onChange,
  onSave,
  title = "Edit Notes",
}: NotesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-[#132440] dark:text-white flex items-center gap-2">
            <Icon icon="mdi:pencil" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-2xl"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <textarea
            value={notes}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tulis catatan Anda di sini..."
            className="w-full h-64 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white resize-none"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {notes.length} karakter
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="px-6 py-2 bg-[#3B9797] text-white font-semibold rounded-lg hover:bg-[#2d7575] hover:shadow-lg transition flex items-center gap-2"
          >
            <Icon icon="mdi:content-save" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
