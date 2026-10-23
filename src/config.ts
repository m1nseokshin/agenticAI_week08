// Google Sheets source. Replace SHEET_ID with the ID between /d/ and /edit in your sheet URL.
// The sheet must be shared as "Anyone with the link: Viewer".
// For a quick test without rebuilding, open the site with ?sheet=<ID> (and optionally &tab=<name>).
const params = new URLSearchParams(window.location.search);

export const SHEET_ID = params.get("sheet") ?? "1AcFJJcVIAT_W9PSmMkmShR8V2nMNvCl4AAGB67YC2LQ";
export const SHEET_TAB = params.get("tab") ?? "data";

export const SITE_TITLE = "2026 부산대학교 직무연수";
export const SITE_DESCRIPTION =
  "교직원 직무역량 강화를 위한 연수 과정을 한눈에 살펴보고, 나에게 맞는 연수를 찾아 신청하세요.";
