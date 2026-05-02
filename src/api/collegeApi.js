import { invokeFunction, supabase } from './supabaseClient';

function unwrap(payload) {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== 'object') return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.result)) return payload.result;
  return payload;
}

export const api = {
  recommendColleges: async (payload) => {
    const result = unwrap(await invokeFunction('recommend-colleges', payload));
    return Array.isArray(result) ? result : [];
  },
  getCollegeData: async () => {
    const result = unwrap(await invokeFunction('college-data'));
    return Array.isArray(result) ? result : [];
  },
  getBranchList: async (districtList) => {
    const result = unwrap(await invokeFunction('college-list', { districtList }));
    return Array.isArray(result) ? result : [];
  },
  checkCutoff: async (payload) => {
    const result = unwrap(await invokeFunction('check-cutoff', payload));
    return Array.isArray(result) ? result : [];
  },
  exportExcel: (rows) => invokeFunction('export-excel', { rows }),
  exportPdf: (rows) => invokeFunction('export-pdf', { rows }),
  sendChatMessage: async (message) => {
    const result = unwrap(await invokeFunction('chatbot', { message }));
    if (typeof result === 'string') return { response: result };
    if (result?.response) return result;
    return { response: 'No response was generated.' };
  },
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
