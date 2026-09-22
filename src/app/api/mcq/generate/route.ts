import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { MCQService } from '@/services/mcqService';
import { getAuthenticatedUser } from '@/lib/auth';

const mcqRateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to generate MCQs' },
        { status: 401 }
      );
    }

    // Rate Limiting (Req #25): Max 20 requests per minute per user
    const now = Date.now();
    const rateKey = user.id;
    const userRate = mcqRateLimit.get(rateKey);
    if (userRate) {
      if (now < userRate.resetAt) {
        if (userRate.count >= 20) {
          return NextResponse.json(
            { error: 'Rate limit exceeded: Too many MCQ generation requests. Please slow down.' },
            { status: 429 }
          );
        }
        userRate.count++;
      } else {
        mcqRateLimit.set(rateKey, { count: 1, resetAt: now + 60 * 1000 });
      }
    } else {
      mcqRateLimit.set(rateKey, { count: 1, resetAt: now + 60 * 1000 });
    }

    const body = await request.json();
    const { competencyId, difficulty, topicPrompt, citationSource, docText, docTitle, questionFocus, count } = body;

    if (!competencyId) {
      return NextResponse.json({ error: 'Competency ID required' }, { status: 400 });
    }

    const requestedCount = Math.max(1, Math.min(25, Number(count) || 1));

    const questions = await MCQService.generateBatchMCQ(
      {
        competencyId,
        difficulty: difficulty || 'medium',
        topicPrompt,
        citationSource,
        docText,
        docTitle,
        questionFocus: questionFocus || 'general',
      },
      requestedCount
    );

    return NextResponse.json({
      success: true,
      question: questions[0] || null,
      questions,
      count: questions.length,
    });
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error(`[MCQGenError:${requestId}]`, error);
    return NextResponse.json(
      { error: 'Failed to generate MCQ', requestId },
      { status: 500 }
    );
  }
}
