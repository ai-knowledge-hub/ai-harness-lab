export function campaignDayKey(row) {
  return JSON.stringify([row.campaign_id, row.readable_time]);
}

export function summarizeRows(rows) {
  if (!rows.length) return null;

  const sum = (field) => rows.reduce((total, row) => total + row[field], 0);
  const spendInPence = rows.reduce((total, row) => total + Math.round(row.spend * 100), 0);
  return {
    impressions: sum("impressions"),
    clicks: sum("clicks"),
    spend: spendInPence / 100,
    conversions: rows.every((row) => typeof row.conversions === "number")
      ? sum("conversions")
      : null,
  };
}
