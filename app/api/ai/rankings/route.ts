import { NextResponse } from 'next/server';
import { rankMatches } from '@/lib/ai-engine';

export async function GET() {
  try {
    // Récupère les données de matchs (depuis la DB, une API, etc.)
    const matches = []; // À remplacer par tes vraies données
    
    const rankings = rankMatches(matches);

    return NextResponse.json({
      success: true,
      rankings,
    });
  } catch (error) {
    console.error('AI rankings error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate AI rankings',
      },
      { status: 500 }
    );
  }
}
