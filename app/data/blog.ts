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
    slug: "password-managers-for-small-teams",
    title: "Password managers for teams that outgrew the spreadsheet",
    excerpt:
      "Reused logins and shared admin passwords cause more real incidents than missing appliances. Here is how a business password manager fits a 5–50 seat office, and why we standardize on 1Password.",
    category: "Cybersecurity",
    date: "2026-06-01",
    body: [
      {
        heading: "The breach that starts in the notes app",
        paragraphs: [
          "Most small offices do not lose data because they skipped a six-figure firewall. They lose it because the same password opened the vendor portal, the shared inbox, and the WiFi guest SSID someone documented in a group chat three years ago.",
          'Spreadsheets, browser-only saves, and "we will change it when someone leaves" do not scale past a handful of people. The moment you hire admin staff, bookkeepers, or seasonal help, credential chaos becomes the default — and attackers know how to search for it.',
        ],
      },
      {
        heading: "What a business password manager actually does",
        paragraphs: [
          "A consumer save-in-the-browser habit is not the same product. Business password managers give you shared vaults with real permissions, an audit trail of who accessed what, and a single offboarding workflow when someone departs.",
        ],
        bullets: [
          "Unique passwords per site — generated credentials so a leak at one vendor does not become a skeleton key for your email or bank portal.",
          "Role-based sharing — finance sees finance vaults, operations sees operations, without everyone inheriting the domain admin password.",
          'Faster onboarding — new hires receive vault access instead of a forwarded email chain labeled "passwords FINAL v7."',
          "Cleaner exits — disable one account and rotate shared secrets instead of guessing which systems still have the old GM's login.",
          "Room for MFA — store TOTP seeds and recovery codes where they are backed up, not on a sticky note under the keyboard.",
        ],
      },
      {
        heading: "Why we recommend 1Password for Ontario SMBs",
        paragraphs: [
          '1Password is a Canadian company with a business tier built for teams, not just families. For London-area clients that want strong credential hygiene without running their own secrets server, it hits the sweet spot: polished apps, sensible admin controls, and vault structure that matches how offices actually organize work (by department, by vendor, by "break glass" admin).',
          'Cadena Labs helps offices roll out 1Password with a deliberate map: which vaults exist, who owns them, what must never be shared as a single "office" login, and how break-glass domain or firewall credentials stay limited to people who need them. The goal is not another subscription box to tick — it is making password rotation and access reviews something you can do on a Tuesday afternoon instead of a fire drill.',
          "Other managers exist; the pattern is what matters. Pick one platform, ban shared sticky-note credentials for new systems, and enforce unique passwords on anything that touches money, email, or remote access.",
        ],
      },
      {
        heading: "Habits that fail vs. what we configure",
        paragraphs: [
          "Use this panel when you are deciding whether to keep limping along with browser autofill only.",
        ],
        referenceList: [
          {
            label: "Fails",
            detail:
              "One spreadsheet or chat thread holds vendor, banking, and admin passwords; departing staff may still have copies you never rotated.",
          },
          {
            label: "Works",
            detail:
              "Each person has their own vault login; shared items live in named vaults with explicit membership and logging.",
          },
          {
            label: "Admin creds",
            detail:
              "Domain, firewall, and ISP portal passwords sit in a small break-glass vault with two trusted owners, not in everyone's personal notes.",
          },
          {
            label: "Offboarding",
            detail:
              "Disable the user's manager account first, then rotate shared secrets they could reach — same day, documented in the ticket.",
          },
        ],
      },
      {
        heading: "Rollout without stopping the business",
        paragraphs: [
          "Start with leadership and anyone who holds vendor or financial logins. Import or recreate the top twenty accounts people actually use, not every dormant login from 2019. Turn on a strong account password and require MFA on the manager itself before you migrate the rest of the company.",
          "Train in one short session: how to save, how to share into a vault, and what never to paste into email. Pair this with the security basics you already run on the network — segmented VLANs, safer DNS, and modern remote access — so credentials are not the last weak link holding the door open.",
        ],
      },
    ],
  },
  {
    slug: "when-your-vpn-is-the-problem",
    title: "When your VPN is the problem",
    excerpt:
      "Shared VPN concentrators made sense once. For 5–50 seat teams with hybrid staff and segmented LANs, they often create more risk than they remove — and Zero Trust access is the practical fix.",
    category: "Cybersecurity",
    date: "2026-05-07",
    body: [
      {
        heading: "The VPN that used to feel like progress",
        paragraphs: [
          "For years, the playbook was simple: punch a hole in the firewall, stand up a VPN concentrator, and tell remote staff to connect before they open the file share or line-of-business app. It beat emailing credentials or leaving RDP wide open.",
          "The trouble is what changed around that VPN. More laptops off-site, more SaaS, more cameras and printers on the same flat LAN the VPN dumps people into. The concentrator still works — until it becomes the slowest, leakiest part of the week.",
        ],
      },
      {
        heading: "Why concentrator VPNs break down at 5–50 seats",
        paragraphs: [
          "Small and medium offices do not fail because they skipped a Fortune 500 appliance. They fail because the VPN model assumes remote users should join the whole internal network, the same way a PC plugged in at a desk would.",
        ],
        bullets: [
          "Blast radius — one stolen laptop session or shared contractor login can reach every subnet the VPN routes, not just the app someone needed.",
          'All-or-nothing access — granting "VPN" often means granting SMB, printers, management VLANs, and legacy servers because splitting tunnels and firewall rules got too hard to maintain.',
          "Operational drag — concentrators need patching, licensing, capacity planning, and after-hours babysitting when ISP or firmware issues coincide with month-end close.",
          "Identity lag — rotating a departing employee means updating AD, the VPN profile, and sometimes a shared PSK someone posted in a chat three years ago.",
        ],
      },
      {
        heading: "What clinics, agencies, and multi-site offices feel first",
        paragraphs: [
          "Professional firms and clinics notice it as compliance anxiety: remote access exists on paper, but nobody can explain which VLAN a home laptop touched last Tuesday. Agencies with a downtown office and a warehouse share one VPN profile until a vendor needs files and suddenly everyone is on the same tunnel.",
          "Multi-site teams feel it as performance and trust — staff VPN home through head office to reach a cloud app that was never on the LAN, or they disable the VPN to get work done and quietly bypass the policy you thought you had.",
        ],
      },
      {
        heading: "Zero Trust access in one paragraph",
        paragraphs: [
          "Zero Trust Network Access (ZTNA) flips the default: start from deny, verify the person and the device, then allow specific resources — a file server, an RDP session, an internal web app — without treating the remote laptop like it lives on VLAN 10. It pairs well with the segmentation we already recommend on UniFi gear; the VPN used to punch through that work, while ZTNA respects it.",
        ],
      },
      {
        heading: "Why we reach for Tailscale on Ontario SMB jobs",
        paragraphs: [
          'Tailscale is a Canadian company, built on WireGuard, with a control plane that stays out of your hair once identity and policy are set. For London-area offices that want dependable remote access without another box in the DMZ, it is often the fastest path from "everyone on the VPN" to named users reaching named services.',
          'Cadena Labs deploys Tailscale where the brief is practical: per-user sign-in through your existing identity provider where possible, device posture checks when you need them, and ACLs written in plain language so "finance can reach this share" does not also mean "finance can reach the camera VLAN." Mesh connectivity helps multi-site and home users without hair-pinning all traffic through a single concentrator.',
          "Tailscale is not the only serious option — Twingate and similar brokers fit when you want a vendor-hosted path to SaaS and private apps without running your own overlay. The pattern matters more than the logo: verify first, expose least, log what you would want in a review.",
        ],
      },
      {
        heading: "VPN habits vs. what we configure instead",
        paragraphs: [
          'Use this as a sanity check before you renew another year of concentrator licenses or open port 1194 because "it has always worked."',
        ],
        referenceList: [
          {
            label: "Old habit",
            detail:
              "Remote user connects to VPN → receives routes to broad internal subnets → uses the same flat paths as on-site staff.",
          },
          {
            label: "ZTNA habit",
            detail:
              "User signs in with identity → device is known → policy allows only named hosts, ports, or apps → everything else stays unreachable.",
          },
          {
            label: "Segmentation",
            detail:
              "Keep management, staff, printers, cameras, and guests on separate VLANs on site; remote access should not recreate a flat LAN in the tunnel.",
          },
          {
            label: "Logging",
            detail:
              'Record who reached which resource and when — you do not need a SOC, but you do need more than "VPN connected" in a generic firewall log.',
          },
        ],
      },
      {
        heading: "Migrating without a big-bang weekend",
        paragraphs: [
          "Move in phases. Stand up Tailscale (or your chosen ZTNA) beside the existing VPN, migrate one team or one application at a time, and keep the legacy concentrator read-only for rollback until ACLs are tested from real home networks. Document which internal IPs and ports each role needs — that list becomes your policy file, not a spaghetti of firewall any-rules.",
          "When the last critical app no longer requires full-tunnel routes, retire the concentrator and shrink external attack surface. If you already split VLANs per our networking guides, you are halfway there; remote access should inherit those boundaries, not erase them.",
        ],
      },
    ],
  },
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
