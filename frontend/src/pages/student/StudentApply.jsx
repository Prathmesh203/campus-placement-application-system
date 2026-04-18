import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, PlayCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { applicationService } from '../../services/api';

export default function StudentApply() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationService.getMyApplications();
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div className="text-center py-8">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500">Track status and take tests.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applied Companies</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
           <div className="text-center py-12 text-slate-500">
             <p>No active applications found. Visit the Home page to find opportunities.</p>
             <Button className="mt-4" onClick={() => window.location.href = '/student/home'}>Browse Jobs</Button>
           </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => {
                 const isTestActive = app.status === 'test_pending' || app.status === 'shortlisted'; 
                 // Simple logic: if shortlisted or specifically test_pending, show button. 
                 // Real logic might depend on testDate vs now.

                 return (
                  <div key={app._id} className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{app.driveId.companyName}</h3>
                      <p className="text-sm text-slate-600">{app.driveId.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                         <span className="flex items-center gap-1">
                           <Clock className="h-3 w-3" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                         </span>
                         <span className={`px-2 py-0.5 rounded-full capitalize ${
                           app.status === 'hired' ? 'bg-green-100 text-green-700' :
                           app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                           'bg-blue-100 text-blue-700'
                         }`}>
                           Status: {app.status.replace('_', ' ')}
                         </span>
                      </div>
                    </div>
                    
                    <div>
                      <Button 
                        disabled={!isTestActive} 
                        variant={isTestActive ? 'primary' : 'outline'}
                        className="gap-2"
                        onClick={() => window.location.href = '/test'}
                      >
                        <PlayCircle className="h-4 w-4" />
                        {isTestActive ? 'Start Test' : 'Test Not Active'}
                      </Button>
                    </div>
                  </div>
                 );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
