import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    
    const updates: Record<string, any> = {};
    
    if (body.title !== undefined) updates.title = body.title;
    if (body.department !== undefined) updates.department = body.department;
    if (body.type !== undefined) updates.type = body.type;
    if (body.work_mode !== undefined) updates.work_mode = body.work_mode;
    if (body.location !== undefined) updates.location = body.location;
    if (body.experience !== undefined) updates.experience = body.experience;
    if (body.description !== undefined) updates.description = body.description;
    if (body.responsibilities !== undefined) updates.responsibilities = body.responsibilities;
    if (body.skills_required !== undefined) updates.skills_required = body.skills_required;
    if (body.status !== undefined) updates.status = body.status;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from('jobs').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Job deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}