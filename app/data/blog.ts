export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  body: Array<{
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
    /** Monospace block — use only for actual commands or config snippets. */
    code?: string;
    /** Label + detail pairs (VLAN maps, DNS pairs) — renders as a readable panel, not a code block. */
    referenceList?: Array<{ label: string; detail: string }>;
    /** Cadena gateway lineup — tier label, store link, guidance (UniFi / product posts). */
    gatewayTiers?: Array<{
      tier: string;
      product: string;
      href: string;
      detail: string;
    }>;
  }>;
};

export const posts: BlogPost[] = [
  {
    slug: "getting-started-with-unifi",
    title: "Getting Started with UniFi",
    excerpt:
      "From a walk-through of your space to the first clean roaming handoff — how we plan a UniFi stack that still makes sense a year later.",
    category: "UniFi Setup Guides",
    date: "2026-02-15",
    body: [
      {
        heading: "When the ISP router stops being enough",
        paragraphs: [
          "Retail and ISP gear is built for the lowest common denominator: a handful of devices, minimal logging, and firmware that lags behind real threats. The moment you add POS terminals, inventory scanners, VoIP, and a few remote workers, that box becomes the bottleneck — and the blind spot.",
          "UniFi is the stack we reach for on small-business jobs in and around London because it stays coherent: one controller UI, predictable PoE budgets, and access points that hand off cleanly when someone walks from the front desk to the stockroom with a tablet.",
        ],
      },
      {
        heading: "Plan before the shopping cart",
        paragraphs: [
          "We start every deployment with a quick physical survey: ceiling height, drywall vs. brick, where Ethernet can actually land, and where staff linger (those spots deserve APs, not whatever shelf is convenient). That drives switch port counts, PoE class, and whether you need a rack-mounted gateway or something compact behind the counter.",
        ],
        bullets: [
          "Gateway: match throughput, rack space, and whether you need high availability before you fall in love with a form factor — our default UniFi gateway tiers are spelled out in the next section.",
          "Switching: count powered devices (APs, phones, cameras) and leave headroom — undervoltage from an overstuffed PoE budget shows up as random WiFi drops.",
          "WiFi: fewer, better-placed APs beat a sprawl of weak ones; use 5 GHz for density, 2.4 GHz only where range truly wins.",
        ],
      },
      {
        heading: "Gateway tiers we spec at Cadena Labs",
        paragraphs: [
          "Ubiquiti’s lineup runs from compact cloud gateways to full-depth rack appliances. These are the rungs we actually quote for Ontario SMBs — with straight talk on what belongs in a wiring closet versus what is really living-room gear.",
        ],
        gatewayTiers: [
          {
            tier: "Starter",
            product: "UniFi Cloud Gateway Max (UCG-Max)",
            href: "https://ca.store.ui.com/ca/en/category/cloud-gateways-compact/collections/cloud-gateway-max/products/ucg-max-ns",
            detail:
              "Super basic and tuned like home gear. We do not recommend it for business workloads — fine for a lab bench, not for payroll WiFi.",
          },
          {
            tier: "Prosumer",
            product: "UniFi Cloud Gateway Fiber (UCG-Fiber)",
            href: "https://ca.store.ui.com/ca/en/category/cloud-gateways-compact/collections/cloud-gateway-fiber/products/ucg-fiber",
            detail:
              "A real step up from the Max: more headroom and fiber WAN options for shops that have outgrown ISP all-in-one boxes but are not ready to commit rack space yet.",
          },
          {
            tier: "Business Basic",
            product: "UniFi Dream Machine Pro Max (UDM Pro Max)",
            href: "https://ca.store.ui.com/ca/en/category/cloud-gateways-large-scale/products/udm-pro-max",
            detail:
              "Our standard SMB recommendation — a serious jump in network and security capacity with room to grow. Supports high-availability pairing when uptime is part of the brief.",
          },
          {
            tier: "Business Pro",
            product: "UniFi Dream Machine Beast (UDM Beast)",
            href: "https://ca.store.ui.com/ca/en/category/cloud-gateways-large-scale/products/udm-beast",
            detail:
              "The heavy lifter: maximum throughput and future headroom, HA-capable, and frankly more muscle than most small and medium offices will tap. Think large school or campus edge — not the default we spec for a typical ten-to-fifty seat site.",
          },
        ],
      },
      {
        heading: "Example segmentation we use often",
        paragraphs: [
          "You do not need a dozen VLANs on day one. We reuse the same ID map on most jobs so firewall rules and runbooks transfer between sites: management on 1, staff on 10, noisy gear on 20 and 30, and guest traffic parked on 250 so it never collides with numbered office VLANs.",
        ],
        referenceList: [
          {
            label: "VLAN 1",
            detail:
              "Management — switches, APs, gateway; keep user laptops and phones off this VLAN where you can.",
          },
          {
            label: "VLAN 10",
            detail:
              "Trusted clients — domain-joined machines, internal apps, file shares, VoIP you fully manage.",
          },
          {
            label: "VLAN 20",
            detail:
              "Printers & IoT — departmental printers, scanners, badge readers, smart TVs; patch on a different cadence than VLAN 10.",
          },
          {
            label: "VLAN 30",
            detail:
              "Cameras & NVR — recorders and cameras; clients on VLAN 10 reach the NVR only on the ports you name.",
          },
          {
            label: "VLAN 250",
            detail:
              "Guests — visitor and BYOD WiFi; internet out only, no SMB and no hairpin into trusted clients.",
          },
        ],
      },
      {
        heading: "Cutover without the Monday-morning fire drill",
        paragraphs: [
          "Before you call it done, walk the floor with a laptop: RSSI in the corners you care about, a few speed tests on both bands, and a quick VLAN check (guest SSID should not ping a corporate printer). Export a settings backup from the controller and stash it somewhere off-site. The first time you need it, you will be glad it is already there.",
        ],
      },
    ],
  },
  {
    slug: "network-security-tips-for-smbs",
    title: "Five security moves that actually fit a small office",
    excerpt:
      "No buzzwords — just the handful of changes that buy the most resilience when you do not have a full-time security team.",
    category: "Cybersecurity",
    date: "2026-02-01",
    body: [
      {
        heading: "Attackers love boring networks",
        paragraphs: [
          "Most incidents we see in the 10–50 seat range are not Hollywood zero-days. They are stale firmware, flat networks, and DNS lookups to domains a filter would have blocked. The good news: the fixes are equally unglamorous — and they work.",
        ],
      },
      {
        heading: "1. Segment like you mean it",
        paragraphs: [
          'Put payroll, guests, and the warehouse handheld scanner on different VLANs. Default-deny between them at the gateway, then add allow rules only for what you can name (for example, print server 443 from corporate only). If a rule reads "any to any," sleep on it and rewrite tighter.',
        ],
      },
      {
        heading: "2. Let patches ship themselves",
        paragraphs: [
          'Turn on automatic updates for your UniFi gear, workstations, and anything else that touches the internet weekly. Schedule a short maintenance window if you must, but never let "we will get to it" become a year of CVEs.',
        ],
      },
      {
        heading: "3. Start with safer DNS",
        paragraphs: [
          "Malware still phones home through DNS. The durable answer is a managed resolver you control policy on — Cloudflare Zero Trust Gateway, Cisco Umbrella, or another provider your MSP already runs — so blocks, allowlists, and logging follow the business, not a consumer preset. Until that is in place, you can still beat ISP DNS: on UniFi, set WAN DNS on the internet source or push DNS per network, and keep primary/secondary aligned so troubleshooting stays sane.",
        ],
        referenceList: [
          {
            label: "Primary",
            detail:
              "9.9.9.9 — Quad9 security-filtered DNS (blocklist-backed; common interim step before full Gateway/Umbrella).",
          },
          {
            label: "Secondary",
            detail:
              "149.112.112.112 — Quad9 secondary for redundancy; pair both with a roadmap to managed DNS for policy and audit trails.",
          },
        ],
      },
      {
        heading: "4. WiFi passwords are not access control",
        paragraphs: [
          "WPA3-Personal (or WPA2 at minimum) for a guest-style SSID is fine. For staff laptops that touch real data, plan toward WPA2/3-Enterprise with per-user credentials when the org is ready — shared PSKs rotate badly and leak across departing employees.",
        ],
      },
      {
        heading: "5. Log what you would want in a postmortem",
        paragraphs: [
          'Enable firewall logging to a sane retention, wire up email or Slack alerts for new DHCP devices on trusted VLANs, and skim the UniFi insights view once a week for ten minutes. You are not building a SOC — you are making sure the first sign of trouble is not a customer calling to say the card reader is "acting weird."',
        ],
      },
    ],
  },
  {
    slug: "why-your-business-needs-vlans",
    title: "VLANs: the smallest change that fixes the biggest mess",
    excerpt:
      "Flat networks feel simpler until one rogue device or guest laptop becomes a bridge to everything else. Here is how we split them without turning your firewall into a novel.",
    category: "Networking",
    date: "2026-01-20",
    body: [
      {
        heading: "What a VLAN buys you",
        paragraphs: [
          "A VLAN is a broadcast domain: devices think they share a wire, but the switch tags their frames so they only talk to their group unless a router explicitly permits more. That is the lever you use to keep a compromised camera from ARP-scanning your accounting share — without buying a second physical network.",
        ],
      },
      {
        heading: "Why flat LANs age badly",
        paragraphs: [
          "Single-subnet offices are fine on day one. They rot quietly: someone adds a smart TV, a contractor plugs in a test rig, a vendor puts a controller on DHCP. Suddenly every discovery protocol and multicast storm is everyone's problem.",
        ],
        bullets: [
          "Lateral movement gets easy — one foothold can see neighbors you forgot were on the wire.",
          "Troubleshooting gets noisy — is the VoIP glitch RF, switch, or a chatty IoT gadget? Segmentation narrows the blast radius.",
        ],
      },
      {
        heading: "A starter map you can copy",
        paragraphs: [
          "We keep the same numbering across deployments (including our UniFi guide) so playbooks line up: 1 for management, 10 for trusted clients, 20 and 30 for printers/IoT and cameras, 250 for guests. Adjust only if you already burn an ID elsewhere — the important part is consistent tagging from switch port → SSID → firewall zone.",
        ],
        referenceList: [
          {
            label: "VLAN 1",
            detail:
              "Management — switches, APs, gateway; keep user laptops and phones off this VLAN where you can.",
          },
          {
            label: "VLAN 10",
            detail:
              "Trusted clients — domain-joined machines, internal apps, file shares, VoIP you fully manage.",
          },
          {
            label: "VLAN 20",
            detail:
              "Printers & IoT — departmental printers, scanners, badge readers, smart TVs; patch on a different cadence than VLAN 10.",
          },
          {
            label: "VLAN 30",
            detail:
              "Cameras & NVR — recorders and cameras; clients on VLAN 10 reach the NVR only on the ports you name.",
          },
          {
            label: "VLAN 250",
            detail:
              "Guests — visitor and BYOD WiFi; internet out only, no SMB and no hairpin into trusted clients.",
          },
        ],
      },
      {
        heading: "Firewall posture in one sentence",
        paragraphs: [
          "Start inter-VLAN with a deny-all, then punch holes for named services on named ports — VLAN 30 should reach VLAN 10 only on the ports you can name (not subnet-wide), and VLAN 250 should have no path into VLAN 10 unless you have a rare, documented exception. If the rule list reads like plain English under stress at 9 p.m., you have done it right.",
        ],
      },
    ],
  },
];

export function getPost(slug: string | undefined) {
  return posts.find((post) => post.slug === slug);
}
