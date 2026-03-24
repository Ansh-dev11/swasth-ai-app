"""
Medical report route handlers
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional
from app.middleware.auth import verify_token
from app.services import ai_service, supabase_service, pdf_service
from app.utils.helpers import generate_id
from pydantic import BaseModel

router = APIRouter(prefix="/api/reports", tags=["Reports"])


class AnalyzeReportRequest(BaseModel):
    findings: Optional[Dict[str, Any]] = None
    report_content: Optional[str] = None


@router.post("/upload")
async def upload_report(
    title: str = Form(...),
    report_type: str = Form(...),
    findings: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Upload a medical report
    """
    try:
        user_id = user.get("id")
        
        if not title or not report_type:
            raise HTTPException(
                status_code=400,
                detail="Title and report type are required"
            )
        
        file_url = None
        
        # TODO: Upload file to Supabase Storage if provided
        # For now, we'll skip file upload
        
        # Parse findings if it's a JSON string
        parsed_findings = {}
        if findings:
            try:
                import json
                parsed_findings = json.loads(findings) if isinstance(findings, str) else findings
            except:
                parsed_findings = {"raw": findings}
        
        # Save report to database
        report = await supabase_service.save_report(
            user_id,
            title,
            report_type,
            parsed_findings,
            file_url,
            date
        )
        
        return {
            "success": True,
            "data": {
                "message": "Report uploaded successfully",
                "report": report
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        print(f"Upload error: {str(error)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload report: {str(error)}")


@router.get("/")
async def get_reports_authenticated(
    report_type: Optional[str] = None,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Get all reports for authenticated user
    """
    try:
        user_id = user.get("id")
        reports = await supabase_service.get_reports(user_id, report_type)
        
        return {
            "success": True,
            "data": reports,
            "count": len(reports)
        }
    except Exception as error:
        print(f"Get reports error: {str(error)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(error)}")


@router.get("/{report_id}")
async def get_report(
    report_id: str,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Get a specific report
    """
    try:
        user_id = user.get("id")
        db = supabase_service.get_supabase_admin()
        
        response = db.table("medical_reports").select("*").eq(
            "id", report_id
        ).eq("user_id", user_id).single().execute()
        
        report = response.data
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {
            "success": True,
            "data": report
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Delete a report
    """
    try:
        user_id = user.get("id")
        db = supabase_service.get_supabase_admin()
        
        # Check ownership
        response = db.table("medical_reports").select(
            "file_url"
        ).eq("id", report_id).eq("user_id", user_id).single().execute()
        
        report = response.data
        
        if not report:
            raise HTTPException(status_code=403, detail="Not authorized to delete this report")
        
        # TODO: Delete file from storage if exists
        
        # Delete from database
        db.table("medical_reports").delete().eq("id", report_id).execute()
        
        return {
            "success": True,
            "data": {
                "message": "Report deleted successfully"
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/{report_id}/analyze")
async def analyze_report(
    report_id: str,
    request: AnalyzeReportRequest,
    user: dict = Depends(verify_token)
) -> Dict[str, Any]:
    """
    Analyze a medical report using AI
    """
    try:
        user_id = user.get("id")
        db = supabase_service.get_supabase_admin()
        
        # Get report
        response = db.table("medical_reports").select("*").eq(
            "id", report_id
        ).eq("user_id", user_id).single().execute()
        
        report = response.data
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Use AI to analyze report
        analysis = request.findings
        if request.report_content and not request.findings:
            try:
                analysis = await ai_service.analyze_health_report(
                    request.report_content,
                    report.get("report_type")
                )
            except Exception as ai_error:
                analysis = {"error": str(ai_error)}
        
        # Update report
        updated_response = db.table("medical_reports").update({
            "findings": analysis,
            "analyzed_at": __import__("datetime").datetime.utcnow().isoformat()
        }).eq("id", report_id).execute()
        
        updated = updated_response.data[0] if updated_response.data else {}
        
        return {
            "success": True,
            "data": {
                "message": "Report analyzed successfully",
                "report": updated
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/download/health-report")
async def download_health_report():
    """
    Generate and download a PDF health report (no authentication required).
    Uses AI to generate a sample health summary.
    """
    try:
        user_name = "Ansh Sharma"
        
        # Generate AI summary of health data
        prompt = f"""Create a comprehensive health report for {user_name} based on typical health metrics.
        
Include sections on:
1. Overall Health Status
2. Key Vital Signs Analysis (BP, Sugar levels, Weight trends)
3. Risk Assessment
4. Recommendations
5. Follow-up Actions

Make it professional and detailed."""
        
        summary_response = await ai_service.ask_health_question(prompt)
        health_summary = summary_response.get("answer", "Unable to generate health summary.")

        # Generate PDF
        pdf_buffer = pdf_service.generate_health_report_pdf(user_name, health_summary)

        return StreamingResponse(
            iter([pdf_buffer.getvalue()]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment;filename=health_report_{user_name}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")
