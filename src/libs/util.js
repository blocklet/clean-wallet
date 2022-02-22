import dayjs from 'dayjs';
import FileSaver from 'file-saver';

export function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return '';
  }

  return dayjs(date).format(format);
}

export const downloadBackupFile = async (content) => {
  const now = new Date();
  const date = formatTime(now, 'YYYY-MM-DD_HH-mm-ss');
  const filename = `abt_backup_${date}.abt`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  if (!window.showSaveFilePicker) {
    FileSaver.saveAs(blob, filename);
    return true;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return handle;
  } catch (err) {
    throw new Error(err.message);
  }
};
