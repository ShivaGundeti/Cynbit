import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department')
    const type = searchParams.get('type');
    let query = supabase.from('jobs').select('*');
    if (department && department !== 'All') {
        query = query.eq('department', department)
    }
    if (type && type !== 'All') {
        query = query.eq('type', type)
    }
    const { data, error } = await query;
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ jobs: data });
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    if (!body.title || !body.department || !body.type) {
        return NextResponse.json(
            { error: "Title, department, and employment type are required" },
            { status: 400 }
        );
    }
    const { data, error } = await supabase
        .from('jobs')
        .insert([
            {
                title: body.title,
                department: body.department,
                type: body.type,
                work_mode: body.work_mode || 'Remote',
                location: body.location || 'Remote / Jaipur',
                experience: body.experience || '0-1 Years',
                description: body.description || '',
                responsibilities: body.responsibilities || [],
                skills_required: body.skills_required || [],
                status: 'Active'
            }
        ])
        .select()
        .single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: data }, { status: 201 });
}


