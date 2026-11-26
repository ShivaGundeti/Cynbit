import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

// 1. POST /api/application - Candidate submits an application
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        if (!body.full_name || !body.email || !body.phone || !body.job_id) {
            return NextResponse.json(
                { error: "Full name, email, phone, and job ID are required." },
                { status: 400 }
            );
        }

        const applicationData = {
            job_id: body.job_id,
            job_title: body.job_title || 'General Application',
            full_name: body.full_name,
            email: body.email,
            phone: body.phone,
            whatsapp_number: body.whatsapp_number || null,
            dob: body.dob || null,
            gender: body.gender || null,
            current_city: body.current_city || null,
            permanent_address: body.permanent_address || null,
            highest_qualification: body.highest_qualification || null,
            degree: body.degree || null,
            specialization: body.specialization || null,
            college: body.college || null,
            graduation_year: body.graduation_year || null,
            education_status: body.education_status || null,
            score_value: body.score_value || null,
            notice_period: body.notice_period || null,
            skills: body.skills || [],
            resume_url: body.resume_url || null,
            portfolio_url: body.portfolio_url || null,
            linkedin_url: body.linkedin_url || null,
            github_url: body.github_url || null,
            why_cynbit: body.why_cynbit || null,
            status: 'Submitted'
        };

        const { data, error } = await supabase
            .from('applications')
            .insert([applicationData])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, application: data }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }


}


export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        const status = searchParams.get('status');
        const jobId = searchParams.get('job_id');

        let query = supabase
            .from('applications')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (status && status !== 'All') {
            query = query.eq('status', status);
        }

        if (jobId) {
            query = query.eq('job_id', jobId);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: data.length, applications: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}