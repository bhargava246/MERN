
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-white to-blue-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,white)] opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="heading-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              Track Your Goals, Optimize Your Time
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Simple, intuitive goal tracking to help you stay on top of your targets and visualize your progress.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-lg px-8 h-12">
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12">
              <a href="#features">Learn More</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureSection = () => {
  const features = [
    {
      title: "Track Your Goals",
      description: "Set meaningful goals with target times and track your progress as you work towards them.",
      icon: "📋"
    },
    {
      title: "Log Daily Progress",
      description: "Record time spent on your goals each day to maintain consistent improvement.",
      icon: "⏱️"
    },
    {
      title: "Visualize Progress",
      description: "Beautiful charts help you visualize your time investment and overall progress.",
      icon: "📊"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Features Designed for Success</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform is built to help you achieve your goals through intentional time tracking and progress visualization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glass-card rounded-lg p-6 h-full flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="heading-lg mb-6">Ready to start tracking your goals?</h2>
          <p className="text-lg mb-8 text-white/80">
            Join thousands of users who are achieving their goals with our platform.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary text-lg px-8 h-12">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
