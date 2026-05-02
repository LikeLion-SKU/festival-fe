/**
 * 타임테이블 배너 — DAY·id별로 수정
 *
 * - artist
 * - team
 * - time
 * - variant
 *
 * @typedef {{
 *   id: number;
 *   artist: string;
 *   team?: string;
 *   time: string;
 *   variant: 1 | 2;
 * }} TimetableBannerRow
 */

/** @type {Record<'day2' | 'day3', TimetableBannerRow[]>} */
export const TIMETABLE_DAY_BANNERS = {
  day2: [
    { id: 1, artist: '세븐틴', team: '경영학부 밴드', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 2, artist: '지드래곤', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 3, artist: '엔하이픈', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 4, artist: '아이유', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 5, artist: '블랙핑크', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 6, artist: '방탄소년단', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 7, artist: '투어스', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 8, artist: '데이식스', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
  ],
  day3: [
    { id: 1, artist: '윤희준', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 2, artist: '임다현', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 3, artist: '정영진', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 4, artist: '최운조', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 5, artist: '김정현', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 6, artist: '금시언', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 7, artist: '김나경', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 8, artist: '신채린', team: '학생회 초청', time: '18:00 ★ ~ 18:30', variant: 2 },
  ],
};
