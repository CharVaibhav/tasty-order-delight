import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowLeft, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      
      // In a real implementation, you would create a FormData object
      // and append both the form fields and the file
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (selectedFile) {
        formDataToSend.append('attachment', selectedFile);
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Format phone number as Indian format: +91 XXXXX XXXXX
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length >= 10) {
        formatted = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
      }
      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="flex items-center text-food-orange hover:bg-food-orange/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-food-orange mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message"
                    rows={4}
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Attachment (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="dark:bg-gray-800 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-food-orange/10 file:text-food-orange hover:file:bg-food-orange/20"
                    />
                    {selectedFile && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Paperclip className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Upload any relevant documents or images (Max size: 5MB)
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-food-orange mt-1" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">123 Digital Street</p>
                    <p className="text-gray-600 dark:text-gray-300">Tech City, TC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-food-orange mt-1" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
                    <p className="text-gray-600 dark:text-gray-300">+91 98765 43211</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-food-orange mt-1" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">info@thedigitaldiner.com</p>
                    <p className="text-gray-600 dark:text-gray-300">support@thedigitaldiner.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-food-orange mt-1" />
                  <div>
                    <h3 className="font-medium dark:text-gray-100">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 11:00 AM - 10:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-300">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default ContactPage; 