import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driveService, applicationService } from '../../services/api'; // We'll assume these exist or will exist
import { Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export default function TakeTest() {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestDetails();
  }, [driveId]);

  const fetchTestDetails = async () => {
    try {
      // We might need a specific endpoint for fetching drive with questions for students
      // For now, assuming standard get drive endpoint returns questions if logged in as student?
      // Actually, we usually hide questions until test start. 
      // But let's assume getDrives or a new endpoint returns it.
      // Let's use a specific endpoint we'll create: getDriveTest
      const response = await driveService.getDriveTest(driveId);
      setDrive(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load test. It might not be available yet or you're not eligible.");
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to submit your test? You cannot change answers after submission.")) {
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans
      }));

      await applicationService.submitTest({
        driveId,
        answers: formattedAnswers
      });

      alert("Test submitted successfully! Your application has been received.");
      navigate('/student/home');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit test. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading test...</div>;
  if (error) return (
    <div className="flex flex-col h-screen items-center justify-center text-red-600 gap-4">
      <AlertCircle className="w-12 h-12" />
      <p>{error}</p>
      <Button onClick={() => navigate('/student/home')}>Back to Home</Button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{drive.title} - Screening Test</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          {timeLeft !== null && (
            <span className={`flex items-center gap-1 font-bold text-lg ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
              <Clock className="w-5 h-5" />
              Time Left: {formatTime(timeLeft)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {drive.questions?.length || 0} Questions
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {drive.questions && drive.questions.map((q, index) => (
          <Card key={q._id || index}>
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Question {index + 1}</span>
                <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border">
                  {q.marks} Marks
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-gray-800 whitespace-pre-wrap">{q.question}</p>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <textarea
                  required
                  value={answers[q._id] || ''}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  className="w-full min-h-[150px] p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Type your answer here..."
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Questions Answered: {Object.keys(answers).length} / {drive.questions?.length || 0}
          </div>
          <Button type="submit" isLoading={submitting} className="w-48">
            Submit Test
          </Button>
        </div>
      </form>
    </div>
  );
}
