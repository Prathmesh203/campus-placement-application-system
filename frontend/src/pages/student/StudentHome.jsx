import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, MapPin, Briefcase, Calendar, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { driveService, applicationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentHome() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null); // driveId being applied to
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          driveService.getDrives(),
          applicationService.getMyApplications()
        ]);
        setDrives(drivesRes.data);
        setMyApplications(appsRes.data);
      } catch (error) {
        console.error("Failed to fetch drives", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hasApplied = (driveId) => {
    return myApplications.some(app => app.driveId?._id === driveId || app.driveId === driveId);
  };

  const isEligible = (drive) => {
    return (user.cgpa || 0) >= drive.cgpaCutoff;
  };

  const handleApply = async (driveId) => {
    setApplying(driveId);
    try {
      await applicationService.apply(driveId);
      // Refresh applications list
      const res = await applicationService.getMyApplications();
      setMyApplications(res.data);
      alert("Applied successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const filteredDrives = drives.filter(drive => {
    const searchMatch = drive.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (drive.requiredSkills && drive.requiredSkills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const skillMatch = filterSkill === '' || (drive.requiredSkills && drive.requiredSkills.some(s => s.name.toLowerCase() === filterSkill.toLowerCase()));

    return searchMatch && skillMatch;
  });

  // Extract unique skills for the filter dropdown
  const uniqueSkills = [...new Set(drives.flatMap(d => (d.requiredSkills || []).map(s => s.name)))];

  if (loading) return <div className="text-center py-8">Loading drives...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Placement Drives</h1>
          <p className="text-slate-500">Explore opportunities and filter by your interests.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search companies, roles..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
          >
            <option value="">All Categories/Skills</option>
            {uniqueSkills.map((skill, idx) => (
              <option key={idx} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredDrives.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <p className="text-slate-500">No active drives found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrives.map(drive => {
            const applied = hasApplied(drive._id);
            const eligible = isEligible(drive);

            return (
              <Card key={drive._id} className="hover:shadow-md transition-shadow flex flex-col h-full border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-lg font-bold">{drive.companyName}</span>
                    {eligible ? (
                       <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                         <CheckCircle2 className="h-3 w-3" /> Eligible
                       </span>
                    ) : (
                       <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                         <XCircle className="h-3 w-3" /> Not Eligible
                       </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{drive.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">{drive.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> {drive.salary}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Deadline: {new Date(drive.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Min CGPA: {drive.cgpaCutoff}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {drive.requiredSkills?.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={!eligible || applied || applying === drive._id}
                    onClick={() => handleApply(drive._id)}
                  >
                    {applied ? 'Applied' : applying === drive._id ? 'Applying...' : eligible ? (drive.questions?.length > 0 ? 'Take Test & Apply' : 'Apply Now') : 'Not Eligible'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
