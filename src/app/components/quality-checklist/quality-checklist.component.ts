import { Component, Input } from '@angular/core';

export interface QualityChecklistItem {
  label: string;
  status: 'Pending' | 'Passed' | 'Failed';
}

@Component({
  selector: 'app-quality-checklist',
  standalone: false,
  templateUrl: './quality-checklist.component.html',
  styleUrls: ['./quality-checklist.component.scss']
})
export class QualityChecklistComponent {
  @Input() items: QualityChecklistItem[] = [];
}
