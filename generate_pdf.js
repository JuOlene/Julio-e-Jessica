import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateWeddingPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Resolução ideal de Convite Mobile/Digital (1080 x 1920 proporção 9:16 ou 595 x 842 A4)
  // Usaremos 540 x 960 que se adapta perfeitamente a qualquer tela de celular e impressora
  const width = 540;
  const height = 960;
  const page = pdfDoc.addPage([width, height]);

  // Carrega a imagem do envelope elegante
  const envelopeImagePath = path.join(__dirname, 'public', 'envelope_jj_extended_pure.jpg');
  const imageBytes = fs.readFileSync(envelopeImagePath);
  const embeddedImage = await pdfDoc.embedJpg(imageBytes);

  // Desenha o envelope ocupando toda a página
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  // URL Oficial do Convite na Vercel
  const weddingUrl = 'https://jessicaejulio.vercel.app/';

  // Botão Elegante "CLIQUE AQUI PARA ABRIR O CONVITE"
  const btnWidth = 320;
  const btnHeight = 52;
  const btnX = (width - btnWidth) / 2;
  const btnY = height * 0.28; // Posicionado perfeitamente na parte inferior do envelope

  // Fundo do Botão (Sálvia Escuro com Borda e Sombra)
  page.drawRectangle({
    x: btnX,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
    color: rgb(0.247, 0.302, 0.153), // #3F4D27
    borderColor: rgb(0.478, 0.549, 0.294), // #7A8C4B
    borderWidth: 1.5,
  });

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const text = 'CLIQUE AQUI PARA ABRIR O CONVITE';
  const fontSize = 11.5;
  const textWidth = fontBold.widthOfTextAtSize(text, fontSize);
  const textX = btnX + (btnWidth - textWidth) / 2;
  const textY = btnY + (btnHeight - fontSize) / 2 + 1;

  page.drawText(text, {
    x: textX,
    y: textY,
    size: fontSize,
    font: fontBold,
    color: rgb(0.98, 0.97, 0.96),
  });

  // Criação da Área Clicável (Link Interativo no PDF)
  const linkAnnotation = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [btnX, btnY, btnX + btnWidth, btnY + btnHeight],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: weddingUrl,
    },
  });

  // Também torna a página inteira clicável para facilitar o acesso de quem toca em qualquer parte
  const fullPageAnnotation = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [0, 0, width, height],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: weddingUrl,
    },
  });

  const annotations = page.node.Annots() || pdfDoc.context.obj([]);
  annotations.push(fullPageAnnotation);
  page.node.set(pdfDoc.context.obj('Annots'), annotations);

  const pdfBytes = await pdfDoc.save();

  const outputPath = path.join(__dirname, 'Convite_Casamento_Julio_e_Jessica.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  
  // Também copia para a pasta public para poder ser baixado diretamente pelo site se quiser
  fs.writeFileSync(path.join(__dirname, 'public', 'Convite_Casamento_Julio_e_Jessica.pdf'), pdfBytes);

  console.log('PDF gerado com sucesso em:', outputPath);
}

generateWeddingPDF().catch(console.error);
