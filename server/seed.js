const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Admin = require('./models/Admin');
const CollegeInfo = require('./models/CollegeInfo');
const Department = require('./models/Department');
const Staff = require('./models/Staff');
const Event = require('./models/Event');
const Admission = require('./models/Admission');
const Article = require('./models/Article');
const Achievement = require('./models/Achievement');
const Notice = require('./models/Notice');
const Gallery = require('./models/Gallery');
const Document = require('./models/Document');
const Enquiry = require('./models/Enquiry');
const Page = require('./models/Page');
const Menu = require('./models/Menu');
const Setting = require('./models/Setting');
const generateSlug = require('./utils/slugify');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college_management';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Admin Seed
    const existingAdmin = await Admin.findOne({ email: 'admin@college.edu' });
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        email: 'admin@college.edu',
        password: 'Admin@12345',
        fullName: 'Chief Administrator',
        role: 'admin',
      });
      console.log('✓ Admin account seeded: admin@college.edu / Admin@12345');
    } else {
      console.log('✓ Admin account already exists');
    }

    // Check if data already exists, clear for fresh seed if specified
    const deptCount = await Department.countDocuments();
    if (deptCount > 0) {
      console.log('⚠️ Database already contains records. Clearing existing demo collections for clean seed...');
      await Promise.all([
        CollegeInfo.deleteMany(),
        Department.deleteMany(),
        Staff.deleteMany(),
        Event.deleteMany(),
        Admission.deleteMany(),
        Article.deleteMany(),
        Achievement.deleteMany(),
        Notice.deleteMany(),
        Gallery.deleteMany(),
        Document.deleteMany(),
        Enquiry.deleteMany(),
        Page.deleteMany(),
        Menu.deleteMany(),
        Setting.deleteMany(),
      ]);
    }

    // 2. College Info
    await CollegeInfo.create({
      collegeName: 'Apex Institute of Technology & Sciences',
      shortName: 'AITS',
      tagline: 'Pioneering Academic Excellence, Global Research & Humane Leadership',
      establishmentYear: 1998,
      logo: '/assets/logo.svg',
      aboutCollege: '<p>Established in 1998, <strong>Apex Institute of Technology & Sciences (AITS)</strong> has emerged as one of the country\'s vanguard multidisciplinary academic and research institutions. Spread over an expansive 55-acre lush green campus, AITS is committed to imparting world-class technical education, fostering disruptive research, and cultivating societal leadership among students.</p><p>With state-of-the-art supercomputing laboratories, autonomous robotics clusters, and cutting-edge biotechnology suites, we prepare engineers and leaders capable of tackling the 21st century\'s grand challenges.</p>',
      history: '<p>From a modest beginning with 180 students across three engineering disciplines in 1998, AITS has expanded exponentially to over 4,500 undergraduate, postgraduate, and doctoral scholars. Over the past 28 years, our alumni have assumed leadership roles in Fortune 500 conglomerates, pioneering deep-tech startups, and premier international research laboratories.</p>',
      vision: 'To be a globally revered citadel of higher learning, distinguished for trailblazing research, ethical innovation, and preparing future-ready professionals who enrich humanity.',
      mission: 'To impart holistic education grounded in scientific rigor, cultivate critical inquiry and hands-on technological mastery, nurture an ecosystem of entrepreneurship and research, and serve societal needs with the highest ethical standards.',
      objectives: [
        'Deliver outcome-based multidisciplinary academic curricula benchmarked to global standards.',
        'Foster high-impact sponsored research, patent filings, and industry collaboration.',
        'Ensure 100% experiential and project-based learning opportunities for all undergraduates.',
        'Nurture entrepreneurial mindsets and incubate student-led tech ventures.',
        'Uphold inclusive education and provide substantial merit-cum-means financial aid.'
      ],
      principalName: 'Dr. Arthur Pendelton, Ph.D.',
      principalDesignation: 'Principal & Senior Professor of Computer Science',
      principalMessage: '<p>Welcome to <strong>Apex Institute of Technology & Sciences</strong>. Education at AITS is not simply the accumulation of theoretical knowledge; it is a transformative journey of character building, intellectual courage, and purpose-driven innovation.</p><p>Our distinguished faculty, world-class infrastructure, and vibrant student-led research societies provide an enriching environment where curiosity is celebrated and innovation thrives. We invite ambitious young minds to join our legacy of excellence and build tomorrow together.</p>',
      principalPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
      infrastructure: '<p>Our modern campus features 80+ smart air-conditioned amphitheater classrooms, centralized high-performance computing clusters, 400 Gbps optical fiber backbone, an Olympic-standard sports complex, fully automated central library with 100,000+ volumes, and solar-powered smart eco-buildings.</p>',
      campusArea: '55-Acre Eco-Smart Wi-Fi Campus',
      affiliations: ['National Technological University', 'State Higher Education Council'],
      accreditations: ['NAAC Grade A++ (CGPA 3.82/4.0)', 'NBA Tier-1 Accredited Programs', 'NIRF Ranked Among Top 40 Tech Colleges'],
      recognitions: ['UGC 2(f) & 12(B) Recognized', 'AICTE Approved Institute of Excellence', 'DST-FIST Supported Research Departments'],
      heroHeading: 'Empowering Minds, Pioneering The Future',
      heroSubheading: 'Join a premier academic community dedicated to transformative engineering, cutting-edge innovation, and holistic student growth.',
      heroPrimaryCtaText: 'Explore Programs',
      heroPrimaryCtaLink: '/courses',
      heroSecondaryCtaText: 'Admissions 2026',
      heroSecondaryCtaLink: '/admissions',
    });
    console.log('✓ College information seeded');

    // 3. Departments
    const deptData = [
      {
        name: 'Department of Computer Science & Engineering',
        shortName: 'CSE',
        slug: 'computer-science-and-engineering',
        description: 'The Department of Computer Science and Engineering is a premier center of excellence for computational research, Artificial Intelligence, Cybersecurity, and Software Engineering.',
        headOfDepartment: 'Dr. Eleanor Vance, Ph.D. (MIT)',
        headPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
        headMessage: 'We bridge theoretical computer science with transformative real-world engineering through our state-of-the-art AI and Cloud computing labs.',
        courses: [
          { name: 'B.Tech in Computer Science & Engineering', degree: 'B.Tech', duration: '4 Years', intake: 180, eligibility: '10+2 with minimum 65% in PCM and JEE/State Rank' },
          { name: 'B.Tech in Artificial Intelligence & Machine Learning', degree: 'B.Tech', duration: '4 Years', intake: 120, eligibility: '10+2 with minimum 65% in PCM' },
          { name: 'M.Tech in Data Science & High Performance Computing', degree: 'M.Tech', duration: '2 Years', intake: 30, eligibility: 'B.Tech/BE in CSE/IT with valid GATE score' },
          { name: 'Ph.D. in Computer Science', degree: 'Ph.D.', duration: '3-5 Years', intake: 15, eligibility: 'Master\'s Degree in Engineering with UGC/NET/GATE' },
        ],
        facilities: [
          'NVIDIA High-Performance AI & Deep Learning Research Lab',
          'Cybersecurity & Threat Simulation Testbed',
          'Cloud Computing & Distributed Systems Center',
          'Autonomous IoT & Embedded Computing Hub'
        ],
        achievements: [
          'Ranked #1 CSE Department in State Tech University Rankings 2025',
          'Secured $1.2M in international research grants from tech giants',
          'Over 45 patents granted in AI and Cryptographic algorithms'
        ],
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000',
        contactEmail: 'cse.head@college.edu',
        contactPhone: '+91 (0) 1234 567810',
        displayOrder: 1,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Department of Electronics & Communication Engineering',
        shortName: 'ECE',
        slug: 'electronics-and-communication-engineering',
        description: 'Pioneering advancements in 5G/6G wireless communications, VLSI microchip design, Signal Processing, and Embedded Robotics systems.',
        headOfDepartment: 'Dr. Marcus Sterling, Ph.D. (Stanford)',
        headPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
        headMessage: 'Our students design the microchips and next-generation communication networks that power global society.',
        courses: [
          { name: 'B.Tech in Electronics & Communication Engineering', degree: 'B.Tech', duration: '4 Years', intake: 120, eligibility: '10+2 with minimum 60% in PCM' },
          { name: 'M.Tech in VLSI Design & Embedded Systems', degree: 'M.Tech', duration: '2 Years', intake: 25, eligibility: 'B.Tech in ECE/EEE with valid GATE' },
        ],
        facilities: [
          'Cadence VLSI Design and Microelectronics Cleanroom',
          'Keysight RF & Microwave Communication Test Lab',
          'Embedded Systems & Drone Avionics Lab'
        ],
        achievements: [
          'Developed indigenous CubeSat satellite payload launched by national space agency',
          '100% core semiconductor placements with leading chip manufacturers'
        ],
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
        contactEmail: 'ece.head@college.edu',
        contactPhone: '+91 (0) 1234 567811',
        displayOrder: 2,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Department of Mechanical & Aerospace Engineering',
        shortName: 'MAE',
        slug: 'mechanical-and-aerospace-engineering',
        description: 'Fostering excellence in Robotics, Autonomous Electric Vehicles, Advanced Thermodynamics, and Additive Manufacturing.',
        headOfDepartment: 'Dr. Rajeshwari Sharma, Ph.D. (IIT Delhi)',
        headPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
        headMessage: 'From high-speed aerodynamics to sustainable renewable energy, we engineer physical solutions that redefine mobility.',
        courses: [
          { name: 'B.Tech in Mechanical Engineering', degree: 'B.Tech', duration: '4 Years', intake: 90, eligibility: '10+2 with minimum 60% in PCM' },
          { name: 'B.Tech in Robotics & Automation', degree: 'B.Tech', duration: '4 Years', intake: 60, eligibility: '10+2 with minimum 60% in PCM' },
          { name: 'M.Tech in Thermal & Fluid Engineering', degree: 'M.Tech', duration: '2 Years', intake: 20, eligibility: 'B.Tech in ME with GATE' },
        ],
        facilities: [
          'Subsonic Wind Tunnel Aerodynamics Facility',
          'Industrial Robotics & CNC Machining Automation Center',
          'Electric Vehicle Battery Testing & Dyno Lab'
        ],
        achievements: [
          'Winner of Formula Student Electric Racing Cup 2024 & 2025',
          'Patented high-efficiency heat recovery exchanger deployed in heavy industries'
        ],
        image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1000',
        contactEmail: 'mae.head@college.edu',
        contactPhone: '+91 (0) 1234 567812',
        displayOrder: 3,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Department of Civil & Environmental Engineering',
        shortName: 'CEE',
        slug: 'civil-and-environmental-engineering',
        description: 'Dedicated to Smart City design, Earthquake-resistant Structures, Geo-technical Engineering, and Sustainable Hydrology.',
        headOfDepartment: 'Dr. Gregory Thorne, Ph.D. (Imperial College London)',
        headPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
        headMessage: 'We engineer resilient civil infrastructure and sustainable ecosystems for future generations.',
        courses: [
          { name: 'B.Tech in Civil Engineering', degree: 'B.Tech', duration: '4 Years', intake: 60, eligibility: '10+2 with minimum 60% in PCM' },
          { name: 'M.Tech in Structural & Earthquake Engineering', degree: 'M.Tech', duration: '2 Years', intake: 20, eligibility: 'B.Tech in Civil with GATE' },
        ],
        facilities: [
          'Seismic Shake Table & Structural Dynamics Lab',
          'Advanced Geotechnical & Soil Mechanics Testing Suite',
          'GIS & Satellite Remote Sensing Imagery Center'
        ],
        achievements: [
          'Principal consultant for State Metro Rail Project seismic audit',
          'National Award for Sustainable Campus Water Treatment Design'
        ],
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=1000',
        contactEmail: 'cee.head@college.edu',
        contactPhone: '+91 (0) 1234 567813',
        displayOrder: 4,
        isFeatured: true,
        status: 'PUBLISHED',
      }
    ];

    const seededDepts = await Department.insertMany(deptData);
    console.log(`✓ Seeded ${seededDepts.length} academic departments`);

    const cseDept = seededDepts[0];
    const eceDept = seededDepts[1];
    const maeDept = seededDepts[2];
    const ceeDept = seededDepts[3];

    // 4. Staff / Faculty
    const staffData = [
      {
        name: 'Dr. Eleanor Vance',
        slug: 'dr-eleanor-vance',
        designation: 'Professor & Head of Department',
        department: cseDept._id,
        qualification: 'Ph.D. in Computer Science (MIT), M.S. (Carnegie Mellon)',
        specialization: 'Artificial Intelligence, Machine Learning, Deep Neural Architectures',
        experience: '18 Years (Academic & Industrial R&D)',
        email: 'e.vance@college.edu',
        phone: '+91 (0) 1234 567821',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
        bio: 'Dr. Eleanor Vance has published over 65 peer-reviewed papers in top tier conferences (NeurIPS, ICML, CVPR) and consults for global tech organizations on large-scale AI alignment.',
        publicationsCount: 68,
        researchInterests: ['Generative AI', 'Computer Vision', 'Reinforcement Learning'],
        displayOrder: 1,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. Julian Foster',
        slug: 'dr-julian-foster',
        designation: 'Associate Professor',
        department: cseDept._id,
        qualification: 'Ph.D. in Cybersecurity (Purdue University)',
        specialization: 'Quantum-Resistant Cryptography, Cloud Security, Distributed Systems',
        experience: '12 Years',
        email: 'j.foster@college.edu',
        phone: '+91 (0) 1234 567822',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
        bio: 'Dr. Foster leads the Cybersecurity Threat Simulation Lab and holds 4 international patents in lattice-based cryptography.',
        publicationsCount: 34,
        researchInterests: ['Post-Quantum Cryptography', 'Zero-Knowledge Proofs', 'Network Defense'],
        displayOrder: 2,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Prof. Ananya Sen',
        slug: 'prof-ananya-sen',
        designation: 'Assistant Professor',
        department: cseDept._id,
        qualification: 'M.Tech in Software Engineering (IIT Bombay)',
        specialization: 'Full Stack Web Architectures, DevOps, Microservices, Cloud Native',
        experience: '8 Years',
        email: 'a.sen@college.edu',
        phone: '+91 (0) 1234 567823',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
        bio: 'Prof. Sen is an avid open-source contributor and mentors student teams in competitive programming and hackathons.',
        publicationsCount: 14,
        researchInterests: ['Distributed Systems', 'DevOps Automation', 'Modern UI/UX Systems'],
        displayOrder: 3,
        isFeatured: false,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. Marcus Sterling',
        slug: 'dr-marcus-sterling',
        designation: 'Professor & Head of Department',
        department: eceDept._id,
        qualification: 'Ph.D. in VLSI & Microelectronics (Stanford University)',
        specialization: 'Semiconductor Microchip Architecture, Low Power VLSI, 5G/6G RF Systems',
        experience: '20 Years',
        email: 'm.sterling@college.edu',
        phone: '+91 (0) 1234 567824',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
        bio: 'Dr. Sterling previously worked with major semiconductor fabrication companies before dedicating his career to academic mentorship.',
        publicationsCount: 82,
        researchInterests: ['System-on-Chip (SoC)', 'Nanoscale CMOS', 'Millimeter Wave Antennas'],
        displayOrder: 1,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. Priya Nair',
        slug: 'dr-priya-nair',
        designation: 'Associate Professor',
        department: eceDept._id,
        qualification: 'Ph.D. in Signal Processing (IISc Bangalore)',
        specialization: 'Biomedical Signal Processing, Computer Vision for Healthcare',
        experience: '11 Years',
        email: 'p.nair@college.edu',
        phone: '+91 (0) 1234 567825',
        photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
        bio: 'Dr. Nair conducts interdisciplinary research in wearable bio-sensors and EEG signal classification.',
        publicationsCount: 29,
        researchInterests: ['Biomedical Sensors', 'Pattern Recognition', 'Embedded AI'],
        displayOrder: 2,
        isFeatured: false,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. Rajeshwari Sharma',
        slug: 'dr-rajeshwari-sharma',
        designation: 'Professor & Head of Department',
        department: maeDept._id,
        qualification: 'Ph.D. in Mechanical Engineering (IIT Delhi)',
        specialization: 'Computational Fluid Dynamics, Turbomachinery, Renewable Clean Energy',
        experience: '19 Years',
        email: 'r.sharma@college.edu',
        phone: '+91 (0) 1234 567826',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
        bio: 'Dr. Sharma leads the Aerodynamics Research Hub and has received the National Distinguished Faculty Award in Engineering.',
        publicationsCount: 55,
        researchInterests: ['CFD Simulations', 'Supersonic Combustion', 'Wind Turbine Optimization'],
        displayOrder: 1,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. David Gallagher',
        slug: 'dr-david-gallagher',
        designation: 'Associate Professor',
        department: maeDept._id,
        qualification: 'Ph.D. in Robotics & Mechatronics (Georgia Tech)',
        specialization: 'Autonomous Mobile Robotics, Haptic Systems, Bipedal Locomotion',
        experience: '10 Years',
        email: 'd.gallagher@college.edu',
        phone: '+91 (0) 1234 567827',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
        bio: 'Faculty advisor for the university Formula Electric team and winner of multiple international robotics challenges.',
        publicationsCount: 22,
        researchInterests: ['Mechatronics', 'Kinematics', 'Autonomous Drones'],
        displayOrder: 2,
        isFeatured: false,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. Gregory Thorne',
        slug: 'dr-gregory-thorne',
        designation: 'Professor & Head of Department',
        department: ceeDept._id,
        qualification: 'Ph.D. in Structural Engineering (Imperial College London)',
        specialization: 'Seismic Hazard Analysis, Base Isolation Systems, High-Rise Dynamics',
        experience: '22 Years',
        email: 'g.thorne@college.edu',
        phone: '+91 (0) 1234 567828',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
        bio: 'Chief structural consultant for major governmental infrastructure projects across Asia and Europe.',
        publicationsCount: 71,
        researchInterests: ['Earthquake Engineering', 'Smart Concrete Materials', 'Resilient Structures'],
        displayOrder: 1,
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        name: 'Dr. Sunita Deshmukh',
        slug: 'dr-sunita-deshmukh',
        designation: 'Associate Professor',
        department: ceeDept._id,
        qualification: 'Ph.D. in Environmental Engineering (University of Tokyo)',
        specialization: 'Smart Water Treatment, Eco-Hydrology, Solid Waste Valorization',
        experience: '13 Years',
        email: 's.deshmukh@college.edu',
        phone: '+91 (0) 1234 567829',
        photo: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=600',
        bio: 'Dr. Deshmukh directs the Sustainable Campus Water Initiative and conducts research on microplastic remediation.',
        publicationsCount: 38,
        researchInterests: ['Membrane Bio-Reactors', 'Hydrological Modeling', 'Environmental Policy'],
        displayOrder: 2,
        isFeatured: false,
        status: 'PUBLISHED',
      }
    ];

    const seededStaff = await Staff.insertMany(staffData);
    console.log(`✓ Seeded ${seededStaff.length} faculty profiles`);

    // 5. Events
    const now = new Date();
    const eventData = [
      {
        title: 'ApexInnovate 2026: Annual International Tech Symposium & Hackathon',
        slug: 'apexinnovate-2026-annual-tech-symposium',
        description: 'A 48-hour continuous national hackathon and international tech symposium featuring keynote speakers from top global tech firms, project exhibitions, and venture capitalist pitch sessions with $25,000 in prizes.',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 17),
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        venue: 'Grand Central Auditorium & Innovation Hub',
        organizer: 'AITS Technical Affairs Council & CSE Society',
        category: 'Technical',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
        registrationLink: 'https://example.com/register/apexinnovate',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'International Conference on Sustainable Engineering & Clean Mobility (ICSECM-26)',
        slug: 'international-conference-sustainable-engineering-2026',
        description: 'Peer-reviewed IEEE-sponsored technical paper presentations, workshop sessions on zero-emission propulsion, renewable microgrids, and smart urban infrastructure.',
        date: new Date(now.getFullYear(), now.getMonth() + 2, 5),
        endDate: new Date(now.getFullYear(), now.getMonth() + 2, 7),
        startTime: '10:00 AM',
        endTime: '05:30 PM',
        venue: 'Convention Center, Academic Block B',
        organizer: 'Department of Mechanical & Civil Engineering',
        category: 'Conference',
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
        registrationLink: 'https://example.com/conference/icsecm26',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Symphony 2026: Annual Grand Cultural Fest & Music Showcase',
        slug: 'symphony-2026-annual-cultural-fest',
        description: 'The premier inter-college cultural extravaganza with battle of the bands, classical dances, theatrical plays, celebrity musical night, and fine art showcases.',
        date: new Date(now.getFullYear(), now.getMonth() + 3, 10),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 12),
        startTime: '04:00 PM',
        endTime: '10:00 PM',
        venue: 'Open Air Amphitheater & Campus Grounds',
        organizer: 'Student Cultural Affairs Board',
        category: 'Cultural',
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
        registrationLink: 'https://example.com/symphony2026',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'National Robotics Championship & Drone Racing 2025',
        slug: 'national-robotics-championship-2025',
        description: 'Over 120 college teams competed in RoboWars, Autonomous Line Following, and Obstacle Drone Racing at the apex indoor arena.',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 12),
        endDate: new Date(now.getFullYear(), now.getMonth() - 2, 13),
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        venue: 'Indoor Sports Arena',
        organizer: 'Robotics & Automation Society',
        category: 'Sports',
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
        isFeatured: false,
        status: 'PUBLISHED',
      }
    ];

    const seededEvents = await Event.insertMany(eventData);
    console.log(`✓ Seeded ${seededEvents.length} events`);

    // 6. Admissions
    const admissionData = [
      {
        title: 'Undergraduate B.Tech Admissions 2026-2027 Announced',
        slug: 'undergraduate-btech-admissions-2026-2027',
        category: 'Undergraduate',
        academicYear: '2026-2027',
        description: '<p>Applications are invited from eligible candidates for admission into 4-Year B.Tech programs in Computer Science, Artificial Intelligence, Electronics & Communication, Mechanical, and Civil Engineering for the academic year 2026-2027.</p><p>Admissions are conducted strictly based on merit in national/state entrance examinations followed by centralized counseling.</p>',
        coursesOffered: [
          'B.Tech in Computer Science & Engineering (180 Seats)',
          'B.Tech in Artificial Intelligence & Machine Learning (120 Seats)',
          'B.Tech in Electronics & Communication Engineering (120 Seats)',
          'B.Tech in Mechanical Engineering (90 Seats)',
          'B.Tech in Civil Engineering (60 Seats)',
          'B.Tech in Robotics & Automation (60 Seats)'
        ],
        eligibility: 'Candidate must have passed 10+2 or equivalent examination with Physics, Mathematics and Chemistry/Computer Science with minimum 60% aggregate marks (55% for reserved categories).',
        procedure: '1. Register and submit online application form.\n2. Upload academic transcripts and entrance scorecard.\n3. Attend merit counseling session.\n4. Document verification and seat allotment.\n5. Fee payment and provisional admission confirmation.',
        feeStructure: 'Annual Tuition Fee: $1,800 / ₹1,45,000 per annum (Scholarships available for top 10% merit scorers).',
        importantDates: [
          { event: 'Online Application Portal Opens', date: 'March 15, 2026' },
          { event: 'Last Date for Application Submission', date: 'June 30, 2026' },
          { event: 'Publication of Merit List', date: 'July 08, 2026' },
          { event: 'Phase 1 Counseling & Document Verification', date: 'July 15-20, 2026' },
          { event: 'Commencement of Academic Classes', date: 'August 03, 2026' }
        ],
        requiredDocuments: [
          'Class 10th & 12th Marksheets and Passing Certificates',
          'Entrance Examination Scorecard / Rank Letter',
          'Transfer Certificate (TC) & Migration Certificate',
          'Category / Caste Certificate (if applicable)',
          'Recent Passport-size Photographs (6 copies)',
          'Aadhar Card / Government Photo Identity Proof'
        ],
        externalApplyUrl: 'https://example.com/apply-online-2026',
        contactHelpline: '+91 (0) 1234 567800 / admissions@college.edu',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Postgraduate M.Tech & Ph.D Research Admissions 2026',
        slug: 'postgraduate-mtech-phd-admissions-2026',
        category: 'Postgraduate',
        academicYear: '2026-2027',
        description: '<p>Applications are invited for full-time and sponsored M.Tech and Ph.D. research fellowships across all engineering departments. Full institute fellowship of ₹37,000/month available for qualified doctoral researchers.</p>',
        coursesOffered: [
          'M.Tech in Data Science & HPC',
          'M.Tech in VLSI & Embedded Systems',
          'M.Tech in Thermal Engineering',
          'Ph.D in Engineering (All disciplines)'
        ],
        eligibility: 'B.E./B.Tech degree in relevant discipline with minimum 60% marks and valid GATE/NET score or Institute Written Test qualification.',
        procedure: 'Submit application with research proposal synopsis, followed by departmental written assessment and technical interview.',
        importantDates: [
          { event: 'Application Submission Deadline', date: 'May 31, 2026' },
          { event: 'Departmental Written Test & Interview', date: 'June 18-20, 2026' },
          { event: 'Result Announcement', date: 'June 28, 2026' }
        ],
        externalApplyUrl: 'https://example.com/apply-pg-2026',
        isFeatured: true,
        status: 'PUBLISHED',
      }
    ];

    const seededAdmissions = await Admission.insertMany(admissionData);
    console.log(`✓ Seeded ${seededAdmissions.length} admission notices`);

    // 7. Articles / News
    const articleData = [
      {
        title: 'AITS Secures Highest NAAC A++ Accreditation with 3.82 CGPA',
        slug: 'aits-secures-highest-naac-a-plus-plus-accreditation',
        featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
        shortDescription: 'The National Assessment and Accreditation Council (NAAC) has awarded Apex Institute of Technology & Sciences the prestigious Grade A++ with an exceptional 3.82 score.',
        content: '<p>In a historic milestone, Apex Institute of Technology & Sciences has been accredited with the highest Grade A++ by NAAC with an institutional CGPA of 3.82 out of 4.0.</p><p>The peer inspection committee commended the university\'s high research output, 94% average placement record, modern state-of-the-art laboratory infrastructure, and comprehensive eco-smart green campus initiatives.</p><p>Principal Dr. Arthur Pendelton congratulated all faculty, researchers, staff, and students for their tireless dedication to academic excellence.</p>',
        author: 'Office of Quality Assurance (IQAC)',
        category: 'Campus News',
        tags: ['Accreditation', 'NAAC', 'Excellence', 'Ranking'],
        publicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        seoTitle: 'AITS NAAC Grade A++ Accreditation News',
        seoDescription: 'Apex Institute of Technology & Sciences receives prestigious NAAC Grade A++ accreditation.',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'CSE Student Research Team Wins $50,000 Global AI Hackathon in San Francisco',
        slug: 'cse-research-team-wins-global-ai-hackathon-2026',
        featuredImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
        shortDescription: 'A 4-member student team from the CSE Department won first prize at the International Open Generative AI Challenge for their low-latency autonomous medical diagnosis system.',
        content: '<p>A student research team from the Department of Computer Science & Engineering represented AITS at the Grand Finals of the International Open Generative AI Challenge in San Francisco, beating over 400 collegiate teams worldwide.</p><p>Their solution, an edge-optimized multi-modal model for emergency pediatric diagnosis, won acclaim from industry leaders for its accuracy, privacy guarantees, and low compute footprint.</p>',
        author: 'Media & Public Relations Cell',
        category: 'Research & Innovation',
        tags: ['AI', 'Hackathon', 'Global Award', 'Student Achievement'],
        publicationDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 12),
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'New Autonomous Robotics & Electric Mobility Center Inaugurated',
        slug: 'autonomous-robotics-and-electric-mobility-center-inaugurated',
        featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
        shortDescription: 'A state-of-the-art 15,000 sq. ft. research center dedicated to autonomous electric drones and vehicle telemetry was formally inaugurated by the State Minister of Higher Education.',
        content: '<p>The modern facility is equipped with six-axis industrial robotic arms, high-speed dynamometers, hardware-in-the-loop (HIL) simulators, and battery cyclers funded through joint university-industry grants.</p>',
        author: 'MAE Department Editorial',
        category: 'Campus News',
        tags: ['Robotics', 'Electric Vehicles', 'Research Center'],
        publicationDate: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        isFeatured: false,
        status: 'PUBLISHED',
      }
    ];

    const seededArticles = await Article.insertMany(articleData);
    console.log(`✓ Seeded ${seededArticles.length} articles`);

    // 8. Achievements
    const achievementData = [
      {
        title: 'First Prize in International Aerial Robotics Challenge (IARC)',
        category: 'Innovation & Hackathon',
        recipient: 'Team AeroApex (Mechanical & ECE Joint Team)',
        department: maeDept._id,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 10),
        academicYear: '2025-2026',
        level: 'International',
        description: 'Designed and deployed an autonomous collision-avoiding drone swarm that successfully navigated complex GPS-denied obstacle courses.',
        photo: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=600',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Gold Medal at Inter-University National Basketball Championship',
        category: 'Sports',
        recipient: 'Apex Men\'s Varsity Basketball Team',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 18),
        academicYear: '2025-2026',
        level: 'National',
        description: 'Defeated defending champions in an exhilarating 78-72 final to bring home the National Inter-University Gold Trophy.',
        photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600',
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Outstanding Young Scientist Award by National Science Academy',
        category: 'Faculty Recognition',
        recipient: 'Dr. Eleanor Vance',
        department: cseDept._id,
        date: new Date(now.getFullYear(), now.getMonth() - 3, 5),
        academicYear: '2025-2026',
        level: 'National',
        description: 'Conferred for seminal contributions in explainable artificial intelligence and neural network safety verification.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
        isFeatured: true,
        status: 'PUBLISHED',
      }
    ];

    const seededAchievements = await Achievement.insertMany(achievementData);
    console.log(`✓ Seeded ${seededAchievements.length} achievements`);

    // 9. Notices
    const noticeData = [
      {
        title: 'Notification: End-Semester Theory & Practical Examinations Schedule (Spring 2026)',
        slug: 'end-semester-examinations-schedule-spring-2026',
        description: 'All undergraduate and postgraduate students are hereby notified that the End-Semester Examination timetable for the Spring 2026 session has been published. Admit cards will be distributed from April 10, 2026.',
        category: 'Examination',
        priority: 'HIGH',
        publishDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        expiryDate: new Date(now.getFullYear(), now.getMonth() + 2, 30),
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'National Merit-cum-Means Scholarship Applications Open for Academic Year 2026-27',
        slug: 'merit-cum-means-scholarship-applications-open',
        description: 'Eligible students with annual parental income below ₹5.0 Lakhs and minimum 7.5 CGPA in previous semesters are invited to apply for institute fee waiver scholarships.',
        category: 'Academic',
        priority: 'MEDIUM',
        publishDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        expiryDate: new Date(now.getFullYear(), now.getMonth() + 1, 25),
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Urgent: Registration for Annual Placement Drive 2026 (Final Year Students)',
        slug: 'annual-placement-drive-2026-registration',
        description: 'Training and Placement Cell invites final year engineering students to complete mandatory company registration on the placement portal before the deadline.',
        category: 'Important',
        priority: 'URGENT',
        publishDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        expiryDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Hostel Re-allotment and Room Booking for 2026-27 Academic Year',
        slug: 'hostel-re-allotment-room-booking-2026',
        description: 'Hostel residents must submit room preference forms and clear outstanding mess dues through the hostel office before May 15, 2026.',
        category: 'Hostel & Transport',
        priority: 'LOW',
        publishDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        expiryDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),
        isFeatured: false,
        status: 'PUBLISHED',
      }
    ];

    const seededNotices = await Notice.insertMany(noticeData);
    console.log(`✓ Seeded ${seededNotices.length} notices`);

    // 10. Gallery Albums
    const galleryData = [
      {
        title: 'Vibrant Campus Infrastructure & Academic Facilities',
        slug: 'vibrant-campus-infrastructure-facilities',
        category: 'Campus',
        description: 'Take a virtual tour of our 55-acre green smart campus, laboratories, libraries, athletic centers, and student complexes.',
        coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000',
        images: [
          { url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000', caption: 'Main Academic Quadrangle and Central Tower' },
          { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000', caption: 'Collaborative Student Innovation Commons' },
          { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000', caption: 'Digital Smart Classroom with Interactive Display' },
          { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000', caption: 'Precision Microelectronics & Robotics Lab' },
        ],
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'ApexInnovate Annual Tech Fest & National Hackathon',
        slug: 'apexinnovate-annual-tech-fest',
        category: 'Workshops',
        description: 'Memories from the grand 48-hour collegiate tech championship, hackathons, drone racing, and coding competitions.',
        coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
        images: [
          { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000', caption: 'Teams hacking through the night in the grand arena' },
          { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000', caption: 'Keynote lecture on the future of autonomous systems' },
          { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000', caption: 'Grand Award ceremony and trophy presentation' },
        ],
        isFeatured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Annual Sports Meet & Inter-Collegiate Athletics',
        slug: 'annual-sports-meet-athletics',
        category: 'Sports',
        description: 'Highlights from the annual athletics championship, basketball finals, soccer league, and badminton tourney.',
        coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000',
        images: [
          { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000', caption: 'Sprint track finals at the Olympic standard athletic ground' },
          { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1000', caption: 'Men\'s varsity basketball championship match' },
        ],
        isFeatured: false,
        status: 'PUBLISHED',
      }
    ];

    const seededGalleries = await Gallery.insertMany(galleryData);
    console.log(`✓ Seeded ${seededGalleries.length} gallery albums`);

    // 11. Documents
    const documentData = [
      {
        title: 'Official College Information Prospectus 2026-2027',
        description: 'Comprehensive brochure detailing academic curricula, campus infrastructure, fee structure, scholarship rules, and placement records.',
        category: 'Prospectus',
        fileUrl: '/uploads/documents/AITS_Prospectus_2026_27.pdf',
        fileName: 'AITS_Prospectus_2026_27.pdf',
        fileType: 'application/pdf',
        fileSize: '4.8 MB',
        downloadCount: 420,
        status: 'PUBLISHED',
      },
      {
        title: 'Academic Calendar & Semester Schedule (2026-2027)',
        description: 'Official schedule of instructional days, mid-term examinations, semester end examinations, holidays, and academic conferences.',
        category: 'Academic Calendar',
        fileUrl: '/uploads/documents/Academic_Calendar_2026_27.pdf',
        fileName: 'Academic_Calendar_2026_27.pdf',
        fileType: 'application/pdf',
        fileSize: '1.1 MB',
        downloadCount: 780,
        status: 'PUBLISHED',
      },
      {
        title: 'Mandatory Institutional Disclosures & Accreditation Reports (AICTE/UGC)',
        description: 'Detailed compliance report, faculty rosters, audited financial accounts, and NAAC self-study report (SSR).',
        category: 'Mandatory Disclosures',
        fileUrl: '/uploads/documents/Mandatory_Disclosures_2026.pdf',
        fileName: 'Mandatory_Disclosures_2026.pdf',
        fileType: 'application/pdf',
        fileSize: '3.2 MB',
        downloadCount: 150,
        status: 'PUBLISHED',
      },
      {
        title: 'Undergraduate Admission Application Form & Instructions (Offline)',
        description: 'Printable application form for candidates applying under management and NRI quota categories.',
        category: 'Admission Forms',
        fileUrl: '/uploads/documents/UG_Admission_Application_Form_2026.pdf',
        fileName: 'UG_Admission_Application_Form_2026.pdf',
        fileType: 'application/pdf',
        fileSize: '850 KB',
        downloadCount: 310,
        status: 'PUBLISHED',
      }
    ];

    const seededDocs = await Document.insertMany(documentData);
    console.log(`✓ Seeded ${seededDocs.length} institutional documents`);

    // 12. Enquiries
    const enquiryData = [
      {
        name: 'Siddharth Rao',
        email: 'siddharth.rao@gmail.com',
        phone: '+91 9876543210',
        subject: 'Inquiry regarding B.Tech CSE Artificial Intelligence intake and cutoff scores',
        message: 'Hello Admissions Office, I have secured a 96.4 percentile in the national entrance exam. I would like to know the seat availability and hostel booking process for B.Tech CSE (AI & ML).',
        category: 'Admissions',
        isRead: false,
        status: 'NEW',
      },
      {
        name: 'Dr. Michael Chang',
        email: 'm.chang@techconsortium.org',
        subject: 'Proposal for joint collaborative research grant on Quantum-safe IoT',
        message: 'Dear Head of Department, Our consortium would like to propose a funded research collaboration with your Cybersecurity and Microelectronics labs.',
        category: 'Academic Information',
        isRead: true,
        adminNotes: 'Forwarded to Dr. Vance and Dr. Foster for review.',
        status: 'IN_PROGRESS',
      },
      {
        name: 'Ritu Verma',
        email: 'ritu.verma@outlook.com',
        phone: '+91 9811223344',
        subject: 'Campus Visit and Laboratory Tour Request for high school students',
        message: 'We are organizing an excursion for 40 STEM high school seniors to visit your robotics and wind tunnel laboratories next month.',
        category: 'Campus Visit',
        isRead: false,
        status: 'NEW',
      }
    ];

    await Enquiry.insertMany(enquiryData);
    console.log('✓ Seeded sample enquiries');

    // 13. Dynamic Pages
    const pageData = [
      {
        title: 'Campus Facilities & World-Class Infrastructure',
        slug: 'facilities',
        content: `<h2>Unrivaled Infrastructure for Holistic Learning</h2>
        <p>Apex Institute of Technology & Sciences offers an ecosystem designed to ignite intellect, nurture creativity, and promote physical well-being. Our infrastructure conforms to international green campus standards.</p>
        <h3>1. Central High-Tech Automated Library</h3>
        <p>Spanning four floors, our central library houses over 100,000 volumes, 5,000+ national and international journal subscriptions, digital e-book kiosks, and 24x7 quiet study carrels with gigabit high-speed internet.</p>
        <h3>2. Supercomputing & AI Research Clusters</h3>
        <p>Equipped with modern GPU nodes, high-throughput storage networks, and virtualized private cloud clusters accessible to students for machine learning and numerical modeling research.</p>
        <h3>3. Residential Hostels & Dining Facilities</h3>
        <p>Separate air-conditioned hostel towers for men and women featuring Wi-Fi, biometric security, hygienic multi-cuisine dining cafeterias, medical infirmary with resident doctors, and laundromat facilities.</p>
        <h3>4. Sports & Fitness Complex</h3>
        <p>Olympic-size swimming pool, floodlit synthetic tennis and basketball courts, FIFA-certified turf soccer pitch, 400m running track, and fully equipped strength-training gymnasium.</p>`,
        seoTitle: 'Campus Facilities & Infrastructure | Apex Institute of Technology',
        seoDescription: 'Explore the modern infrastructure, computing clusters, library, sports, and residential facilities at AITS.',
        menuVisibility: true,
        displayOrder: 1,
        status: 'PUBLISHED',
      },
      {
        title: 'Training & Placement Cell (Career Development)',
        slug: 'training-placement',
        content: `<h2>Bridging Academic Rigor and Global Corporate Careers</h2>
        <p>The Training and Placement Cell (T&P) at AITS operates as a full-time catalyst connecting ambitious scholars with premier global tech firms, research organizations, and Fortune 500 enterprises.</p>
        <h3>Placement Highlights (Batch 2025)</h3>
        <ul>
          <li><strong>Highest International CTC:</strong> $145,000 / annum</li>
          <li><strong>Highest Domestic CTC:</strong> ₹48.5 LPA</li>
          <li><strong>Average Placement Package:</strong> ₹11.2 LPA</li>
          <li><strong>Total Corporate Recruiters:</strong> 220+ Companies</li>
          <li><strong>Overall Placement Percentage:</strong> 96.4%</li>
        </ul>
        <h3>Prominent Recruiters</h3>
        <p>Google, Microsoft, Amazon, NVIDIA, Texas Instruments, Intel, Larsen & Toubro, Tata Consultancy Services, Mercedes-Benz R&D, Goldman Sachs, and Cisco.</p>`,
        seoTitle: 'Training and Placement Cell | Apex Institute of Technology',
        seoDescription: '96%+ placement record with top international and domestic recruiters visiting campus every year.',
        menuVisibility: true,
        displayOrder: 2,
        status: 'PUBLISHED',
      },
      {
        title: 'Research & Innovation Council',
        slug: 'research-council',
        content: `<h2>Fostering Frontier Research & Entrepreneurship</h2>
        <p>At AITS, research is at the heart of our mission. Our faculty and students work at the intersection of emerging technologies to generate patents, publish peer-reviewed papers, and spin off deep-tech startups.</p>
        <h3>Core Research Thrust Areas:</h3>
        <ul>
          <li>Next-Gen Artificial Intelligence, LLMs, and Robotics</li>
          <li>VLSI Microelectronics, Quantum Sensors, and 6G Communications</li>
          <li>Clean Sustainable Energy, Bio-Fuels, and Carbon Capture</li>
          <li>Earthquake Resilient Smart Civil Infrastructure</li>
        </ul>`,
        seoTitle: 'Research & Innovation Council | Apex Institute of Technology',
        seoDescription: 'Frontier scientific discovery and funded research initiatives at AITS.',
        menuVisibility: true,
        displayOrder: 3,
        status: 'PUBLISHED',
      }
    ];

    await Page.insertMany(pageData);
    console.log('✓ Seeded dynamic CMS pages');

    // 14. Menu
    await Menu.create({
      name: 'main-navigation',
      items: [
        { title: 'Home', url: '/', order: 1, isActive: true },
        {
          title: 'About Us',
          url: '/about',
          order: 2,
          isActive: true,
          children: [
            { title: 'Overview & History', url: '/about', order: 1, isActive: true },
            { title: 'Vision & Mission', url: '/vision-mission', order: 2, isActive: true },
            { title: "Principal's Message", url: '/principal-message', order: 3, isActive: true },
            { title: 'Campus Facilities', url: '/facilities', order: 4, isActive: true },
          ]
        },
        { title: 'Departments', url: '/departments', order: 3, isActive: true },
        { title: 'Faculty', url: '/staff', order: 4, isActive: true },
        { title: 'Courses', url: '/courses', order: 5, isActive: true },
        {
          title: 'Admissions',
          url: '/admissions',
          order: 6,
          isActive: true,
          children: [
            { title: 'Admissions 2026 Overview', url: '/admissions', order: 1, isActive: true },
            { title: 'Admission Notices & Forms', url: '/admissions/notices', order: 2, isActive: true },
          ]
        },
        { title: 'Events', url: '/events', order: 7, isActive: true },
        { title: 'News & Articles', url: '/articles', order: 8, isActive: true },
        { title: 'Achievements', url: '/achievements', order: 9, isActive: true },
        { title: 'Notices', url: '/notices', order: 10, isActive: true },
        { title: 'Gallery', url: '/gallery', order: 11, isActive: true },
        { title: 'Contact Us', url: '/contact', order: 12, isActive: true },
      ]
    });
    console.log('✓ Seeded navigation menu structure');

    // 15. Settings
    await Setting.create({
      collegeName: 'Apex Institute of Technology & Sciences',
      shortName: 'AITS',
      tagline: 'Pioneering Academic Excellence & Modern Innovation',
      logoUrl: '',
      faviconUrl: '',
      address: 'Knowledge Park IV, Educational Expressway, Metropolis Campus - 400012',
      phone: '+91 (0) 1234 567890 / 567891',
      emergencyPhone: '+91 (0) 1234 999111',
      email: 'info@college.edu',
      admissionsEmail: 'admissions@college.edu',
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        youtube: 'https://youtube.com',
        instagram: 'https://instagram.com',
      },
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.4820014!3d28.5029312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMwJzEwLjUiTiA3N8KwMjgnNTUuMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
      footerAbout: 'Apex Institute of Technology & Sciences is a premier center of higher education and innovative research, recognized for holistic learning and top tier career opportunities.',
      copyrightText: '© 2026 Apex Institute of Technology & Sciences. All rights reserved.',
      defaultSeo: {
        metaTitle: 'Apex Institute of Technology & Sciences | Premier Engineering & Tech College',
        metaDescription: 'Official portal of Apex Institute of Technology & Sciences (AITS). Ranked Grade A++ NAAC. Admissions open for undergraduate and graduate programs 2026-27.',
        keywords: 'college, engineering, computer science, admissions 2026, tech degrees, campus life, university ranking',
      },
      activeAdmissionAlert: {
        enabled: true,
        text: 'Admissions Open for Academic Year 2026-27! Apply online now before June 30, 2026.',
        link: '/admissions',
      }
    });
    console.log('✓ Seeded global website settings');

    console.log('\n========================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('👤 Admin Login: admin@college.edu | Password: Admin@12345');
    console.log('========================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
};

seedDatabase();
