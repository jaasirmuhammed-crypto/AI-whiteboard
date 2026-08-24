import PptxGenJS from 'pptxgenjs';

export const handleGeneratePPTFromNotes = async (canvasRef: HTMLCanvasElement) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        alert('❌ API Key missing');
        return;
    }

    if (!canvasRef) {
        alert('❌ Canvas not found');
        return;
    }

    try {
        // Extract text from drawing
        console.log('📝 Reading your notes...');
        const imageData = canvasRef.toDataURL('image/png');
        const base64Data = imageData.split(',')[1];

        const ocrResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                inlineData: {
                                    mimeType: 'image/png',
                                    data: base64Data,
                                },
                            },
                            {
                                text: 'Extract ALL text from this handwritten note. Return only the text.',
                            },
                        ],
                    }],
                }),
            }
        ).then(r => r.json());

        const extractedText = ocrResponse.contents[0].parts[0].text;

        // Detect topic
        console.log('🎯 Finding topic...');
        const topicResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `What is the main topic in 2-3 words:\n\n${extractedText}`,
                        }],
                    }],
                }),
            }
        ).then(r => r.json());

        const topic = topicResponse.contents[0].parts[0].text.trim();

        // Generate slides
        console.log('✨ Generating slides...');
        const slidesResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Make 5 PowerPoint slides about "${topic}" from these notes:

${extractedText}

Return ONLY JSON:
{
  "topic": "${topic}",
  "slides": [
    {"slideNumber": 1, "title": "What is ${topic}?", "subtitle": "Definition", "bullets": ["bullet1", "bullet2", "bullet3"]},
    {"slideNumber": 2, "title": "How it works", "subtitle": "Process", "bullets": ["bullet1", "bullet2", "bullet3"]},
    {"slideNumber": 3, "title": "Real examples", "subtitle": "Applications", "bullets": ["bullet1", "bullet2", "bullet3"]},
    {"slideNumber": 4, "title": "Key concepts", "subtitle": "Important facts", "bullets": ["bullet1", "bullet2", "bullet3"]},
    {"slideNumber": 5, "title": "Summary", "subtitle": "Why it matters", "bullets": ["bullet1", "bullet2", "bullet3"]}
  ]
}`,
                        }],
                    }],
                }),
            }
        ).then(r => r.json());

        const jsonText = slidesResponse.contents[0].parts[0].text;
        const slidesData = JSON.parse(jsonText);

        // Create PPT
        console.log('📊 Creating PowerPoint...');
        const pres = new PptxGenJS();
        pres.layout = 'LAYOUT_16x9';

        slidesData.slides.forEach((slide: any) => {
            const slideObj = pres.addSlide();
            slideObj.background = { color: '030712' };

            slideObj.addText(slide.title, {
                x: 0.5, y: 0.5, w: 9, h: 0.6,
                fontSize: 40, bold: true, color: 'FFFFFF'
            });

            if (slide.subtitle) {
                slideObj.addText(slide.subtitle, {
                    x: 0.5, y: 1.2, w: 9, h: 0.4,
                    fontSize: 18, color: 'A5B4FC'
                });
            }

            const bullets = slide.bullets.map((b: string) => '• ' + b).join('\n');
            slideObj.addText(bullets, {
                x: 0.8, y: 1.8, w: 8.5, h: 3.2,
                fontSize: 14, color: '94A3B8'
            });
        });

        pres.save({ fileName: `${topic}-slides.pptx` });
        alert(`✅ PPT Downloaded: ${topic}-slides.pptx`);

    } catch (error) {
        alert(`❌ Error: ${(error as any).message}`);
        console.error(error);
    }
};