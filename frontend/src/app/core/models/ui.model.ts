export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'currency' | 'badge' | 'action';
  sortable?: boolean;
}

export interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  action?: () => void;
  disabled?: boolean;
}
