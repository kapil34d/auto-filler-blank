import { TemplateSample } from '../types';

export const SAMPLE_TEMPLATES: TemplateSample[] = [
  {
    id: 'nda',
    title: 'Mutual Non-Disclosure Agreement',
    category: 'Legal',
    description: 'Standard confidentiality contract with mixed bracket formats and signature blanks.',
    iconName: 'ShieldAlert',
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into on (Effective Date), by and between:

Party A: [First Party Name], with its principal office located at <First Party Address>
Party B: [Second Party Name], with its principal office located at {Second Party Address}

1. PURPOSE OF AGREEMENT
The parties wish to explore a potential business relationship concerning [Project Name]. In connection with this opportunity, each party may disclose certain confidential technical and business information to the other.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any proprietary information disclosed by either party concerning [Project Name], including but not limited to trade secrets, source code, financial projections, and customer lists.

3. GOVERNING LAW
This Agreement shall be construed in accordance with the laws of (State or Country Jurisdiction).

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

For [First Party Name]:
Authorized Signature: _______
Title: .........
Date: .........

For [Second Party Name]:
Authorized Signature: _______
Title: .........
Date: .........`
  },
  {
    id: 'offer',
    title: 'Executive Job Offer Letter',
    category: 'Human Resources',
    description: 'Formal employment offer letter featuring repeated candidate details and compensation terms.',
    iconName: 'Briefcase',
    content: `[Company Name]
<Company Address>
(Date of Offer)

Dear [Candidate Name],

We are thrilled to formally offer you the full-time position of {Job Title} at [Company Name]. We were thoroughly impressed by your background and are confident that your leadership will be instrumental to our continued growth.

KEY TERMS OF EMPLOYMENT:
• Position: {Job Title}
• Reporting To: <Supervisor Name and Title>
• Start Date: (Proposed Start Date)
• Base Salary: $[Annual Salary Amount] per year, paid on a semi-monthly basis.
• Target Bonus: {Annual Bonus Percentage}% of base salary based on performance milestones.
• Stock Options: You will be granted [Number of Shares] incentive stock options vesting over 4 years.

Please confirm your acceptance of this offer by signing and returning this document by (Offer Expiration Date).

We look forward to welcoming you to the [Company Name] team!

Sincerely,

<Hiring Manager Name>
<Hiring Manager Title>

ACCEPTED AND AGREED:

________________________ (Candidate Signature)
................. (Date Signed)`
  },
  {
    id: 'cold_email',
    title: 'B2B Sales Outreach Email',
    category: 'Sales & Marketing',
    description: 'High-converting personalized email template with deduplicated placeholder spots.',
    iconName: 'Send',
    content: `Subject: Quick question regarding [Target Company]'s {Primary Focus Area}

Hi [First Name],

I noticed that [Target Company] recently expanded its operations in (Geographic Region). Congrats on the growth!

Typically, when companies scale their {Primary Focus Area}, they run into bottlenecks with <Pain Point Solution>. We helped clients like [Reference Client] reduce overhead by {Percentage Improvement}% within just 90 days.

I created a custom 3-minute video walkthrough specifically for [Target Company] showing exactly how we can automate your <Pain Point Solution>.

Are you open to a brief 10-minute chat on (Day of Week) at [Proposed Time] EST?

Best regards,

{Sender Name}
<Sender Title> | [Sender Company]
Website: .........
Phone: _______`
  },
  {
    id: 'invoice',
    title: 'Freelance Service Invoice',
    category: 'Finance',
    description: 'Clean billing statement template with line blanks and bracketed payment terms.',
    iconName: 'Receipt',
    content: `INVOICE #{Invoice Number}

FROM:
[Freelancer Name]
<Freelancer Email>
{Bank Account Details}

TO:
[Client Name]
<Client Company Address>

Date Issued: (Invoice Date)
Payment Due Date: (Due Date)

DESCRIPTION OF SERVICES:
1. Website UI/UX Redesign for [Client Name] ................. $[Service Fee 1]
2. Frontend Implementation (React + Tailwind) ............... $[Service Fee 2]
3. Deployment & Performance Optimization .................... $[Service Fee 3]

TOTAL AMOUNT DUE: $[Total Invoice Amount]

NOTES & PAYMENT TERMS:
Payment is requested within {Net Payment Days} days. Please send ACH transfer or wire to {Bank Account Details}. Thank you for your business!

Authorized Approval Stamp / Signature:
_______`
  },
  {
    id: 'madlibs',
    title: 'Sci-Fi Cyberpunk Mad Libs',
    category: 'Entertainment',
    description: 'Fun interactive storytelling template to test creative blank filling!',
    iconName: 'Sparkles',
    content: `THE CYBERPUNK CHRONICLES

The year is (Future Year). In the neon-lit alleys of <Futuristic City>, a rogue hacker known only as "[Hacker Alias]" prepared for the ultimate heist.

Equipped with a cybernetic {Body Part} and a quantum computer disguised as a <Everyday Object>, [Hacker Alias] needed to infiltrate the mainframe of [Mega Corporation].

"Listen up," whispered their android partner, {Android Name}. "The firewalls at [Mega Corporation] are protected by ferocious digital (Plural Animal). If we trigger the alarm, we'll be blasted with rays of pure <Liquid Substance>!"

With a loud _______, they breached the security grid. Suddenly, a giant prompt appeared on the holo-screen:

"ENTER PASSWORD: ........."

Without hesitation, [Hacker Alias] typed the secret phrase: "{Silly Catchphrase}!" The vault opened instantly.`
  }
];
