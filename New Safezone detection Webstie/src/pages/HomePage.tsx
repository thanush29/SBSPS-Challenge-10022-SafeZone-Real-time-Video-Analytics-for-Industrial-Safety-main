import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Video, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play,
  Eye,
  Zap
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'PPE Detection',
      description: 'Advanced detection of protective helmets, gloves, jackets, masks, and safety boots using YOLOv8.',
      color: 'text-blue-600'
    },
    {
      icon: Eye,
      title: 'Real-time Monitoring',
      description: 'Live video feed analysis with instant alerts for safety violations and compliance issues.',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Immediate notifications when workers are not wearing required safety equipment.',
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive safety metrics and compliance tracking for better decision making.',
      color: 'text-purple-600'
    }
  ];

  const detectionClasses = [
    { name: 'Protective Helmet', color: 'bg-blue-100 text-blue-800' },
    { name: 'Safety Jacket', color: 'bg-green-100 text-green-800' },
    { name: 'Protective Gloves', color: 'bg-purple-100 text-purple-800' },
    { name: 'Dust Mask', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Eye Wear', color: 'bg-red-100 text-red-800' },
    { name: 'Safety Boots', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Shield', color: 'bg-pink-100 text-pink-800' }
  ];

  const stats = [
    { label: 'Detection Accuracy', value: '95%', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Real-time Processing', value: '30 FPS', icon: Video, color: 'text-blue-600' },
    { label: 'Safety Classes', value: '7', icon: Shield, color: 'text-purple-600' },
    { label: 'Response Time', value: '<100ms', icon: Zap, color: 'text-yellow-600' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                SafeZone
                <span className="block text-2xl lg:text-3xl font-normal text-primary-200 mt-2">
                  Industrial Safety Monitoring
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Advanced real-time video analytics powered by YOLOv8 for detecting Personal Protective Equipment (PPE) 
                and ensuring workplace safety compliance in industrial environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/video"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Start Video Detection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/webcam"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition-colors duration-200 group"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Live Webcam
                  <Play className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-primary-200">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Advanced Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging cutting-edge AI technology to create safer industrial environments through 
              real-time monitoring and intelligent detection systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detection Classes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              PPE Detection Classes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our YOLOv8 model is trained to detect 7 different types of Personal Protective Equipment 
              with high accuracy and real-time performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {detectionClasses.map((item, index) => (
              <div key={index} className="text-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${item.color}`}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <p className="text-gray-600"><strong>Video Input:</strong> Live camera feed or uploaded video file is processed in real-time.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <p className="text-gray-600"><strong>AI Detection:</strong> YOLOv8 model analyzes each frame to identify PPE items with confidence scores.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <p className="text-gray-600"><strong>Safety Alert:</strong> Instant notifications when required safety equipment is missing or improperly worn.</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <AlertTriangle className="h-12 w-12" />
                </div>
                <p className="text-sm text-gray-500">Real-time Safety Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Enhance Workplace Safety?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start monitoring your industrial environment with our advanced AI-powered safety detection system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/video"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Video className="mr-2 h-5 w-5" />
              Upload Video
            </Link>
            <Link
              to="/webcam"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              <Camera className="mr-2 h-5 w-5" />
              Live Detection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;