import PDFDocument from 'pdfkit';

interface PaymentData {
  paymentId: string;
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
}

export const generatePaymentPdf = async (
  data: PaymentData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (error) => reject(error));

      const pageWidth = doc.page.width;
      const themeColor = '#1a365d'; // Professional Navy Blue
      const secondaryColor = '#4a5568';

      // ================= HEADER & LOGO AREA =================
      // Draw a subtle top accent bar
      doc.rect(0, 0, pageWidth, 40).fill(themeColor);

      doc.moveDown(3);
      doc
        .fillColor(themeColor)
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('PAYMENT RECEIPT', { align: 'right' });

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(secondaryColor)
        .text('Your Learning Platform', { align: 'right' })
        .text('empowering-knowledge.com', { align: 'right' });

      doc.moveDown(2);

      // ================= INFO GRID (2 Columns) =================
      const topOfGrid = doc.y;

      // Column 1: Learner Info
      doc
        .fillColor(themeColor)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('BILL TO', 50, topOfGrid);
      doc.moveDown(0.3);
      doc.fillColor('#000').font('Helvetica').fontSize(10);
      doc.text(data.learnerName);
      doc.fillColor(secondaryColor).text(data.learnerEmail);

      // Column 2: Details (Positioned to the right)
      doc
        .fillColor(themeColor)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('DETAILS', 350, topOfGrid);
      doc.moveDown(0.3);
      doc.fillColor('#000').font('Helvetica').fontSize(10);
      doc.text(`Receipt #: ${data.paymentId}`, 350);
      doc.text(`Date: ${new Date(data.paymentDate).toLocaleDateString()}`, 350);
      doc.text(`Transaction: ${data.transactionId}`, 350);

      doc.moveDown(3);

      // ================= COURSE BOX =================
      const boxTop = doc.y;
      doc
        .roundedRect(50, boxTop, pageWidth - 100, 50, 5)
        .strokeColor('#e2e8f0')
        .stroke();

      doc
        .fillColor(themeColor)
        .font('Helvetica-Bold')
        .text('Enrolled Course:', 65, boxTop + 12);
      doc
        .fillColor('#000')
        .font('Helvetica')
        .fontSize(12)
        .text(data.courseTitle, 65, boxTop + 28);

      doc.moveDown(4);

      // ================= PAYMENT SUMMARY TABLE =================
      const tableTop = doc.y;

      // Table Header Background
      doc.rect(50, tableTop, pageWidth - 100, 25).fill('#f8fafc');
      doc.fillColor(themeColor).font('Helvetica-Bold').fontSize(10);
      doc.text('Description', 65, tableTop + 8);
      doc.text('Amount', 50, tableTop + 8, {
        align: 'right',
        width: pageWidth - 115,
      });

      // Table Row
      doc.moveDown(1.5);
      doc.fillColor('#000').font('Helvetica').fontSize(11);
      doc.text('Course Subscription Fee', 65);
      doc.text(`${data.amount.toFixed(2)} BDT`, 50, doc.y - 12, {
        align: 'right',
        width: pageWidth - 115,
      });

      // Border line
      doc.moveDown(1);
      doc
        .moveTo(50, doc.y)
        .lineTo(pageWidth - 50, doc.y)
        .strokeColor('#e2e8f0')
        .stroke();

      // Total Section
      doc.moveDown(1);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(themeColor);
      doc.text('Total Paid', 300, doc.y);
      doc.text(`${data.amount.toFixed(2)} BDT`, 50, doc.y - 14, {
        align: 'right',
        width: pageWidth - 115,
      });

      // ================= CENTERED FOOTER =================
      const footerY = doc.page.height - 100;

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#94a3b8')
        .text(
          'This is a computer-generated document. No signature is required.',
          50,
          footerY,
          {
            align: 'center',
            width: pageWidth - 100,
          },
        );

      doc.moveDown(0.5);

      doc
        .fillColor(themeColor)
        .text('Thank you for choosing Your Learning Platform!', {
          align: 'center',
          width: pageWidth - 100,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
