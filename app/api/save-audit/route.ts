import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recommendations, totalMonthlySavings, totalAnnualSavings, teamSize, useCase } = body;

    const { data, error } = await supabaseAdmin
      .from('audits')
      .insert({
        tools: recommendations,
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        team_size: teamSize,
        use_case: useCase,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase save-audit error:', error);
      throw error;
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Error in save-audit route:', error);
    return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 });
  }
}
