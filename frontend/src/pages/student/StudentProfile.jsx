import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';
import { Button } from '../../components/common/Button';
import { Save } from 'lucide-react';

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    collegeId: user?.collegeId || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    graduationYear: user?.graduationYear || '',
    skills: user?.skills || [],
    resume: user?.resume || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, field, value) => {
      const newSkills = [...formData.skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, { name: '', level: 'Beginner' }] }));
  };

  const removeSkill = (index) => {
      setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Filter out empty skills
      const validSkills = formData.skills.filter(s => s.name.trim() !== '');
      await updateUser({ ...formData, skills: validSkills });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500">Manage your personal and academic information.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={user?.email || ''}
                  disabled={true} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume Link (Drive/Dropbox URL)</Label>
                <Input
                  id="resume"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-medium text-lg">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collegeId">College ID</Label>
                  <Input
                    id="collegeId"
                    name="collegeId"
                    value={formData.collegeId}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Skills</h3>
                {isEditing && (
                    <Button type="button" onClick={addSkill} size="sm" variant="outline">
                        + Add Skill
                    </Button>
                )}
              </div>
              <div className="space-y-4">
                {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <div className="flex-1">
                            <Input 
                                placeholder="Skill Name (e.g. React)"
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div className="w-1/3">
                            <select
                                value={skill.level}
                                onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={() => removeSkill(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                {formData.skills.length === 0 && (
                    <p className="text-slate-500 text-sm">No skills added yet.</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsEditing(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" form="profile-form" isLoading={isLoading}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
