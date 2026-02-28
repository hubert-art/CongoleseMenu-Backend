/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { Injectable } from '@nestjs/common';
// import PDFDocument from 'pdfkit';
// import * as fs from 'fs';
// import * as path from 'path';

// interface ReceiptData {
//   phone: string;
//   amount: number;
//   plats: {
//     nom: string;
//     prix: number;
//     quantity: number;
//   }[];
//   transactionId?: string;
// }

// @Injectable()
// export class ReceiptService {
//   generatePDF(data: ReceiptData): string {
//     // Créer dossier receipts s'il n'existe pas
//     const receiptsDir = path.join(__dirname, '../../receipts');
//     if (!fs.existsSync(receiptsDir)) {
//       fs.mkdirSync(receiptsDir);
//     }

//     // Nom du fichier PDF
//     const transactionId = data.transactionId || Date.now().toString();
//     const filePath = path.join(receiptsDir, `receipt-${transactionId}.pdf`);

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
//     const doc = new PDFDocument();
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.pipe(fs.createWriteStream(filePath));

//     // En-tête
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     doc
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .fontSize(20)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .text('Receipt – Congolese Cultural Menu', { align: 'center' });
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     doc
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .fontSize(14)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .text('Thank you for your purchase, enjoy your meal; bon appétit!', {
//         align: 'center',
//       });
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.moveDown();

//     // Info utilisateur
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.fontSize(12).text(`Phone number: ${data.phone}`);
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.text(`Transaction ID: ${transactionId}`);
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.moveDown();
//     // Liste des plats
//     let total = 0;
//     data.plats.forEach((plat, index) => {
//       const lineTotal = plat.prix * plat.quantity;
//       total += lineTotal;
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//       doc.text(
//         `${index + 1}. ${plat.nom} - Price: ${plat.prix} KES - Quantity: ${plat.quantity} - Total: ${lineTotal} KES`,
//       );
//     });

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.moveDown();
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     doc
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .fontSize(14)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .text(`Total amount: ${total + data.amount} KES`, { align: 'right' });

//     // Date
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.moveDown();
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     doc
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .fontSize(10)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       .text(`Date: ${new Date().toLocaleString()}`, { align: 'right' });

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     doc.end();

//     return filePath;
//   }
// }

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

interface Plat {
  nom: string;
  prix: number;
  quantity: number;
  image?: string; // optionnel
}

interface ReceiptData {
  phone: string;
  plats: Plat[];
  transactionId?: string;
}

@Injectable()
export class ReceiptService {
  generatePDF(data: ReceiptData): string {
    // Créer le dossier receipts s'il n'existe pas
    const receiptsDir = path.join(__dirname, '../../receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir);
    }

    // Nom du fichier PDF
    const transactionId = data.transactionId || Date.now().toString();
    const filePath = path.join(receiptsDir, `receipt-${transactionId}.pdf`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const doc = new PDFDocument({ margin: 30 });

    doc.pipe(fs.createWriteStream(filePath));

    // En-tête
    doc
      .fontSize(22)
      .text('🍽️ Receipt – Congolese Cultural Menu', { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .text('Merci pour votre achat ! Bon appétit !', { align: 'center' });
    doc.moveDown(1);

    // Infos client
    doc.fontSize(12).text(`Téléphone: ${data.phone}`);
    doc.text(`Transaction ID: ${transactionId}`);
    doc.moveDown(0.5);
    // Lister tous les plats
    let total = 0;
    data.plats.forEach((plat, index) => {
      const lineTotal = plat.prix * plat.quantity;
      total += lineTotal;

      // Affichage texte
      doc
        .fontSize(11)
        .text(
          `${index + 1}. ${plat.nom} - Prix: ${plat.prix} KES - Quantité: ${plat.quantity} - Total: ${lineTotal} KES`,
        );

      // Affichage image si disponible
      if (plat.image) {
        try {
          const imgPath = path.isAbsolute(plat.image)
            ? plat.image
            : path.join(__dirname, '../../', plat.image);

          if (fs.existsSync(imgPath)) {
            doc.image(imgPath, { width: 80, height: 60, align: 'left' });
          }
        } catch (err) {
          console.error('Erreur image plat:', err);
        }
      }

      doc.moveDown(0.5);
    });

    doc.moveDown(0.5);
    doc.fontSize(14).text(`Montant total: ${total} KES`, { align: 'right' });

    // Date et heure
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .text(`Date: ${new Date().toLocaleString()}`, { align: 'right' });

    doc.end();

    return filePath;
  }
}
