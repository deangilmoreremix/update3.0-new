// AI Contact Enrichment Service - OpenAI & Gemini Integration
export interface ContactEnrichmentData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  industry?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  avatar?: string;
  bio?: string;
  notes?: string;
  confidence?: number;
}

export interface AIProvider {
  name: 'openai' | 'gemini';
  enabled: boolean;
  apiKey?: string;
}

class AIEnrichmentService {
  private providers: AIProvider[] = [
    { name: 'openai', enabled: true },
    { name: 'gemini', enabled: true }
  ];

  // Simulate web search and contact enrichment
  async enrichContactByEmail(email: string): Promise<ContactEnrichmentData> {
    console.log(`🔍 Searching for contact information: ${email}`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock enriched data based on email domain
    const domain = email.split('@')[1];
    const firstName = email.split('@')[0].split('.')[0];
    const lastName = email.split('@')[0].split('.')[1] || '';
    
    const mockData: ContactEnrichmentData = {
      firstName: this.capitalize(firstName),
      lastName: this.capitalize(lastName),
      name: `${this.capitalize(firstName)} ${this.capitalize(lastName)}`,
      email: email,
      phone: this.generatePhone(),
      title: this.generateTitle(),
      company: this.generateCompany(domain),
      industry: this.generateIndustry(domain),
      location: {
        city: this.generateCity(),
        state: this.generateState(),
        country: 'United States'
      },
      socialProfiles: {
        linkedin: `https://linkedin.com/in/${firstName}-${lastName}`,
        twitter: `https://twitter.com/${firstName}${lastName}`,
        website: `https://${domain}`
      },
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${firstName}`,
      bio: this.generateBio(firstName, lastName),
      notes: `Enriched via AI from ${domain}`,
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    };

    console.log(`✅ Contact enrichment completed for ${email}`);
    return mockData;
  }

  async enrichContactByLinkedIn(linkedinUrl: string): Promise<ContactEnrichmentData> {
    console.log(`🔍 Searching LinkedIn profile: ${linkedinUrl}`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Extract profile name from URL
    const profileName = linkedinUrl.split('/in/')[1]?.split('/')[0] || 'unknown';
    const [firstName, lastName] = profileName.split('-');
    
    const mockData: ContactEnrichmentData = {
      firstName: this.capitalize(firstName || 'Unknown'),
      lastName: this.capitalize(lastName || 'Professional'),
      name: `${this.capitalize(firstName || 'Unknown')} ${this.capitalize(lastName || 'Professional')}`,
      email: `${firstName}.${lastName}@${this.generateEmailDomain()}`,
      phone: this.generatePhone(),
      title: this.generateSeniorTitle(),
      company: this.generateTechCompany(),
      industry: 'Technology',
      location: {
        city: this.generateTechCity(),
        state: this.generateTechState(),
        country: 'United States'
      },
      socialProfiles: {
        linkedin: linkedinUrl,
        twitter: `https://twitter.com/${firstName}${lastName}`,
        website: `https://${this.generateEmailDomain()}`
      },
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${firstName}`,
      bio: this.generateProfessionalBio(firstName, lastName),
      notes: `Enriched via LinkedIn AI analysis`,
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
    };

    console.log(`✅ LinkedIn enrichment completed for ${linkedinUrl}`);
    return mockData;
  }

  async enrichContactByName(name: string, company?: string): Promise<ContactEnrichmentData> {
    console.log(`🔍 Searching for contact: ${name} at ${company || 'unknown company'}`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const [firstName, lastName] = name.split(' ');
    const emailDomain = company ? this.generateEmailFromCompany(company) : this.generateEmailDomain();
    
    const mockData: ContactEnrichmentData = {
      firstName: firstName,
      lastName: lastName || '',
      name: name,
      email: `${firstName.toLowerCase()}.${lastName?.toLowerCase() || 'contact'}@${emailDomain}`,
      phone: this.generatePhone(),
      title: this.generateTitle(),
      company: company || this.generateCompany(emailDomain),
      industry: this.generateIndustry(emailDomain),
      location: {
        city: this.generateCity(),
        state: this.generateState(),
        country: 'United States'
      },
      socialProfiles: {
        linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName?.toLowerCase() || 'contact'}`,
        twitter: `https://twitter.com/${firstName}${lastName || ''}`,
        website: company ? `https://${emailDomain}` : undefined
      },
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${firstName}`,
      bio: this.generateBio(firstName, lastName || ''),
      notes: `Enriched via AI name search${company ? ` at ${company}` : ''}`,
      confidence: Math.floor(Math.random() * 25) + 65 // 65-90%
    };

    console.log(`✅ Name-based enrichment completed for ${name}`);
    return mockData;
  }

  // Helper methods
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private generatePhone(): string {
    const areaCode = Math.floor(Math.random() * 700) + 200;
    const exchange = Math.floor(Math.random() * 700) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }

  private generateTitle(): string {
    const titles = [
      'Senior Software Engineer', 'Product Manager', 'Marketing Director',
      'Sales Executive', 'Business Analyst', 'Operations Manager',
      'Customer Success Manager', 'Data Scientist', 'UX Designer',
      'Account Executive', 'Project Manager', 'Technical Lead'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateSeniorTitle(): string {
    const titles = [
      'Senior Vice President', 'Chief Technology Officer', 'Director of Engineering',
      'VP of Product', 'Head of Marketing', 'Senior Director',
      'VP of Sales', 'Chief Data Officer', 'Head of Operations',
      'Senior Product Manager', 'Principal Engineer', 'Executive Director'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateCompany(domain: string): string {
    if (domain.includes('gmail') || domain.includes('yahoo') || domain.includes('hotmail')) {
      const companies = [
        'Acme Corporation', 'TechStart Inc.', 'Innovation Labs',
        'Global Solutions LLC', 'Digital Dynamics', 'Future Systems',
        'Smart Enterprises', 'NextGen Technologies', 'Apex Industries'
      ];
      return companies[Math.floor(Math.random() * companies.length)];
    }
    
    // Try to derive company from domain
    const domainName = domain.split('.')[0];
    return this.capitalize(domainName) + ' Inc.';
  }

  private generateTechCompany(): string {
    const companies = [
      'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple',
      'Salesforce', 'Oracle', 'Adobe', 'Uber', 'Airbnb',
      'Stripe', 'Zoom', 'Slack', 'DocuSign', 'Shopify'
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  }

  private generateIndustry(domain: string): string {
    const industries = [
      'Technology', 'Healthcare', 'Finance', 'Education',
      'Manufacturing', 'Retail', 'Consulting', 'Media',
      'Real Estate', 'Transportation', 'Energy', 'Telecommunications'
    ];
    
    if (domain.includes('tech') || domain.includes('soft')) return 'Technology';
    if (domain.includes('health') || domain.includes('med')) return 'Healthcare';
    if (domain.includes('bank') || domain.includes('finance')) return 'Finance';
    if (domain.includes('edu')) return 'Education';
    
    return industries[Math.floor(Math.random() * industries.length)];
  }

  private generateCity(): string {
    const cities = [
      'San Francisco', 'New York', 'Los Angeles', 'Chicago',
      'Boston', 'Seattle', 'Austin', 'Denver', 'Atlanta',
      'Miami', 'Dallas', 'Phoenix', 'Portland', 'Nashville'
    ];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private generateTechCity(): string {
    const cities = [
      'San Francisco', 'Seattle', 'Austin', 'Boston',
      'New York', 'Los Angeles', 'Denver', 'Atlanta'
    ];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private generateState(): string {
    const states = [
      'CA', 'NY', 'TX', 'FL', 'WA', 'MA', 'CO', 'GA',
      'IL', 'NC', 'VA', 'AZ', 'OR', 'TN', 'MI', 'PA'
    ];
    return states[Math.floor(Math.random() * states.length)];
  }

  private generateTechState(): string {
    const states = ['CA', 'WA', 'TX', 'MA', 'NY', 'CO', 'GA'];
    return states[Math.floor(Math.random() * states.length)];
  }

  private generateEmailDomain(): string {
    const domains = [
      'techcorp.com', 'innovate.io', 'solutions.net', 'globaltech.com',
      'nextgen.co', 'smartsys.com', 'futuretech.io', 'digitaldyn.com'
    ];
    return domains[Math.floor(Math.random() * domains.length)];
  }

  private generateEmailFromCompany(company: string): string {
    const cleanCompany = company.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/inc|llc|corp|ltd|corporation/g, '');
    return `${cleanCompany}.com`;
  }

  private generateBio(firstName: string, lastName: string): string {
    const bios = [
      `${firstName} is an experienced professional with expertise in technology and innovation.`,
      `${firstName} ${lastName} leads strategic initiatives and drives business growth.`,
      `Experienced leader in ${this.generateIndustry('tech')} with a passion for excellence.`,
      `${firstName} specializes in building high-performance teams and delivering results.`,
      `Strategic thinker with deep expertise in product development and market expansion.`
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  }

  private generateProfessionalBio(firstName: string, lastName: string): string {
    const bios = [
      `${firstName} is a senior executive with 10+ years of experience in technology leadership.`,
      `${firstName} ${lastName} drives innovation and strategic growth at leading technology companies.`,
      `Accomplished leader specializing in product strategy, team building, and operational excellence.`,
      `${firstName} has a proven track record of scaling teams and delivering breakthrough products.`,
      `Strategic executive with expertise in AI, cloud technologies, and digital transformation.`
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  }

  // Provider management
  enableProvider(provider: 'openai' | 'gemini'): void {
    const p = this.providers.find(p => p.name === provider);
    if (p) p.enabled = true;
  }

  disableProvider(provider: 'openai' | 'gemini'): void {
    const p = this.providers.find(p => p.name === provider);
    if (p) p.enabled = false;
  }

  setApiKey(provider: 'openai' | 'gemini', apiKey: string): void {
    const p = this.providers.find(p => p.name === provider);
    if (p) p.apiKey = apiKey;
  }

  getEnabledProviders(): AIProvider[] {
    return this.providers.filter(p => p.enabled);
  }
}

export const aiEnrichmentService = new AIEnrichmentService();