import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { enquiryService } from '../../services/enquiryService';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';
import Button from '../../components/common/Button';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { collegeInfo, settings } = useCollege();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Enquiry',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const collegeName = collegeInfo?.collegeName || settings?.collegeName || 'Apex Institute of Technology & Sciences';
  const address = settings?.address || 'Knowledge Park IV, Educational Expressway, Metropolis Campus - 400012';
  const phone = settings?.phone || '+91 (0) 1234 567890';
  const email = settings?.email || 'info@college.edu';
  const mapEmbedUrl = settings?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.4820014!3d28.5029312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMwJzEwLjUiTiA3N8KwMjgnNTUuMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      error('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await enquiryService.submitEnquiry(formData);
      if (res.success) {
        success('Your enquiry has been submitted successfully! We will get back to you shortly.');
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'General Enquiry',
          subject: '',
          message: '',
        });
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Contact Us & Campus Location"
        description={`Get in touch with ${collegeName}. Reach our admissions office, submit an inquiry, or locate our campus.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Contact Us & Help Desk
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Have questions regarding admissions, academics, research collaborations, or campus visits? Send us a message and our team will assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Map Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-academic-navy text-white rounded-3xl p-8 shadow-xl space-y-6">
              <h3 className="text-xl font-bold font-heading text-white border-b border-slate-700 pb-3">
                Campus Location & Offices
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Campus Address</span>
                    <span className="leading-relaxed">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">General Inquiries</span>
                    <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Email Support</span>
                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Office Working Hours</span>
                    <span>Monday - Saturday: 09:00 AM - 05:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            {mapEmbedUrl && (
              <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-64 bg-slate-100">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Campus Map"
                />
              </div>
            )}
          </div>

          {/* Public Enquiry Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                Public Inquiry Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-academic-navy font-heading mt-2">
                Send Us an Official Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                No login required. We will respond directly to the email or phone number you provide.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-950 font-heading">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Apex Institute. Our administrative officers have received your message and will contact you promptly.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. jane@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Academic Information">Academic Information</option>
                      <option value="Fee / Scholarship">Fee / Scholarship</option>
                      <option value="Campus Visit">Campus Visit</option>
                      <option value="Placements">Placements</option>
                      <option value="Grievance / Feedback">Grievance / Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Admission inquiry for B.Tech Computer Science 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your detailed questions or query here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={submitting}
                  icon={Send}
                  className="w-full sm:w-auto"
                >
                  Submit Official Enquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
