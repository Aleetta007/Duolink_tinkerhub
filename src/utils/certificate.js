/**
 * Certificate generator for Kozhitharam Detector™
 *
 * Generates a downloadable PDF certificate entirely in the browser.
 * Uses jsPDF — no server required.
 */

export async function generateCertificate({ name, score, categoryTitle, categoryEmoji }) {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const W = 297;
  const H = 210;

  // ── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(8, 12, 28);
  doc.rect(0, 0, W, H, 'F');

  // Outer decorative border
  doc.setDrawColor(255, 180, 0);
  doc.setLineWidth(3);
  doc.rect(8, 8, W - 16, H - 16, 'S');

  // Inner thin border
  doc.setDrawColor(255, 215, 0);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, W - 24, H - 24, 'S');

  // Corner ornament squares
  const corners = [[8, 8], [W - 14, 8], [8, H - 14], [W - 14, H - 14]];
  doc.setFillColor(255, 180, 0);
  corners.forEach(([x, y]) => doc.rect(x, y, 6, 6, 'F'));

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 200, 50);
  doc.text('🐔  NATIONAL KOZHITHARAM AUTHORITY™', W / 2, 28, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Est. 2026 • Protecting Citizens from Undetected Kozhitharam Since Our Founding', W / 2, 34, { align: 'center' });

  // Divider
  doc.setDrawColor(255, 180, 0);
  doc.setLineWidth(0.3);
  doc.line(20, 37, W - 20, 37);

  // ── Title ─────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('CERTIFICATE OF KOZHITHARAM', W / 2, 54, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('This officially certifies, in the presence of witnesses real and imaginary, that', W / 2, 63, { align: 'center' });

  // ── Name ──────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(32);
  doc.setTextColor(255, 215, 0);
  doc.text(name || 'Anonymous Kozhi', W / 2, 80, { align: 'center' });

  // Name underline
  const nameWidth = doc.getTextWidth(name || 'Anonymous Kozhi');
  doc.setDrawColor(255, 215, 0);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - nameWidth / 2, 83, W / 2 + nameWidth / 2, 83);

  // ── Body Text ─────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('has successfully undergone the Kozhitharam Analysis™ and has been scientifically (not really) determined to possess', W / 2, 92, { align: 'center' });
  doc.text('a Kozhitharam level of extraordinary (or ordinary) significance, as measured by the Advanced Kozhitharam Algorithm™.', W / 2, 98, { align: 'center' });

  // ── Score ─────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(48);
  doc.setTextColor(255, 80, 80);
  doc.text(`${score}%`, W / 2, 122, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(255, 200, 200);
  doc.text('KOZHITHARAM SCORE', W / 2, 130, { align: 'center' });

  // ── Classification ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 215, 0);
  doc.text(`${categoryEmoji}  ${categoryTitle}`, W / 2, 142, { align: 'center' });

  // ── Footer row ────────────────────────────────────────────────────────────
  doc.setDrawColor(255, 180, 0);
  doc.setLineWidth(0.3);
  doc.line(20, 155, W - 20, 155);

  // Certificate ID
  const certId = 'KZ-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Certificate ID: ${certId}`, 25, 164);
  doc.text(`Date: ${dateStr}`, 25, 170);

  // Seal area (right)
  doc.setDrawColor(255, 180, 0);
  doc.setLineWidth(0.8);
  doc.circle(W - 45, 166, 18, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(255, 180, 0);
  doc.text('OFFICIAL', W - 45, 161, { align: 'center' });
  doc.text('KOZHITHARAM', W - 45, 166, { align: 'center' });
  doc.text('SEAL', W - 45, 171, { align: 'center' });
  doc.text('🐔', W - 45, 176, { align: 'center' });

  // Signature area (center)
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - 35, 175, W / 2 + 35, 175);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Dr. P.K. Kozhi, Chief Kozhitharam Officer', W / 2, 180, { align: 'center' });

  // Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(80, 80, 80);
  doc.text(
    'This certificate is completely fictional and has absolutely no scientific validity. Kozhitharam is a fictional entertainment metric.',
    W / 2, 198, { align: 'center' }
  );

  // ── Download ───────────────────────────────────────────────────────────────
  const safeName = (name || 'kozhi').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`kozhitharam_certificate_${safeName}.pdf`);
}
