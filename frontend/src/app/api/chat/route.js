import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Check if API key is set
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { message: 'Please add your GROQ_API_KEY to .env.local file' },
        { status: 200 }
      );
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Latest Llama model (updated)
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', response.status, errorData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { message: '❌ Invalid API key. Please check your GROQ_API_KEY in .env.local' },
          { status: 200 }
        );
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { message: '⏳ Rate limit exceeded. Please wait a moment and try again.' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { message: `Sorry, I encountered an error: ${errorData.error?.message || 'Unknown error'}` },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { message: 'Sorry, I encountered an error. Please try again.' },
      { status: 200 }
    );
  }
}
