import { InstagramData } from '@/types/instagram';

const STORAGE_KEY = 'instagram_data';
const PREVIOUS_STORAGE_KEY = 'instagram_data_previous';

export function saveInstagramData(data: InstagramData): void {
  if (typeof window === 'undefined') return;

  const nextRaw = JSON.stringify(data);
  const currentRaw = localStorage.getItem(STORAGE_KEY);

  // If nothing changed, don't rotate current -> previous.
  if (currentRaw && currentRaw === nextRaw) return;

  // Move current data to previous before saving new
  if (currentRaw) {
    localStorage.setItem(PREVIOUS_STORAGE_KEY, currentRaw);
  }

  localStorage.setItem(STORAGE_KEY, nextRaw);
}

export function getInstagramData(): InstagramData | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getPreviousInstagramData(): InstagramData | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(PREVIOUS_STORAGE_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearInstagramData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PREVIOUS_STORAGE_KEY);
}
