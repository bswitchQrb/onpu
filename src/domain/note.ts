export interface NoteData {
  name: string;
  jaName: string;
  position: number; // 五線譜上のY位置（0 = 一番下の線、半線ずつ増加）
  ledgerLines?: number; // 加線の数（負:下、正:上）
}
