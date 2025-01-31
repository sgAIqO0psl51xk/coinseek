import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface CompanyLogo {
  name: string
  logoUrl: string
  alt: string
}

const previousCompanies: CompanyLogo[] = [
  { name: 'Google', logoUrl: '/logos/google.svg', alt: 'Google logo' },
  { name: 'Meta', logoUrl: '/logos/meta.svg', alt: 'Meta logo' },
  { name: 'Amazon', logoUrl: '/logos/amazon.svg', alt: 'Amazon logo' },
  // Add more companies as needed
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground text-lg">
            We're a team of passionate developers and designers building the next generation
            of digital experiences.
          </p>

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold">Our Expertise</h2>
            <ul className="space-y-2 list-none pl-0">
              {[
                'Full-stack Development',
                'Cloud Architecture',
                'AI/ML Integration',
                'Mobile-first Design',
                'Enterprise Solutions'
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">•</Badge>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Team Background</h2>
            <p className="text-muted-foreground mb-6">
              Our team brings experience from leading tech companies:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {previousCompanies.map((company) => (
                <div 
                  key={company.name} 
                  className="relative h-12 bg-secondary/10 rounded-lg p-2 flex items-center justify-center"
                >
                  <Image
                    src={company.logoUrl}
                    alt={company.alt}
                    width={120}
                    height={40}
                    className="object-contain filter brightness-90"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
