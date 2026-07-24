import jsPDF from "jspdf";

export function generatePDF(report) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Interview Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Interview ID: ${report.session_id}`, 20, 40);
  doc.text(`Candidate ID: ${report.candidate_id}`, 20, 50);
  doc.text(`Average Score: ${report.average_score}/10`, 20, 60);

  let y = 80;

  report.answers.forEach((item) => {
    doc.setFontSize(14);
    doc.text(`Question ${item.question_number}`, 20, y);

    y += 10;

    doc.setFontSize(11);
    doc.text(`Score: ${item.score}/10`, 20, y);

    y += 10;

    doc.text(item.question, 20, y, {
      maxWidth: 170,
    });

    y += 20;

    doc.text(item.answer, 20, y, {
      maxWidth: 170,
    });

    y += 30;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("Interview_Report.pdf");
}