import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

const AboutPage = () => {
  return (
    <Layout>
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
          
          <h1 className="text-4xl font-bold text-food-orange mb-8">About The Digital Diner</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in 2024, The Digital Diner brings together the best of traditional dining 
                with modern convenience. Our passion for exceptional food and customer service 
                drives us to create memorable dining experiences for our valued customers.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We strive to deliver high-quality, delicious meals while providing an 
                exceptional digital ordering experience. Our commitment to freshness, 
                quality ingredients, and customer satisfaction sets us apart.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Restaurant Information</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-food-orange mt-1" />
                <div>
                  <h3 className="font-medium dark:text-gray-100">Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">Mon-Fri: 11:00 AM - 10:00 PM</p>
                  <p className="text-gray-600 dark:text-gray-300">Sat-Sun: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-food-orange mt-1" />
                <div>
                  <h3 className="font-medium dark:text-gray-100">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">123 Digital Street</p>
                  <p className="text-gray-600 dark:text-gray-300">Tech City, TC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-food-orange mt-1" />
                <div>
                  <h3 className="font-medium dark:text-gray-100">Contact</h3>
                  <p className="text-gray-600 dark:text-gray-300">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-food-orange mt-1" />
                <div>
                  <h3 className="font-medium dark:text-gray-100">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">info@thedigitaldiner.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-medium mb-2 dark:text-gray-100">Fresh Ingredients</h3>
                <p className="text-gray-600 dark:text-gray-300">We source only the freshest ingredients daily</p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2 dark:text-gray-100">Fast Delivery</h3>
                <p className="text-gray-600 dark:text-gray-300">Quick and reliable delivery service</p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2 dark:text-gray-100">Quality Service</h3>
                <p className="text-gray-600 dark:text-gray-300">Dedicated to customer satisfaction</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AboutPage; 