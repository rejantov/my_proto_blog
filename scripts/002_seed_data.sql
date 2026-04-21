-- Seed data for portfolio

-- Insert profile
INSERT INTO profile (name, title, bio, email) VALUES (
  'Your Name',
  'Full Stack Developer → Cybersecurity Specialist',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Currently transitioning from full-stack development to cybersecurity, combining my programming expertise with a passion for securing digital infrastructure.',
  'hello@example.com'
);

-- Insert sample projects
INSERT INTO projects (title, description, technologies, featured) VALUES 
(
  'Security Dashboard',
  'A real-time security monitoring dashboard that tracks vulnerabilities, monitors network traffic, and provides instant alerts for potential threats.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'WebSockets', 'Docker'],
  true
),
(
  'Password Manager',
  'End-to-end encrypted password manager with zero-knowledge architecture. Features include secure sharing, breach monitoring, and 2FA integration.',
  ARRAY['TypeScript', 'Next.js', 'Supabase', 'AES-256', 'Tailwind CSS'],
  true
),
(
  'Vulnerability Scanner',
  'Automated vulnerability assessment tool that scans web applications for common security issues including XSS, SQL injection, and CSRF vulnerabilities.',
  ARRAY['Python', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL'],
  true
),
(
  'E-Commerce Platform',
  'Full-stack e-commerce solution with payment processing, inventory management, and real-time order tracking.',
  ARRAY['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'Vercel'],
  false
);

-- Insert education
INSERT INTO education (institution, degree, field, start_date, end_date, description) VALUES 
(
  'University of Technology',
  'Bachelor of Science',
  'Computer Science',
  '2018-09-01',
  '2022-06-15',
  'Focused on software engineering and systems security. Graduated with honors.'
),
(
  'CyberSec Academy',
  'Professional Certificate',
  'Cybersecurity',
  '2023-01-01',
  '2023-12-15',
  'Comprehensive cybersecurity training covering penetration testing, incident response, and security architecture.'
);

-- Insert social links
INSERT INTO social_links (platform, url, icon, display_order) VALUES 
('GitHub', 'https://github.com', 'github', 1),
('LinkedIn', 'https://linkedin.com', 'linkedin', 2),
('Twitter', 'https://twitter.com', 'twitter', 3),
('Email', 'mailto:hello@example.com', 'mail', 4);

-- Insert sample blog post
INSERT INTO blog_posts (title, slug, content, excerpt, published, author_id) VALUES 
(
  'My Journey from Full Stack to Cybersecurity',
  'journey-fullstack-to-cybersecurity',
  '# My Journey from Full Stack to Cybersecurity

After years of building web applications, I decided to pivot my career towards cybersecurity. Here''s why and how I''m making this transition.

## Why the Switch?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. As a full-stack developer, I''ve always been fascinated by the security aspects of the applications I build. Every time I implemented authentication, handled user data, or set up database permissions, I found myself diving deeper into security best practices.

## The Learning Path

The transition isn''t as dramatic as it might seem. Many skills transfer directly:

- **Understanding code** helps in analyzing vulnerabilities
- **System architecture knowledge** is crucial for security assessments
- **Problem-solving skills** are essential in incident response

## What''s Next?

I''m currently focusing on:
1. Penetration testing certifications
2. Learning more about network security
3. Building security tools

Stay tuned for more updates on my journey!',
  'After years of building web applications, I decided to pivot my career towards cybersecurity. Here''s why and how I''m making this transition.',
  true,
  '00000000-0000-0000-0000-000000000000'
);
