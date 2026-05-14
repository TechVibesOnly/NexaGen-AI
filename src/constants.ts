export type Industry = 'Agriculture' | 'Construction' | 'Legal' | 'Government';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  industry: Industry;
  features: string[];
  stats: { label: string; value: string; trend: 'up' | 'down' }[];
}

export interface IndustryData {
  title: Industry;
  name: string;
  icon: string;
  color: string;
  products: Product[];
}

export const INDUSTRIES: IndustryData[] = [
  {
    title: 'Agriculture',
    name: 'CropMind',
    icon: 'Wheat',
    color: '#D4AF37',
    products: [
      {
        id: 'cropmind',
        name: 'CropMind AI',
        tagline: 'Precision agronomy for the next decade.',
        description: 'Predictive soil analysis and yield optimization powered by multi-spectral satellite data.',
        industry: 'Agriculture',
        features: ['Satellite Yield Prediction', 'Soil Nutrient Mapping', 'Automated Irrigation Logic', 'Pest Risk Assessment'],
        stats: [
          { label: 'Avg Yield Increase', value: '24%', trend: 'up' },
          { label: 'Water Waste Reduction', value: '18%', trend: 'down' },
          { label: 'Active Acerage', value: '4.2M', trend: 'up' }
        ]
      }
    ]
  },
  {
    title: 'Construction',
    name: 'BuildIQ',
    icon: 'HardHat',
    color: '#D4AF37',
    products: [
      {
        id: 'buildiq',
        name: 'BuildIQ Pro',
        tagline: 'Connect every blueprint to reality.',
        description: 'Real-time computer vision for jobsite progress tracking and safety compliance.',
        industry: 'Construction',
        features: ['Automated Progress Tracking', 'Safety Violation Detection', 'BIM Synchronization', 'Supply Chain Forecasting'],
        stats: [
          { label: 'Project Speedup', value: '15%', trend: 'up' },
          { label: 'Safety Incidents', value: '40%', trend: 'down' },
          { label: 'Active Sites', value: '842', trend: 'up' }
        ]
      }
    ]
  },
  {
    title: 'Legal',
    name: 'LexCore',
    icon: 'Scale',
    color: '#D4AF37',
    products: [
      {
        id: 'lexcore',
        name: 'LexCore Enterprise',
        tagline: 'AI that thinks like a partner.',
        description: 'Advanced legal research and contract lifecycle management for global firms.',
        industry: 'Legal',
        features: ['Semantic Case Search', 'Automated Contract Redlining', 'Precedent Risk Scoring', 'Multi-jurisdictional Compliance'],
        stats: [
          { label: 'Research Time Saved', value: '70%', trend: 'up' },
          { label: 'Audit Compliance', value: '100%', trend: 'up' },
          { label: 'Documents Processed', value: '12M', trend: 'up' }
        ]
      }
    ]
  },
  {
    title: 'Government',
    name: 'GovPulse',
    icon: 'Landmark',
    color: '#D4AF37',
    products: [
      {
        id: 'govpulse',
        name: 'GovPulse Analytics',
        tagline: 'Data-driven governance for the modern citizen.',
        description: 'Public utility optimization and demographic sentiment analysis at scale.',
        industry: 'Government',
        features: ['Urban Mobility Planning', 'Public Health Forecasting', 'Economic Sentiment Engine', 'Infrastructure Life-cycle Management'],
        stats: [
          { label: 'Resource Efficiency', value: '32%', trend: 'up' },
          { label: 'Citizen Satisfaction', value: '88%', trend: 'up' },
          { label: 'Response Latency', value: '64%', trend: 'down' }
        ]
      }
    ]
  }
];
