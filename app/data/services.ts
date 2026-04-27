export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cardDescription: string;
  features: string[];
  bestFor: string[];
  outcomes: string[];
  premium?: {
    heading: string;
    description: string;
    features: string[];
  };
  ctaHeading: string;
  ctaDescription: string;
  ctaLabel: string;
};

export const services: Service[] = [
  {
    slug: "networking",
    name: "Networking",
    tagline: "Office WiFi, UniFi deployments, and network upgrades",
    description:
      "Cadena Labs designs, deploys, and supports reliable small-business networks across London, Ontario. From office WiFi upgrades and UniFi rollouts to VLAN segmentation and proactive monitoring, engagements focus on networks teams can count on every day.",
    cardDescription:
      "Fix unreliable coverage, modernize aging network gear, and build segmented UniFi environments your team can rely on.",
    features: [
      "Office network architecture design and implementation planning",
      "Ubiquiti UniFi gateway, switching, and access point deployment",
      "WiFi site surveys, coverage troubleshooting, and performance tuning",
      "Guest, staff, printer, camera, and IoT VLAN segmentation",
      "Firewall rules and traffic-policy cleanup for safer network access",
      "Multi-site connectivity and network standardization",
      "Network monitoring, alerting, and visibility improvements",
      "Structured cabling coordination and rack layout support",
    ],
    bestFor: [
      "Offices with unreliable WiFi, dropped calls, or dead zones",
      "Teams upgrading to UniFi or replacing aging network equipment",
      "Businesses that need VLANs for guests, printers, cameras, or staff devices",
    ],
    outcomes: [
      "Stronger WiFi coverage and fewer day-to-day connectivity issues",
      "Cleaner segmentation between trusted devices, guests, and operational systems",
      "A UniFi setup that is easier to manage, monitor, and expand",
    ],
    premium: {
      heading: "Palo Alto Networks",
      description:
        "Cadena Labs brings extensive experience with Palo Alto Networks enterprise firewalls. Palo Alto engagements are scoped and quoted on a case-by-case basis at a premium rate.",
      features: [
        "Palo Alto firewall configuration and management",
        "Advanced threat prevention and security policy design",
        "Panorama centralized management",
        "SD-WAN configuration and management",
        "User-ID via Cloud Identity Engine or on-prem LDAP",
      ],
    },
    ctaHeading: "Planning a UniFi rollout or office WiFi upgrade?",
    ctaDescription:
      "Send an inquiry; Cadena Labs will identify the bottleneck, the risk, or the next best upgrade for your office.",
    ctaLabel: "Send an inquiry",
  },
  {
    slug: "security",
    name: "Cybersecurity",
    tagline: "Firewalls, secure remote access, and security baselines",
    description:
      "Cadena Labs helps small businesses reduce network risk with practical security controls that match how their teams actually work. That includes firewall policy design, secure remote access, segmentation, DNS filtering, and hardening the access points attackers usually exploit first.",
    cardDescription:
      "Strengthen firewalling, secure remote access, and reduce risk with a practical baseline for small-business teams.",
    features: [
      "Firewall configuration and management",
      "Intrusion detection and prevention",
      "Security audits and vulnerability assessments",
      "Email security and phishing protection",
      "Endpoint protection deployment",
      "Secure remote access and VPN replacement planning",
      "DNS filtering and malicious-domain blocking",
      "Administrative access hardening and identity-aware controls",
      "Security awareness training",
    ],
    bestFor: [
      "Teams that need secure remote access without relying on ad hoc VPN setups",
      "Businesses running flat networks with little separation between users and systems",
      "Professional firms, clinics, and offices that want a stronger security baseline",
    ],
    outcomes: [
      "Safer remote access for staff and vendors",
      "Tighter control over who can reach sensitive systems",
      "A clearer, more maintainable security baseline for future growth",
    ],
    premium: {
      heading: "Zero Trust Network Access",
      description:
        "Traditional VPNs were not built for today's distributed workforce. Cadena Labs deploys and maintains Zero Trust Network Access solutions that verify every user and device before granting access.",
      features: [
        "Zero Trust network architecture design and planning",
        "Tailscale deployment, configuration, and ACL management",
        "Twingate deployment and resource access policy configuration",
        "Identity-aware access policies and device posture checks",
        "Migration from legacy VPN to Zero Trust architecture",
      ],
    },
    ctaHeading: "Need a clearer picture of your network risk?",
    ctaDescription:
      "Send an inquiry; Cadena Labs will look at your current access setup, identify the biggest exposure, and recommend the next best security step.",
    ctaLabel: "Send an inquiry",
  },
  {
    slug: "infrastructure",
    name: "Infrastructure & Procurement",
    tagline: "Infrastructure planning, hardware procurement, and deployment",
    description:
      "From hardware selection and office setup to backup strategy, workstation rollouts, and server or cloud planning, Cadena Labs helps small businesses make practical infrastructure decisions without overbuying or overcomplicating the environment.",
    cardDescription:
      "Plan the right hardware, backups, and rollout work for a dependable office environment without enterprise bloat.",
    features: [
      "Vendor-neutral hardware planning and procurement guidance",
      "Physical server deployment and rack installation",
      "Virtual machine provisioning with VMware, Hyper-V, or Proxmox",
      "Cloud migration planning and execution",
      "Backup and disaster recovery strategy",
      "Storage architecture and NAS/SAN setup",
      "Identity, directory, and access-management support",
      "Workstation and laptop rollout planning",
      "Hardware lifecycle planning and replacement guidance",
    ],
    bestFor: [
      "Businesses opening, relocating, or upgrading an office",
      "Teams refreshing aging hardware or planning a workstation rollout",
      "Owners who want practical procurement and backup guidance before spending",
    ],
    outcomes: [
      "Right-sized purchasing decisions backed by technical guidance",
      "Smoother office upgrades, launches, and refresh cycles",
      "More reliable backups, devices, and core infrastructure",
    ],
    ctaHeading: "Planning an office upgrade or infrastructure refresh?",
    ctaDescription:
      "Send an inquiry to talk through your current setup, the constraints, and the most practical next move.",
    ctaLabel: "Send an inquiry",
  },
  {
    slug: "modernization",
    name: "Digital Modernization",
    tagline:
      "Custom websites, booking and billing tools, and internal software",
    description:
      "Cadena Labs builds custom websites, booking and billing flows, and internal tools on modern web frameworks for teams outgrowing WordPress, Squarespace, and Wix. Each engagement starts by defining the right solution instead of forcing a template, and AI-augmented tooling keeps delivery fast without cutting corners.",
    cardDescription:
      "Move past WordPress, Squarespace, and Wix templates with custom websites, booking flows, and back-office tools designed around how your team actually works.",
    features: [
      "Custom marketing websites with modern performance and SEO",
      "Branded booking, scheduling, and reservation systems",
      "Customer-facing inventory and product catalogs",
      "Invoicing, billing, and subscription flows with Stripe or Square",
      "Internal admin tools, dashboards, and order management",
      "Migration from Wix, Squarespace, or aging WordPress sites",
      "Hosting, monitoring, and ongoing maintenance retainers",
      "Performance, accessibility, and SEO tuning",
      "Domain, DNS, and email-deliverability setup",
    ],
    bestFor: [
      "Small businesses outgrowing WordPress, Squarespace, Wix, or similar template platforms",
      "Owners who want booking, billing, or inventory tailored to how they actually operate",
      "Teams that need internal admin tools without the cost of an in-house dev team",
    ],
    outcomes: [
      "A polished, fast website that reflects the business and ranks well",
      "Custom workflows for booking, billing, or inventory that match real operations",
      "Internal tools that remove daily friction for staff",
    ],
    premium: {
      heading: "AI-Powered Features",
      description:
        "For clients who want their app to do more than serve pages, Cadena Labs builds AI features directly into custom software. AI engagements are scoped and quoted on a case-by-case basis at a premium rate.",
      features: [
        "Conversational booking and customer-support agents",
        "Smart search and recommendations across catalogs and content",
        "Document processing, intake forms, and OCR-driven workflows",
        "LLM-powered staff assistants embedded in internal tools",
        "Custom integrations with current-generation foundation models",
      ],
    },
    ctaHeading: "Outgrowing your current website or off-the-shelf software?",
    ctaDescription:
      "Send an inquiry; Cadena Labs will look at the system you have today and recommend the most practical next step toward custom software that fits your business.",
    ctaLabel: "Send an inquiry",
  },
];

export function getService(slug: string | undefined) {
  return services.find((service) => service.slug === slug);
}
