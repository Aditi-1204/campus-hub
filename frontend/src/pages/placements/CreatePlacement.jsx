import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { createPlacement } from '../../services/placementService';

const INITIAL = { company: '', role: '', description: '', package: '', eligibility: '', location: '', deadline: '' };

export default function CreatePlacement() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.role.trim()) e.role = 'Role is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    else if (new Date(form.deadline) < new Date()) e.deadline = 'Deadline must be in the future';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    try {
      await createPlacement(form);
      toast.success('Placement created successfully! 🎉');
      navigate('/placements');
    } catch (err) {
      toast.error(err.message || 'Failed to create placement');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, as }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {as === 'textarea' ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/placements')} className="text-blue-200 text-sm hover:text-white mb-4 flex items-center gap-1 transition">
            ← Back to Placements
          </button>
          <h1 className="text-2xl font-bold">📋 Post a Placement</h1>
          <p className="text-blue-200 text-sm mt-1">Fill in the details to publish a new opportunity</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field name="company" label="Company Name *" placeholder="e.g. Google" />
            <Field name="role" label="Role / Position *" placeholder="e.g. Software Engineer" />
            <Field name="package" label="Package (CTC)" placeholder="e.g. 12 LPA" />
            <Field name="location" label="Location" placeholder="e.g. Bangalore, Remote" />
            <Field name="eligibility" label="Eligibility Criteria" placeholder="e.g. CGPA ≥ 7.0, CSE/IT only" />
            <Field name="deadline" label="Application Deadline *" type="date" />
          </div>
          <Field name="description" label="Job Description *" placeholder="Describe the role, responsibilities, and requirements..." as="textarea" />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/placements')}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-800 hover:to-indigo-700 transition text-sm disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : '🚀 Publish Placement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
