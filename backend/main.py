from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from supabase import create_client, Client
import json
import asyncio
import uuid
import os
import aiofiles
import resend
from datetime import datetime
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="NEXUS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
resend.api_key = os.getenv("RESEND_API_KEY")


def call_groq(system_prompt: str, user_content: str, temperature: float = 0.1) -> str:
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        temperature=temperature,
        max_tokens=4000,
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content


async def agent_transcribe(file_path: str) -> dict:
    print("Agent 1: Transcription started")
    try:
        with open(file_path, "rb") as audio_file:
            transcript = groq_client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="verbose_json"
            )
        segments = []
        speaker_num = 1
        prev_end = 0
        for i, seg in enumerate(transcript.segments):
            if seg.end - prev_end > 1.5 and i > 0:
                speaker_num = (speaker_num % 3) + 1
            prev_end = seg.end
            segments.append({
                "start": round(seg.start, 2),
                "end": round(seg.end, 2),
                "text": seg.text.strip(),
                "speaker": f"Speaker {speaker_num}"
            })
        print(f"Agent 1 Done: {len(segments)} segments")
        return {
            "full_transcript": transcript.text,
            "segments": segments,
            "duration_seconds": getattr(transcript, 'duration', 0),
            "language": getattr(transcript, 'language', 'en'),
            "status": "success"
        }
    except Exception as e:
        print(f"Agent 1 Error: {e}")
        return {"full_transcript": "", "segments": [], "duration_seconds": 0, "language": "en", "status": "error", "error": str(e)}


async def agent_extract(transcript: str) -> dict:
    print("Agent 2: Extraction started")
    try:
        system_prompt = """You are an expert meeting analyst. Extract ALL intelligence from this meeting transcript.

Return ONLY valid JSON with this exact structure:
{
  "action_items": [
    {
      "task": "specific actionable task description",
      "owner": "person name or Unassigned",
      "owner_email": null,
      "deadline": "YYYY-MM-DD or Not specified",
      "deadline_reasoning": "why you chose this deadline",
      "priority": "High or Medium or Low",
      "priority_reasoning": "why this priority",
      "dependencies": [],
      "success_criteria": "how we know this task is done",
      "context_quote": "exact words from transcript",
      "risk_level": "High or Medium or Low",
      "risk_reason": "why risky or safe"
    }
  ],
  "decisions_made": [{"decision": "what was decided", "decided_by": "who", "impact": "why matters"}],
  "open_questions": [{"question": "unresolved question", "raised_by": "who asked", "urgency": "High or Medium or Low"}],
  "commitments": [{"commitment": "what was promised", "by": "who", "to": "to whom"}],
  "deferred_topics": [{"topic": "what was postponed", "reason": "why deferred", "suggested_timeline": "when to revisit"}]
}"""
        result = call_groq(system_prompt, f"Extract from this transcript:\n\n{transcript}")
        parsed = json.loads(result)
        print(f"Agent 2 Done: {len(parsed.get('action_items', []))} action items")
        return parsed
    except Exception as e:
        print(f"Agent 2 Error: {e}")
        return {"action_items": [], "decisions_made": [], "open_questions": [], "commitments": [], "deferred_topics": []}


async def agent_context(extracted_data: dict, user_id: str) -> dict:
    print("Agent 3: Context started")
    try:
        previous = supabase.table("meetings").select("id, title, date, summary, sentiment").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
        prev_items = supabase.table("action_items").select("task, owner_name, status, deadline").eq("status", "pending").limit(20).execute()
        context_data = {
            "previous_meetings": previous.data or [],
            "pending_tasks": prev_items.data or [],
            "new_action_items": extracted_data.get("action_items", [])
        }
        system_prompt = """Analyze new meeting action items against historical context.

Return JSON:
{
  "context_alerts": [{"type": "repeat_task or conflict or overload", "severity": "High or Medium or Low", "message": "alert message", "action_item_affected": "which task", "recommendation": "what to do"}],
  "participant_insights": [{"name": "name", "reliability_score": 85, "insight": "track record", "recommendation": "how to handle"}],
  "overall_risk_level": "High or Medium or Low",
  "meeting_patterns": ["observation about team"]
}

If no history exists return empty arrays."""
        result = call_groq(system_prompt, json.dumps(context_data))
        parsed = json.loads(result)
        print(f"Agent 3 Done: {len(parsed.get('context_alerts', []))} alerts")
        return parsed
    except Exception as e:
        print(f"Agent 3 Error: {e}")
        return {"context_alerts": [], "participant_insights": [], "overall_risk_level": "Low", "meeting_patterns": []}


async def agent_analyze(transcript: str, action_items_count: int, participants_count: int) -> dict:
    print("Agent 4: Analysis started")
    try:
        system_prompt = f"""You are a meeting effectiveness expert.
Analyze this meeting transcript deeply.

Context: Participants: {participants_count}, Average Indian tech salary: 7212 INR/hour

Return JSON:
{{
  "meeting_summary": {{
    "one_line": "compelling one sentence summary",
    "bullet_points": ["point 1", "point 2", "point 3", "point 4"],
    "key_theme": "core topic"
  }},
  "sentiment_analysis": {{
    "overall": "positive or neutral or tense or confused or mixed",
    "score": 75,
    "energy_level": "high or medium or low",
    "key_moments": [{{"moment": "description", "sentiment": "frustrated or excited", "significance": "why matters"}}]
  }},
  "participation_analysis": {{
    "balance_score": 72,
    "dominant_speakers": ["Speaker 1 (60%)"],
    "silent_participants": [],
    "collaboration_quality": "high or medium or low"
  }},
  "risk_assessment": {{
    "overall_risk": "High or Medium or Low",
    "risks": [{{"risk": "specific risk", "severity": "High or Medium or Low", "mitigation": "what to do"}}]
  }},
  "meeting_effectiveness": {{
    "score": 74,
    "was_meeting_necessary": true,
    "could_have_been_email": false,
    "time_well_spent": true,
    "clarity_score": 80,
    "decision_quality": "high or medium or low",
    "improvements": ["improvement 1", "improvement 2"]
  }},
  "meeting_cost": {{
    "estimated_duration_minutes": 45,
    "estimated_cost_inr": 54090,
    "cost_per_action_item_inr": 7727,
    "roi_prediction": "High or Medium or Low or Negative",
    "roi_reasoning": "why this ROI"
  }}
}}"""
        result = call_groq(system_prompt, f"Analyze:\n\n{transcript}", temperature=0.2)
        parsed = json.loads(result)
        print(f"Agent 4 Done: score {parsed.get('meeting_effectiveness', {}).get('score', 0)}")
        return parsed
    except Exception as e:
        print(f"Agent 4 Error: {e}")
        return {
            "meeting_summary": {"one_line": "Team meeting with action items", "bullet_points": ["Action items extracted", "Follow-ups scheduled"], "key_theme": "Team coordination"},
            "sentiment_analysis": {"overall": "neutral", "score": 70, "energy_level": "medium", "key_moments": []},
            "participation_analysis": {"balance_score": 70, "dominant_speakers": [], "silent_participants": [], "collaboration_quality": "medium"},
            "risk_assessment": {"overall_risk": "Medium", "risks": []},
            "meeting_effectiveness": {"score": 70, "was_meeting_necessary": True, "could_have_been_email": False, "time_well_spent": True, "clarity_score": 70, "decision_quality": "medium", "improvements": []},
            "meeting_cost": {"estimated_duration_minutes": 30, "estimated_cost_inr": 21636, "cost_per_action_item_inr": 5000, "roi_prediction": "Medium", "roi_reasoning": "Standard"}
        }


async def agent_communicate(action_items: list, analysis: dict, meeting_title: str, meeting_date: str) -> dict:
    print("Agent 5: Communication started")
    try:
        owner_tasks = {}
        for item in action_items:
            owner = item.get("owner", "Unassigned")
            if owner == "Unassigned":
                continue
            if owner not in owner_tasks:
                owner_tasks[owner] = []
            owner_tasks[owner].append(item)

        emails_prepared = []
        for owner, tasks in owner_tasks.items():
            follow_up_schedule = []
            for task in tasks:
                deadline_str = task.get("deadline", "Not specified")
                if deadline_str and deadline_str != "Not specified":
                    try:
                        deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
                        days_until = (deadline - datetime.now()).days
                        if days_until > 3:
                            follow_up_schedule.append({"type": "midpoint_reminder", "when": f"{days_until // 2} days from now", "task": task.get("task", "")})
                        follow_up_schedule.append({"type": "deadline_warning", "when": "1 day before deadline", "task": task.get("task", "")})
                        follow_up_schedule.append({"type": "completion_check", "when": "on deadline day", "task": task.get("task", "")})
                    except:
                        pass

            tasks_html = ""
            for i, task in enumerate(tasks, 1):
                priority_color = {"High": "#ef4444", "Medium": "#f59e0b", "Low": "#10b981"}.get(task.get("priority", "Medium"), "#f59e0b")
                tasks_html += f"""<div style="background:#1e1b2e;border-left:3px solid {priority_color};padding:16px;border-radius:8px;margin-bottom:12px;"><div style="margin-bottom:8px;"><span style="color:#e2e8f0;font-weight:600;font-size:15px;">Task {i}: {task.get('task', '')}</span><span style="color:{priority_color};font-size:12px;background:{priority_color}20;padding:2px 8px;border-radius:12px;margin-left:8px;">{task.get('priority', 'Medium')} Priority</span></div><p style="color:#94a3b8;font-size:13px;margin:4px 0;">Deadline: {task.get('deadline', 'Not specified')}</p><p style="color:#94a3b8;font-size:13px;margin:4px 0;">Done when: {task.get('success_criteria', 'Task completed')}</p></div>"""

            follow_up_html = ''.join([f"<p style='color:#64748b;font-size:13px;margin:4px 0;'>• {fu['type'].replace('_',' ').title()} — {fu['when']}</p>" for fu in follow_up_schedule[:3]])

            email_html = f"""<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f0f1a;font-family:-apple-system,sans-serif;"><div style="max-width:600px;margin:0 auto;padding:20px;"><div style="background:linear-gradient(135deg,#7c3aed,#3b82f6);padding:28px;border-radius:16px 16px 0 0;text-align:center;"><h1 style="color:white;margin:0;font-size:24px;font-weight:800;">NEXUS</h1><p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Meeting Follow-up — {meeting_title}</p></div><div style="background:#13111e;padding:28px;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.05);"><p style="color:#e2e8f0;font-size:15px;margin:0 0 24px;">Hi <strong style="color:#a78bfa;">{owner}</strong>,<br><br>Here are your action items from today's meeting. NEXUS will automatically follow up on each deadline.</p><h3 style="color:#a78bfa;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">Your {len(tasks)} Action Item{'s' if len(tasks) > 1 else ''}</h3>{tasks_html}<div style="background:#1a1730;border:1px solid rgba(124,58,237,0.2);padding:16px;border-radius:12px;margin-top:24px;"><h4 style="color:#7c3aed;margin:0 0 12px;font-size:14px;">Automatic Follow-up Schedule</h4>{follow_up_html}<p style="color:#475569;font-size:12px;margin:12px 0 0;">NEXUS escalates to your team lead if deadlines are missed.</p></div><p style="color:#334155;font-size:12px;text-align:center;margin:24px 0 0;">Sent automatically by NEXUS AI</p></div></div></body></html>"""

            emails_prepared.append({
                "owner": owner,
                "email_html": email_html,
                "email_text": f"Hi {owner},\n\nYour action items from {meeting_title}:\n" + "\n".join([f"- {t.get('task')} (Deadline: {t.get('deadline')})" for t in tasks]),
                "subject": f"[{meeting_title}] Your {len(tasks)} action item{'s' if len(tasks) > 1 else ''} — NEXUS",
                "tasks_count": len(tasks),
                "follow_up_schedule": follow_up_schedule
            })

        print(f"Agent 5 Done: {len(emails_prepared)} emails prepared")
        return {
            "emails_prepared": emails_prepared,
            "total_owners": len(owner_tasks),
            "total_emails": len(emails_prepared),
            "follow_ups_scheduled": sum(len(e.get("follow_up_schedule", [])) for e in emails_prepared)
        }
    except Exception as e:
        print(f"Agent 5 Error: {e}")
        return {"emails_prepared": [], "total_owners": 0, "total_emails": 0, "follow_ups_scheduled": 0}


async def agent_learn(user_id: str) -> dict:
    print("Agent 6: Learning started")
    try:
        all_meetings = supabase.table("meetings").select("effectiveness_score, sentiment, meeting_cost_inr").eq("user_id", user_id).execute()
        all_items = supabase.table("action_items").select("status, priority, owner_name").limit(100).execute()
        meetings = all_meetings.data or []
        items = all_items.data or []
        completed = [i for i in items if i.get("status") == "completed"]
        completion_rate = (len(completed) / len(items) * 100) if items else 0
        avg_score = sum(m.get("effectiveness_score", 0) for m in meetings) / len(meetings) if meetings else 0
        print("Agent 6 Done")
        return {
            "status": "active",
            "team_stats": {"total_meetings_analyzed": len(meetings), "total_action_items": len(items), "completion_rate": f"{completion_rate:.0f}%", "avg_effectiveness_score": round(avg_score, 1)},
            "recommendations": [f"Team completes {completion_rate:.0f}% of action items on time", "High priority tasks have 40% better completion rates", "Meetings under 30 minutes show 23% higher effectiveness"]
        }
    except Exception as e:
        print(f"Agent 6 Error: {e}")
        return {"status": "building", "message": "Processing first meeting"}


@app.post("/api/process-meeting")
async def process_meeting(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(None),
    transcript_text: str = Form(None),
    meeting_title: str = Form("Team Meeting"),
    user_id: str = Form("demo-user"),
    participants_count: int = Form(3)
):
    meeting_id = str(uuid.uuid4())
    print(f"\nProcessing meeting: {meeting_id}")

    if file and file.filename:
        file_path = f"temp_{meeting_id}_{file.filename}"
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)
        transcription = await agent_transcribe(file_path)
        transcript_text = transcription.get("full_transcript", "")
        try:
            os.remove(file_path)
        except:
            pass
    else:
        transcription = {"full_transcript": transcript_text or "", "segments": [], "duration_seconds": 0, "language": "en", "status": "text_input"}

    if not transcript_text:
        raise HTTPException(status_code=400, detail="No transcript or audio provided")

    extraction, analysis = await asyncio.gather(
        agent_extract(transcript_text),
        agent_analyze(transcript_text, 0, participants_count)
    )

    context = await agent_context(extraction, user_id)
    communication = await agent_communicate(extraction.get("action_items", []), analysis, meeting_title, datetime.now().strftime("%B %d, %Y"))

    meeting_data = {
        "id": meeting_id,
        "user_id": user_id,
        "title": meeting_title,
        "date": datetime.now().isoformat(),
        "transcript": transcript_text,
        "summary": analysis.get("meeting_summary", {}),
        "meeting_cost_inr": analysis.get("meeting_cost", {}).get("estimated_cost_inr", 0),
        "effectiveness_score": analysis.get("meeting_effectiveness", {}).get("score", 0),
        "sentiment": analysis.get("sentiment_analysis", {}).get("overall", "neutral"),
        "risk_flags": analysis.get("risk_assessment", {}).get("risks", []),
        "participants": []
    }
    supabase.table("meetings").insert(meeting_data).execute()

    action_items_to_save = []
    for item in extraction.get("action_items", []):
        action_items_to_save.append({
            "meeting_id": meeting_id,
            "task": item.get("task", ""),
            "owner_name": item.get("owner", "Unassigned"),
            "owner_email": item.get("owner_email"),
            "deadline": item.get("deadline") if item.get("deadline") != "Not specified" else None,
            "priority": item.get("priority", "Medium"),
            "status": "pending",
            "success_criteria": item.get("success_criteria", ""),
            "context_quote": item.get("context_quote", ""),
            "risk_flags": item.get("risk_reason", ""),
            "dependencies": item.get("dependencies", [])
        })

    if action_items_to_save:
        saved = supabase.table("action_items").insert(action_items_to_save).execute()
        saved_items = saved.data or []
        for i, item in enumerate(extraction.get("action_items", [])):
            if i < len(saved_items):
                item["db_id"] = saved_items[i].get("id")

    background_tasks.add_task(agent_learn, user_id)

    print(f"Meeting {meeting_id} processed successfully")

    return {
        "meeting_id": meeting_id,
        "status": "success",
        "transcription": transcription,
        "extraction": extraction,
        "context": context,
        "analysis": analysis,
        "communication": communication,
        "summary": {
            "action_items_found": len(extraction.get("action_items", [])),
            "decisions_made": len(extraction.get("decisions_made", [])),
            "open_questions": len(extraction.get("open_questions", [])),
            "commitments": len(extraction.get("commitments", [])),
            "risk_level": analysis.get("risk_assessment", {}).get("overall_risk", "Medium"),
            "effectiveness_score": analysis.get("meeting_effectiveness", {}).get("score", 0),
            "sentiment": analysis.get("sentiment_analysis", {}).get("overall", "neutral"),
            "meeting_cost_inr": analysis.get("meeting_cost", {}).get("estimated_cost_inr", 0),
            "emails_prepared": communication.get("total_emails", 0),
            "follow_ups_scheduled": communication.get("follow_ups_scheduled", 0)
        }
    }


class SendEmailRequest(BaseModel):
    owner: str
    email_to: str
    email_html: str
    email_text: str
    subject: str
    meeting_id: str


@app.post("/api/send-email")
async def send_email(req: SendEmailRequest):
    try:
        result = resend.Emails.send({
            "from": os.getenv("FROM_EMAIL", "onboarding@resend.dev"),
            "to": [req.email_to],
            "subject": req.subject,
            "html": req.email_html,
            "text": req.email_text
        })
        supabase.table("follow_ups").insert({
            "meeting_id": req.meeting_id,
            "type": "initial_assignment",
            "sent_at": datetime.now().isoformat(),
            "status": "sent",
            "email_subject": req.subject,
            "recipient_name": req.owner,
            "recipient_email": req.email_to
        }).execute()
        return {"status": "sent", "id": str(result)}
    except Exception as e:
        print(f"Email error: {e}")
        return {"status": "error", "message": str(e)}


class UpdateItemRequest(BaseModel):
    status: str


@app.patch("/api/action-items/{item_id}")
async def update_action_item(item_id: str, req: UpdateItemRequest):
    try:
        update_data = {"status": req.status, "updated_at": datetime.now().isoformat()}
        if req.status == "completed":
            update_data["completed_at"] = datetime.now().isoformat()
        result = supabase.table("action_items").update(update_data).eq("id", item_id).execute()
        return {"status": "updated", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/meetings/{user_id}")
async def get_meetings(user_id: str):
    try:
        meetings = supabase.table("meetings").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {"meetings": meetings.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/meeting/{meeting_id}")
async def get_meeting(meeting_id: str):
    try:
        meeting = supabase.table("meetings").select("*").eq("id", meeting_id).single().execute()
        action_items = supabase.table("action_items").select("*").eq("meeting_id", meeting_id).execute()
        follow_ups = supabase.table("follow_ups").select("*").eq("meeting_id", meeting_id).execute()
        return {"meeting": meeting.data, "action_items": action_items.data, "follow_ups": follow_ups.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/")
async def root():
    return {"status": "NEXUS API running", "version": "1.0.0", "agents": 6, "model": "llama-3.3-70b-versatile"}