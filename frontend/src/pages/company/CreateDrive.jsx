import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';
import { Button } from '../../components/common/Button';
import { driveService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';

export default function CreateDrive() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batchYear: '',
    batchYear: '',
    cgpaCutoff: '',
    requiredSkills: [{ name: '', level: 'Beginner' }],
    salary: '',
    deadline: '',
    testDate: ''
  });

  const [questions, setQuestions] = useState([
    { question: '', marks: 10 }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, field, value) => {
      const newSkills = [...formData.requiredSkills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      setFormData(prev => ({ ...prev, requiredSkills: newSkills }));
  };

  const addSkill = () => {
      setFormData(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, { name: '', level: 'Beginner' }] }));
  };

  const removeSkill = (index) => {
      setFormData(prev => ({ ...prev, requiredSkills: prev.requiredSkills.filter((_, i) => i !== index) }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', marks: 10 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Filter out empty questions
      const validQuestions = questions.filter(q => q.question.trim() !== '');
      const validSkills = formData.requiredSkills.filter(s => s.name.trim() !== '');
      
      await driveService.createDrive({
        ...formData,
        requiredSkills: validSkills,
        questions: validQuestions
      });
      alert("Drive created successfully!");
      navigate('/company/drives');
    } catch (error) {
      alert("Failed to create drive. Please check inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Post New Drive</h1>
        <p className="text-slate-500">Create a new job opportunity and set up the screening test.</p>
      </div>

      <form id="create-drive-form" onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Software Engineer I"
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full min-h-[100px] p-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="batchYear">Target Batch Year</Label>
                    <Input
                        id="batchYear"
                        name="batchYear"
                        type="number"
                        value={formData.batchYear}
                        onChange={handleChange}
                        required
                        placeholder="2024"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cgpaCutoff">Min CGPA Cutoff</Label>
                    <Input
                        id="cgpaCutoff"
                        name="cgpaCutoff"
                        type="number"
                        step="0.01"
                        value={formData.cgpaCutoff}
                        onChange={handleChange}
                        required
                        placeholder="7.5"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="salary">Salary Package (LPA)</Label>
                    <Input
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                        placeholder="10-12 LPA"
                    />
                </div>
                <div className="md:col-span-2 space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <Label>Required Skills</Label>
                        <Button type="button" onClick={addSkill} size="sm" variant="outline">
                            + Add Skill
                        </Button>
                    </div>
                    {formData.requiredSkills.map((skill, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <div className="flex-1">
                                <Input 
                                    placeholder="Skill Name (e.g. React)"
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-1/3">
                                <select
                                    value={skill.level}
                                    onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                                    className="w-full px-3 py-2 border rounded border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeSkill(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {formData.requiredSkills.length === 0 && (
                        <p className="text-slate-500 text-sm">No skills added yet.</p>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="testDate">Test Date</Label>
                    <Input
                        id="testDate"
                        name="testDate"
                        type="date"
                        value={formData.testDate}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Test Duration (Minutes)</Label>
                    <Input
                        id="duration"
                        name="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Screening Test Questions</CardTitle>
            <Button type="button" onClick={addQuestion} size="sm" variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">
              Add questions for the screening test. Students must answer these before applying.
            </p>
            
            {questions.map((q, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="mt-3 font-medium text-slate-400">#{index + 1}</span>
                <div className="flex-1 space-y-2">
                  <Label>Question</Label>
                  <textarea
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    className="w-full min-h-[60px] p-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter question text..."
                    required
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                    required
                  />
                </div>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="mt-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => navigate('/company/drives')}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>
                Create Drive & Test
            </Button>
        </div>
      </form>
    </div>
  );
}
