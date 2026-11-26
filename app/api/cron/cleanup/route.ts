import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET & POST /api/cron/cleanup - Automated Background Lifecycle Purge
export async function GET(request: Request) {
  return handleCleanup(request);
}

export async function POST(request: Request) {
  return handleCleanup(request);
}

async function handleCleanup(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const inactivityDays = parseInt(searchParams.get('days') || '30', 10);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityDays);
    const cutoffIso = cutoffDate.toISOString();

    // 1. Purge resume payload for any applications rejected that still hold a file
    const { data: rejectedApps, error: rejectErr } = await supabase
      .from('applications')
      .update({ resume_url: null })
      .eq('status', 'Rejected')
      .not('resume_url', 'is', null)
      .select('id, full_name');

    // 2. Inactivity Purge: Find applications submitted over inactivityDays ago that are inactive
    const { data: inactiveApps, error: inactiveErr } = await supabase
      .from('applications')
      .update({ resume_url: null })
      .lt('submitted_at', cutoffIso)
      .not('resume_url', 'is', null)
      .select('id, full_name, submitted_at');

    if (rejectErr || inactiveErr) {
      console.error('Lifecycle cleanup error:', rejectErr || inactiveErr);
      return NextResponse.json(
        { error: (rejectErr || inactiveErr)?.message },
        { status: 500 }
      );
    }

    const purgedRejectedCount = rejectedApps?.length || 0;
    const purgedInactiveCount = inactiveApps?.length || 0;
    const totalPurged = purgedRejectedCount + purgedInactiveCount;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      retention_policy: `${inactivityDays} days inactivity limit`,
      purged_rejected_resumes: purgedRejectedCount,
      purged_inactive_resumes: purgedInactiveCount,
      total_files_purged: totalPurged,
      message: totalPurged > 0 
        ? `Cleaned ${totalPurged} files according to data lifecycle retention policy.`
        : 'All records are within active retention window. Storage is optimal.'
    }, { status: 200 });

  } catch (err: any) {
    console.error('Lifecycle cleanup route error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error during cleanup' },
      { status: 500 }
    );
  }
}
