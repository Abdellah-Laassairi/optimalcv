import { memo } from "react";
import {
  FiZap,
  FiCheckCircle,
  FiCode,
  FiPlay,
  FiTrendingUp,
  FiClock,
  FiAward,
} from "react-icons/fi";
import Card from "../components/Card";
import Preview from "../components/Preview";

const Home = memo(() => {
  const sampleCV = `# Sarah Johnson
**Senior Software Engineer**

📧 sarah.johnson@email.com | 📱 (555) 123-4567

## Experience

**Tech Lead** @ Innovation Labs | 2021-Present
- Led team of 8 engineers building scalable microservices
- Reduced system latency by 40% through optimization
- Implemented CI/CD pipeline reducing deployment time by 60%

## Skills

React, TypeScript, Node.js, AWS, Docker, Kubernetes`;

  return (
    <>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pb-12 lg:pb-20">
        <div className="space-y-6 max-w-2xl">
          <div className="acv-hero-badge">
            <FiZap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="acv-hero-gradient whitespace-nowrap">
              AI-Powered CV Generation
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            <span className="acv-hero-title">Craft the perfect CV</span>
            <br />
            <span className="acv-hero-gradient">for every opportunity</span>
          </h1>

          <p className="text-lg md:text-xl acv-hero-description leading-relaxed">
            Transform your career with AI-tailored CVs. Our intelligent system
            analyzes job requirements and automatically highlights your most
            relevant skills and experience. Generate a professional CV in
            seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a
              href="#/generator"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
            >
              <FiPlay className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Generating Free
            </a>
            <a href="#/api" className="acv-btn-secondary">
              <FiCode className="w-5 h-5" />
              View API Docs
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
            {[
              {
                icon: FiCheckCircle,
                title: "AI-Powered",
                desc: "Intelligent matching",
              },
              {
                icon: FiCheckCircle,
                title: "Print Ready",
                desc: "Export as PDF instantly",
              },
              {
                icon: FiCheckCircle,
                title: "ATS Optimized",
                desc: "Beats tracking systems",
              },
              {
                icon: FiCheckCircle,
                title: "100% Private",
                desc: "Data never stored",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className="w-6 h-6 acv-feature-check flex-shrink-0 mt-0.5" />
                <div>
                  <div className="acv-feature-title text-sm mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-xs acv-feature-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <div className="absolute -inset-4 acv-preview-glow rounded-3xl"></div>
          <Card className="relative overflow-hidden acv-preview-card">
            <div className="prose prose-invert max-w-none text-sm overflow-hidden">
              <Preview markdown={sampleCV} />
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20 border-y acv-section-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {[
            { value: "10K+", label: "CVs Generated" },
            { value: "95%", label: "Success Rate" },
            { value: "<30s", label: "Average Time" },
            { value: "100%", label: "Free Forever" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl md:text-6xl font-bold acv-stat-value mb-2">
                {stat.value}
              </div>
              <div className="text-sm acv-feature-desc">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold acv-heading mb-4">
            Why Choose OptimalCV?
          </h2>
          <p className="text-lg md:text-xl acv-hero-description max-w-2xl mx-auto">
            Built with cutting-edge AI to save you time and increase your
            interview chances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: FiZap,
              title: "AI-Powered Matching",
              desc: "Analyzes job descriptions and automatically tailors your CV to highlight the most relevant skills and experience.",
              gradient: "from-indigo-500 to-purple-500",
            },
            {
              icon: FiTrendingUp,
              title: "ATS Optimized",
              desc: "Every CV is optimized for Applicant Tracking Systems, ensuring your application gets past automated filters.",
              gradient: "from-sky-500 to-cyan-500",
            },
            {
              icon: FiClock,
              title: "Lightning Fast",
              desc: "Generate a professional, tailored CV in under 30 seconds. No more hours of tweaking for each application.",
              gradient: "from-purple-500 to-pink-500",
            },
          ].map((feature, i) => (
            <Card key={i} className="group acv-feature-card">
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 acv-feature-icon" />
              </div>
              <h3 className="text-xl font-semibold acv-heading mb-3">
                {feature.title}
              </h3>
              <p className="acv-feature-desc leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 border-t acv-section-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold acv-heading mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl acv-hero-description max-w-2xl mx-auto">
            Three simple steps to your perfect CV
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              step: 1,
              title: "Paste Job Description",
              desc: "Add the job URL or paste the description. Our AI analyzes the requirements.",
              color: "indigo",
            },
            {
              step: 2,
              title: "Add Your Profile",
              desc: "Upload your CV or paste your experience. PDF and Markdown supported.",
              color: "sky",
            },
            {
              step: 3,
              title: "Get Your CV",
              desc: "Receive a tailored CV optimized for the job. Download as PDF instantly.",
              color: "purple",
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 border-2 border-${item.color}-500 flex items-center justify-center text-2xl font-bold acv-step-badge mb-6 shadow-lg shadow-${item.color}-500/25`}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold acv-heading mb-3">
                  {item.title}
                </h3>
                <p className="acv-feature-desc">{item.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 acv-section-border"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 border-t acv-section-border">
        <Card className="text-center max-w-4xl mx-auto acv-cta-card">
          <div className="py-12 px-6 sm:px-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-6">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold acv-heading mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg acv-cta-subtitle mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers using OptimalCV. Generate your
              perfect CV now—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a
                href="#/generator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                <FiPlay className="w-5 h-5" />
                Generate CV Now
              </a>
              <a href="#/api" className="acv-btn-secondary">
                <FiCode className="w-5 h-5" />
                View API
              </a>
            </div>
            <p className="text-sm acv-feature-desc mt-6">
              No credit card • No sign-up • 100% Free
            </p>
          </div>
        </Card>
      </section>
    </>
  );
});

Home.displayName = "Home";

export default Home;
