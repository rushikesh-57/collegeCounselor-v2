import { invokeFunction, supabase } from './supabaseClient';

export const api = {
  recommendColleges: (payload) => invokeFunction('recommend-colleges', payload),
  getCollegeData: () => invokeFunction('college-data'),
  getBranchList: (districtList) => invokeFunction('college-list', { districtList }),
  checkCutoff: (payload) => invokeFunction('check-cutoff', payload),
  exportExcel: (rows) => invokeFunction('export-excel', { rows }),
  exportPdf: (rows) => invokeFunction('export-pdf', { rows }),
  sendChatMessage: (message) => invokeFunction('chatbot', { message }),
};

export function publicStorageUrl(path, bucket = 'public-downloads') {
  if (!supabase) return '#';
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function downloadBase64File({ base64, filename, mimeType }) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
