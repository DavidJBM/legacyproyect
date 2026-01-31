export interface HistoryEntryItem {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  oldValue?: string | null;
  newValue?: string | null;
  timestamp: string;
}
