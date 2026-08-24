import React, { useState } from 'react';
import pptxgen from 'pptxgenjs';

export default function TopicSlideGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSlides = async () => {
    if (!topic.trim()) {
      alert('Enter a topic first!');
      return;
    }

    setLoading(true);

    try {
      // 1. Call the AI generation function
      const data = await generateSlides(topic.trim());

      // 2. Generate and download the presentation deck instantly
      await createPowerPoint(data);

      alert('✅ Slides generated and downloaded!');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-indigo-500 shadow-2xl text-white">
      <h2 className="text-2xl font-bold text-white mb-2">Generate Slides</h2>
      <p className="text-xs text-slate-400 mb-4">
        Topic-focused 5-slide precision PowerPoint generator
      </p>
      
      <input
        type="text"
        placeholder="Enter topic (e.g., Photosynthesis, World War 2)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerateSlides()}
        className="w-full p-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl mb-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      
      <button
        onClick={handleGenerateSlides}
        disabled={loading || !topic.trim()}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? '⏳ Generating Deck...' : '✨ Generate Slides'}
      </button>
    </div>
  );
}

// AI generation function
const generateSlides = async (topic: string) => {
  const prompt = `
TOPIC-FOCUSED SLIDE GENERATION PROMPT

Generate 5 PowerPoint slides ONLY about: "${topic}"

STRICT RULES:
1. Every bullet point must be directly about ${topic}
2. Every fact must be accurate and verified
3. If unsure, OMIT it - don't guess
4. NO irrelevant information

SLIDE STRUCTURE:
- Slide 1: What is ${topic}?
- Slide 2: How does ${topic} work?
- Slide 3: Real examples of ${topic}
- Slide 4: ${topic} - Key concepts
- Slide 5: Why ${topic} matters

OUTPUT FORMAT (JSON only, no markdown wrapping, no extra text):
{
  "topic": "${topic}",
  "slides": [
    {
      "title": "What is ${topic}?",
      "subtitle": "...",
      "bullets": [
        "Point 1 (max 10 words)",
        "Point 2 (max 10 words)",
        "Point 3 (max 10 words)",
        "Point 4 (max 10 words)"
      ]
    }
  ]
}
`.trim();

  // Try Google Gemini API (project default) first, fallback to Anthropic if configured
  const geminiKey =
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (import.meta.env.VITE_API_KEY as string) ||
    localStorage.getItem('ai_gemini_api_key') ||
    '';

  const anthropicKey = (import.meta.env.VITE_ANTHROPIC_API_KEY as string) || '';

  let rawJson = '';

  if (geminiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    rawJson = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (anthropicKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const result = await response.json();
    rawJson = result.content?.[0]?.text || '';
  } else {
    throw new Error('No API Key found. Please add VITE_GEMINI_API_KEY in your .env.local file.');
  }

  const cleanJson = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleanJson);
};

// PowerPoint creation function
const createPowerPoint = async (slidesData: any) => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  slidesData.slides.forEach((slide: any) => {
    const slide_obj = pres.addSlide();
    slide_obj.background = { color: '030712' };

    slide_obj.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: 'FFFFFF'
    });

    if (slide.subtitle) {
      slide_obj.addText(slide.subtitle, {
        x: 0.5,
        y: 1.2,
        w: 9,
        h: 0.4,
        fontSize: 16,
        color: 'A5B4FC'
      });
    }

    const bulletItems = (slide.bullets || []).map((b: string) => ({
      text: b,
      options: {
        fontSize: 14,
        color: '94A3B8',
        bullet: true,
        paraSpaceAfter: 8
      }
    }));

    slide_obj.addText(bulletItems, {
      x: 0.8,
      y: 1.8,
      w: 8.5,
      h: 3.2
    });
  });

  const fileName = `${(slidesData.topic || 'slides').toLowerCase().replace(/[^a-z0-9]/g, '_')}-slides.pptx`;
  await pres.writeFile({ fileName });
};
