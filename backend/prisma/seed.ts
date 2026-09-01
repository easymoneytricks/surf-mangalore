import { ContactMessageStatus, PrismaClient, PublishStatus, UserRole, Visibility } from '@prisma/client'

import { hashPassword } from '../src/lib/password'
import { env } from '../src/config/env'

const prisma = new PrismaClient()

function getSeedPassword() {
  if (!env.SEED_ADMIN_PASSWORD) {
    throw new Error('SEED_ADMIN_PASSWORD must be set explicitly before running the development seed')
  }

  return env.SEED_ADMIN_PASSWORD
}

async function upsertDefaultLocale() {
  await prisma.locale.upsert({
    where: { code: 'en' },
    update: {
      name: 'English',
      isDefault: true,
      status: 'active',
    },
    create: {
      code: 'en',
      name: 'English',
      isDefault: true,
      status: 'active',
    },
  })
}

async function upsertDefaultSuperAdmin() {
  const passwordHash = await hashPassword(getSeedPassword())

  await prisma.adminUser.upsert({
    where: {
      email: 'admin@surfmangalore.com',
    },
    update: {
      name: 'Surf Mangalore Admin',
      slug: 'surf-mangalore-admin',
      userRole: UserRole.SUPER_ADMIN,
      status: 'active',
      mustChangePassword: true,
    },
    create: {
      slug: 'surf-mangalore-admin',
      name: 'Surf Mangalore Admin',
      email: 'admin@surfmangalore.com',
      passwordHash,
      userRole: UserRole.SUPER_ADMIN,
      status: 'active',
      mustChangePassword: true,
    },
  })
}

function humanize(value: string) {
  return value.replaceAll('-', ' ').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const ACCESS_CONTROL_RESOURCES = [
  { resource: 'dashboard', title: 'Dashboard', actions: ['view'] as const },
  { resource: 'users', title: 'Users', actions: ['view', 'create', 'edit', 'delete', 'manage'] as const },
  { resource: 'roles', title: 'Roles', actions: ['view', 'create', 'edit', 'delete', 'manage'] as const },
  { resource: 'permissions', title: 'Permissions', actions: ['view', 'edit', 'manage'] as const },
  { resource: 'coaches', title: 'Coaches', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'lessons', title: 'Lessons', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'experiences', title: 'Experiences', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'events', title: 'Events', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'bookings', title: 'Bookings', actions: ['view', 'edit', 'manage'] as const },
  { resource: 'gallery', title: 'Gallery', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'testimonials', title: 'Testimonials', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'faqs', title: 'FAQs', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'contact-messages', title: 'Contact Messages', actions: ['view', 'edit', 'delete', 'manage'] as const },
  { resource: 'seo', title: 'SEO', actions: ['view', 'edit', 'manage'] as const },
  { resource: 'site-settings', title: 'Site Settings', actions: ['view', 'edit', 'manage'] as const },
  { resource: 'media', title: 'Media', actions: ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const },
  { resource: 'audit-logs', title: 'Audit Logs', actions: ['view'] as const },
] as const

async function upsertAccessControlRolesAndPermissions() {
  const permissions = [] as Array<{ slug: string; id: number; resource: string; action: string }>

  for (const entry of ACCESS_CONTROL_RESOURCES) {
    for (const action of entry.actions) {
      const slug = `${entry.resource}.${action}`
      const permission = await prisma.permission.upsert({
        where: { slug },
        update: {
          name: `${humanize(action)} ${entry.title}`,
          title: `${humanize(action)} ${entry.title}`,
          description: `Allows ${action} access to ${entry.title.toLowerCase()}`,
          resource: entry.resource,
          action,
          status: 'active',
        },
        create: {
          slug,
          name: `${humanize(action)} ${entry.title}`,
          title: `${humanize(action)} ${entry.title}`,
          description: `Allows ${action} access to ${entry.title.toLowerCase()}`,
          resource: entry.resource,
          action,
          status: 'active',
        },
      })

      permissions.push({ slug, id: permission.id, resource: entry.resource, action })
    }
  }

  const roleDefinitions = [
    {
      slug: 'super-admin',
      name: 'SUPER_ADMIN',
      title: 'Super Admin',
      description: 'Full access across the Surf Mangalore platform.',
      isSystem: true,
      permissions: permissions.map((entry) => entry.id),
    },
    {
      slug: 'admin',
      name: 'ADMIN',
      title: 'Admin',
      description: 'Operational access across the CMS with security-aware restrictions.',
      isSystem: true,
      permissions: permissions.filter((entry) => entry.resource !== 'audit-logs' || entry.action === 'view').map((entry) => entry.id),
    },
    {
      slug: 'editor',
      name: 'EDITOR',
      title: 'Editor',
      description: 'Content publishing access without access-control administration.',
      isSystem: true,
      permissions: permissions.filter((entry) => ['dashboard', 'coaches', 'lessons', 'experiences', 'events', 'gallery', 'testimonials', 'faqs', 'media'].includes(entry.resource)).map((entry) => entry.id),
    },
    {
      slug: 'content-manager',
      name: 'CONTENT_MANAGER',
      title: 'Content Manager',
      description: 'Extended content access for publishing and media workflows.',
      isSystem: true,
      permissions: permissions.filter((entry) => ['dashboard', 'coaches', 'lessons', 'experiences', 'events', 'gallery', 'testimonials', 'faqs', 'contact-messages', 'media'].includes(entry.resource)).map((entry) => entry.id),
    },
    {
      slug: 'manager',
      name: 'MANAGER',
      title: 'Manager',
      description: 'Cross-functional operations role for bookings and customer communications.',
      isSystem: false,
      permissions: permissions.filter((entry) => ['dashboard', 'bookings', 'contact-messages', 'events', 'testimonials', 'faqs'].includes(entry.resource) && ['view', 'edit', 'manage'].includes(entry.action)).map((entry) => entry.id),
    },
    {
      slug: 'viewer',
      name: 'VIEWER',
      title: 'Viewer',
      description: 'Read-only access to dashboard insights.',
      isSystem: true,
      permissions: permissions.filter((entry) => entry.resource === 'dashboard' && entry.action === 'view').map((entry) => entry.id),
    },
    {
      slug: 'support',
      name: 'SUPPORT',
      title: 'Support',
      description: 'Bookings and contact message handling.',
      isSystem: true,
      permissions: permissions.filter((entry) => ['dashboard', 'bookings', 'contact-messages'].includes(entry.resource) && ['view', 'edit', 'manage'].includes(entry.action)).map((entry) => entry.id),
    },
    {
      slug: 'operations',
      name: 'OPERATIONS',
      title: 'Operations',
      description: 'Operational access for bookings and guest enquiries.',
      isSystem: true,
      permissions: permissions.filter((entry) => ['dashboard', 'bookings', 'contact-messages'].includes(entry.resource) && ['view', 'edit', 'manage'].includes(entry.action)).map((entry) => entry.id),
    },
  ]

  for (const role of roleDefinitions) {
    const roleRecord = await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        title: role.title,
        description: role.description,
        status: 'active',
        isSystem: role.isSystem,
      },
      create: {
        slug: role.slug,
        name: role.name,
        title: role.title,
        description: role.description,
        status: 'active',
        isSystem: role.isSystem,
      },
    })

    await prisma.rolePermission.deleteMany({
      where: { roleId: roleRecord.id },
    })

    if (role.permissions.length) {
      await prisma.rolePermission.createMany({
        data: role.permissions.map((permissionId) => ({ roleId: roleRecord.id, permissionId })),
      })
    }
  }

  return { permissions, roleDefinitions }
}

async function upsertSampleAdminUsers() {
  const passwordHash = await hashPassword(getSeedPassword())
  const sampleUsers = [
    { email: 'admin@surfmangalore.com', slug: 'surf-mangalore-admin', name: 'Surf Mangalore Admin', userRole: UserRole.SUPER_ADMIN, status: 'active' },
    { email: 'operations@surfmangalore.com', slug: 'surf-mangalore-operations', name: 'Surf Mangalore Admin Ops', userRole: UserRole.ADMIN, status: 'active' },
    { email: 'editor@surfmangalore.com', slug: 'surf-mangalore-editor', name: 'Surf Mangalore Content Editor', userRole: UserRole.EDITOR, status: 'active' },
  ]

  for (const user of sampleUsers) {
    const record = await prisma.adminUser.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        slug: user.slug,
        userRole: user.userRole,
        status: user.status,
        mustChangePassword: true,
      },
      create: {
        slug: user.slug,
        name: user.name,
        email: user.email,
        passwordHash,
        userRole: user.userRole,
        status: user.status,
        mustChangePassword: true,
      },
    })

    const roleSlug = user.userRole.toLowerCase().replaceAll('_', '-')
    const role = await prisma.role.findFirst({ where: { slug: roleSlug } })
    if (role) {
      await prisma.adminUserRole.deleteMany({ where: { adminUserId: record.id } })
      await prisma.adminUserRole.create({ data: { adminUserId: record.id, roleId: role.id } })
    }
  }
}

async function upsertSampleAuditLogs() {
  const existingCount = await prisma.auditLog.count()
  if (existingCount > 0) {
    return
  }

  const actor = await prisma.adminUser.findFirst({
    where: { email: 'admin@surfmangalore.com' },
  })

  if (!actor) {
    return
  }

  await prisma.auditLog.createMany({
    data: [
      { actorId: actor.id, action: 'LOGIN', resourceType: 'AUTH_SESSION', resourceId: 'seed-login', description: 'Seeded login activity for the protected super admin', ipAddress: '127.0.0.1', userAgent: 'Prisma seed' },
      { actorId: actor.id, action: 'CREATE', resourceType: 'USER', resourceId: 'seed-user-1', description: 'Created sample admin user', ipAddress: '127.0.0.1', userAgent: 'Prisma seed' },
      { actorId: actor.id, action: 'CREATE', resourceType: 'ROLE', resourceId: 'seed-role-1', description: 'Created sample admin role', ipAddress: '127.0.0.1', userAgent: 'Prisma seed' },
      { actorId: actor.id, action: 'UPDATE', resourceType: 'ROLE_PERMISSIONS', resourceId: 'seed-role-1', description: 'Updated permissions for seeded role', ipAddress: '127.0.0.1', userAgent: 'Prisma seed' },
      { actorId: actor.id, action: 'UPDATE', resourceType: 'SITE_SETTINGS', resourceId: 'seed-settings', description: 'Updated site settings during bootstrap', ipAddress: '127.0.0.1', userAgent: 'Prisma seed' },
    ],
  })
}

async function upsertSampleCoaches() {
  const sampleCoaches = [
    {
      slug: 'arjun-nair',
      name: 'Arjun Nair',
      title: 'Lead Surf Coach',
      shortBio: 'Calm progression coach focused on confident first rides and ocean reading.',
      fullBio: 'Arjun has coached beginners and intermediate surfers across the west coast for over a decade, with a method built around confidence, timing, and ocean awareness.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?auto=format&fit=crop&w=900&q=80',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80',
      specialization: ['Beginner coaching', 'Wave timing', 'Ocean safety'],
      languages: ['English', 'Hindi', 'Kannada'],
      certifications: ['ISA Level 1', 'Lifeguard certified'],
      yearsExperience: 11,
      email: 'arjun.nair@surfmangalore.com',
      phone: '+91-90000-11001',
      instagramUrl: 'https://instagram.com/arjun.surf',
      facebookUrl: 'https://facebook.com/arjun.surf',
      websiteUrl: 'https://surfmangalore.com/coaches/arjun-nair',
      status: 'active',
      publishStatus: PublishStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      slug: 'meera-shetty',
      name: 'Meera Shetty',
      title: 'Technique and Mobility Coach',
      shortBio: 'Precision-first surf instructor for posture, paddling, and clean pop-ups.',
      fullBio: 'Meera blends technical instruction with practical drills in and out of water to help guests surf longer with better form and less fatigue.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=80',
      specialization: ['Paddling mechanics', 'Pop-up drills', 'Intermediate progression'],
      languages: ['English', 'Kannada'],
      certifications: ['ISA Level 1'],
      yearsExperience: 8,
      email: 'meera.shetty@surfmangalore.com',
      phone: '+91-90000-11002',
      instagramUrl: 'https://instagram.com/meera.surf',
      facebookUrl: 'https://facebook.com/meera.surf',
      websiteUrl: 'https://surfmangalore.com/coaches/meera-shetty',
      status: 'active',
      publishStatus: PublishStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      isFeatured: true,
      displayOrder: 2,
    },
    {
      slug: 'ravi-prakash',
      name: 'Ravi Prakash',
      title: 'Surf Fitness Coach',
      shortBio: 'Build strength, timing, and endurance for consistent wave control.',
      fullBio: 'Ravi focuses on strength-to-technique transfer, helping learners convert training into measurable gains in paddling speed and ride stability.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1549049950-48d5887197a0?auto=format&fit=crop&w=900&q=80',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80',
      specialization: ['Surf fitness', 'Conditioning plans', 'Breath control'],
      languages: ['English', 'Hindi'],
      certifications: ['Functional Movement Specialist'],
      yearsExperience: 6,
      email: 'ravi.prakash@surfmangalore.com',
      phone: '+91-90000-11003',
      instagramUrl: 'https://instagram.com/ravi.surf',
      facebookUrl: 'https://facebook.com/ravi.surf',
      websiteUrl: 'https://surfmangalore.com/coaches/ravi-prakash',
      status: 'active',
      publishStatus: PublishStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      isFeatured: false,
      displayOrder: 3,
    },
    {
      slug: 'nisha-dsouza',
      name: 'Nisha Dsouza',
      title: 'Kids Program Coach',
      shortBio: 'Patient and fun-focused instructor for young first-time surfers.',
      fullBio: 'Nisha creates structured, age-appropriate sessions that make ocean learning safe, memorable, and confidence-building for children and parents alike.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      specialization: ['Kids surf lessons', 'Safety briefing', 'Confidence building'],
      languages: ['English', 'Konkani'],
      certifications: ['Child safety workshop', 'Lifeguard certified'],
      yearsExperience: 7,
      email: 'nisha.dsouza@surfmangalore.com',
      phone: '+91-90000-11004',
      instagramUrl: 'https://instagram.com/nisha.surf',
      facebookUrl: 'https://facebook.com/nisha.surf',
      websiteUrl: 'https://surfmangalore.com/coaches/nisha-dsouza',
      status: 'active',
      publishStatus: PublishStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      isFeatured: false,
      displayOrder: 4,
    },
    {
      slug: 'kabir-fernandes',
      name: 'Kabir Fernandes',
      title: 'Big Wave Assistant Coach',
      shortBio: 'Supports advanced sessions with safety-first line-up coaching.',
      fullBio: 'Kabir assists larger-condition coaching days with a focus on safe positioning, communication, and confidence in dynamic water movement.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=80',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1400&q=80',
      specialization: ['Advanced positioning', 'Line-up safety', 'Session support'],
      languages: ['English', 'Hindi'],
      certifications: ['Rescue swimming certification'],
      yearsExperience: 5,
      email: 'kabir.fernandes@surfmangalore.com',
      phone: '+91-90000-11005',
      instagramUrl: 'https://instagram.com/kabir.surf',
      facebookUrl: 'https://facebook.com/kabir.surf',
      websiteUrl: 'https://surfmangalore.com/coaches/kabir-fernandes',
      status: 'active',
      publishStatus: PublishStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      isFeatured: false,
      displayOrder: 5,
    },
    ...[
      ['rohan-shetty', 'Rohan Shetty', 'Ocean Safety Coach'],
      ['neha-rao', 'Neha Rao', 'Community Surf Coach'],
      ['kiran-poojary', 'Kiran Poojary', 'Paddle and Fitness Coach'],
      ['ananya-bhat', 'Ananya Bhat', 'Women’s Surf Coach'],
      ['vikram-pai', 'Vikram Pai', 'Advanced Surf Coach'],
    ].map(([slug, name, title], index) => ({ slug, name, title, shortBio: `${title} helping Mangalore guests build confidence, awareness, and stronger ocean habits.`, fullBio: `${name} brings a patient, safety-first approach to coaching across Mangalore’s beaches, with practical guidance tailored to every guest’s goals.`, profilePhotoUrl: `https://images.unsplash.com/photo-${['1500648767791-00dcc994a43e','1507003211169-0a1dd7228f2d','1506794778202-cad84cf45f1d','1534528741775-53994a69daeb','1501196354995-cbb51c65aaea'][index]}?auto=format&fit=crop&w=900&q=80`, coverPhotoUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=80', specialization: ['Ocean safety', 'Guest coaching', 'Wave awareness'], languages: ['English', 'Kannada'], certifications: ['Lifeguard certified'], yearsExperience: 5 + index, email: `${slug}@surfmangalore.com`, phone: `+91-90000-1100${6 + index}`, instagramUrl: `https://instagram.com/${slug}`, facebookUrl: `https://facebook.com/${slug}`, websiteUrl: `https://surfmangalore.com/coaches/${slug}`, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: index === 0, displayOrder: 6 + index })),
  ]

  for (const coach of sampleCoaches) {
    await prisma.coach.upsert({
      where: { slug: coach.slug },
      update: {
        name: coach.name,
        title: coach.title,
        profilePhotoUrl: coach.profilePhotoUrl,
        coverPhotoUrl: coach.coverPhotoUrl,
        shortBio: coach.shortBio,
        fullBio: coach.fullBio,
        description: coach.shortBio,
        specialization: coach.specialization,
        languages: coach.languages,
        certifications: coach.certifications,
        yearsExperience: coach.yearsExperience,
        email: coach.email,
        phone: coach.phone,
        instagramUrl: coach.instagramUrl,
        facebookUrl: coach.facebookUrl,
        websiteUrl: coach.websiteUrl,
        status: coach.status,
        publishStatus: coach.publishStatus,
        visibility: coach.visibility,
        isFeatured: coach.isFeatured,
        displayOrder: coach.displayOrder,
      },
      create: {
        slug: coach.slug,
        name: coach.name,
        title: coach.title,
        profilePhotoUrl: coach.profilePhotoUrl,
        coverPhotoUrl: coach.coverPhotoUrl,
        shortBio: coach.shortBio,
        fullBio: coach.fullBio,
        description: coach.shortBio,
        specialization: coach.specialization,
        languages: coach.languages,
        certifications: coach.certifications,
        yearsExperience: coach.yearsExperience,
        email: coach.email,
        phone: coach.phone,
        instagramUrl: coach.instagramUrl,
        facebookUrl: coach.facebookUrl,
        websiteUrl: coach.websiteUrl,
        status: coach.status,
        publishStatus: coach.publishStatus,
        visibility: coach.visibility,
        isFeatured: coach.isFeatured,
        displayOrder: coach.displayOrder,
      },
    })
  }
}

async function upsertSampleTestimonials() {
  const sampleTestimonials = [
    { slug: 'ananya-mangalore-beginners', authorName: 'Ananya Sharma', authorLocation: 'Mangalore', authorEmail: 'ananya@example.com', quote: 'The beginner session felt safe, calm, and fun. I stood up on my first wave with real confidence.', rating: 5, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: true },
    { slug: 'rahul-beach-day', authorName: 'Rahul Iyer', authorLocation: 'Bangalore', authorEmail: 'rahul@example.com', quote: 'The coaching was clear and the whole team handled timing, boards, and safety really well.', rating: 5, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: true },
    { slug: 'priya-family-surf', authorName: 'Priya Nair', authorLocation: 'Udupi', authorEmail: 'priya@example.com', quote: 'Our family surf day was organized beautifully. The kids felt comfortable from the first minute.', rating: 5, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: false },
    { slug: 'karan-technique-progress', authorName: 'Karan Shetty', authorLocation: 'Mangalore', authorEmail: 'karan@example.com', quote: 'I came for technique help and left with much cleaner paddling, pop-ups, and balance.', rating: 4, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: false },
    { slug: 'megha-private-session', authorName: 'Megha Rao', authorLocation: 'Goa', authorEmail: 'megha@example.com', quote: 'The private session was focused and premium. The instruction felt tailored to exactly what I needed.', rating: 5, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: true },
    { slug: 'sameer-resort-group', authorName: 'Sameer Khan', authorLocation: 'Mysuru', authorEmail: 'sameer@example.com', quote: 'We booked a group session for our team and the communication was excellent start to finish.', rating: 5, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: false },
    { slug: 'divya-sunrise-session', authorName: 'Divya Fernandes', authorLocation: 'Manipal', authorEmail: 'divya@example.com', quote: 'Sunrise surf with the instructors was the best part of our trip. Great energy and great waves.', rating: 5, status: 'inactive', publishStatus: PublishStatus.DRAFT, visibility: Visibility.PUBLIC, isFeatured: false },
    { slug: 'naveen-return-guest', authorName: 'Naveen Kumar', authorLocation: 'Bengaluru', authorEmail: 'naveen@example.com', quote: 'This was my second visit and the experience was even better. Smooth, organized, and memorable.', rating: 4, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, isFeatured: false },
  ]

  for (const testimonial of sampleTestimonials) {
    await prisma.testimonial.upsert({
      where: { slug: testimonial.slug },
      update: {
        name: testimonial.authorName,
        title: testimonial.authorLocation,
        description: testimonial.quote,
        authorName: testimonial.authorName,
        authorEmail: testimonial.authorEmail,
        authorLocation: testimonial.authorLocation,
        quote: testimonial.quote,
        rating: testimonial.rating,
        status: testimonial.status,
        publishStatus: testimonial.publishStatus,
        visibility: testimonial.visibility,
        isFeatured: testimonial.isFeatured,
      },
      create: {
        slug: testimonial.slug,
        name: testimonial.authorName,
        title: testimonial.authorLocation || testimonial.authorName,
        description: testimonial.quote,
        authorName: testimonial.authorName,
        authorEmail: testimonial.authorEmail,
        authorLocation: testimonial.authorLocation,
        quote: testimonial.quote,
        rating: testimonial.rating,
        status: testimonial.status,
        publishStatus: testimonial.publishStatus,
        visibility: testimonial.visibility,
        isFeatured: testimonial.isFeatured,
      },
    })
  }
}

async function upsertSampleFaqs() {
  const sampleFaqs = [
    { slug: 'beginners-can-join', question: 'Can beginners join?', answer: 'Yes. We run beginner-friendly sessions with safety briefings, board support, and plenty of in-water guidance.', sortOrder: 1, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'what-to-bring-surf-session', question: 'What should I bring for a surf session?', answer: 'Bring swimwear, sunscreen, a towel, and a water bottle. We handle the boards and safety gear.', sortOrder: 2, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'lessons-include-equipment', question: 'Do lessons include equipment?', answer: 'Yes. Boards, leashes, and basic safety equipment are included in the standard lesson experience.', sortOrder: 3, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'group-bookings-available', question: 'Can I book for a group?', answer: 'Absolutely. We handle private groups, families, and corporate surf days with a tailored schedule.', sortOrder: 4, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'best-time-to-surf-mangalore', question: 'What is the best time to surf in Mangalore?', answer: 'Morning sessions usually offer the cleanest conditions and the most comfortable weather.', sortOrder: 5, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'kids-lessons-available', question: 'Do you offer lessons for kids?', answer: 'Yes. We offer age-appropriate coaching with extra safety attention and patient, structured instruction.', sortOrder: 6, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'cancellations-and-reschedules', question: 'Can I reschedule a booking?', answer: 'If you need to reschedule, contact us as soon as possible and we will help find the next available slot.', sortOrder: 7, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'private-coaching-option', question: 'Is private coaching available?', answer: 'Yes. Private coaching is available for surfers who want focused progress or a special occasion session.', sortOrder: 8, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'what-about-rentals', question: 'Can I rent a board without a lesson?', answer: 'Board rentals depend on experience and conditions. Reach out and we will guide you to the right option.', sortOrder: 9, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'water-safety-first', question: 'How do you handle water safety?', answer: 'Every session starts with safety checks, local condition review, and coaching that stays close to your experience level.', sortOrder: 10, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'travel-help-available', question: 'Can you help with travel planning?', answer: 'Yes. We can suggest arrival timing, local commute tips, and the best session windows for your schedule.', sortOrder: 11, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'weather-and-tide-updates', question: 'Do you share weather or tide updates?', answer: 'We monitor conditions closely and will let you know if a session needs to move for safety or quality.', sortOrder: 12, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'first-lesson-nerves', question: 'What if I am nervous before my first lesson?', answer: 'That is normal. Our instructors move at your pace and focus on calm, steady progress in the water.', sortOrder: 13, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
    { slug: 'photo-and-video-availability', question: 'Can we take photos or videos during the session?', answer: 'Yes, as long as the conditions are safe and your instructor agrees on the best moment to do so.', sortOrder: 14, status: 'inactive', publishStatus: PublishStatus.DRAFT, visibility: Visibility.PUBLIC },
    { slug: 'special-events-and-camps', question: 'Do you run camps or special events?', answer: 'We occasionally host surf camps, community days, and seasonal events. Check in with the team for the latest dates.', sortOrder: 15, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC },
  ]

  for (const faq of sampleFaqs) {
    await prisma.fAQ.upsert({
      where: { slug: faq.slug },
      update: {
        name: faq.question,
        title: faq.question,
        description: faq.answer,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        status: faq.status,
        publishStatus: faq.publishStatus,
        visibility: faq.visibility,
      },
      create: {
        slug: faq.slug,
        name: faq.question,
        title: faq.question,
        description: faq.answer,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        status: faq.status,
        publishStatus: faq.publishStatus,
        visibility: faq.visibility,
      },
    })
  }
}

async function upsertSampleContactMessages() {
  const sampleMessages = [
    { slug: 'contact-beginner-lesson', name: 'Arun Menon', fullName: 'Arun Menon', email: 'arun@example.com', phone: '+91-98765-10001', subject: 'Beginner lesson for two', message: 'Hi team, I would like to book a beginner surf lesson for me and my sister next weekend.', status: 'NEW', source: 'website' },
    { slug: 'contact-private-group', name: 'Sneha Rao', fullName: 'Sneha Rao', email: 'sneha@example.com', phone: '+91-98765-10002', subject: 'Private group surf day', message: 'We are planning a private group surf day for our team outing and want to know availability.', status: 'IN_REVIEW', source: 'website' },
    { slug: 'contact-kids-camp', name: 'Vikram Pai', fullName: 'Vikram Pai', email: 'vikram@example.com', phone: '+91-98765-10003', subject: 'Kids surf camp dates', message: 'Could you share the next kids surf camp dates and age requirements?', status: 'RESOLVED', source: 'website' },
    { slug: 'contact-board-rental', name: 'Nandita Shetty', fullName: 'Nandita Shetty', email: 'nandita@example.com', phone: '+91-98765-10004', subject: 'Board rental question', message: 'I am staying nearby and wanted to check if board rentals are available without a lesson.', status: 'ARCHIVED', source: 'website' },
    { slug: 'contact-travel-help', name: 'Farhan Khan', fullName: 'Farhan Khan', email: 'farhan@example.com', phone: '+91-98765-10005', subject: 'Travel planning help', message: 'I need help choosing the best time slot around my train arrival. What would you suggest?', status: 'NEW', source: 'website' },
  ]

  for (const message of sampleMessages) {
    await prisma.contactMessage.upsert({
      where: { slug: message.slug },
      update: {
        name: message.name,
        title: message.subject,
        description: message.message,
        fullName: message.fullName,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        status: message.status as ContactMessageStatus,
        source: message.source,
      },
      create: {
        slug: message.slug,
        name: message.name,
        title: message.subject,
        description: message.message,
        fullName: message.fullName,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        status: message.status as ContactMessageStatus,
        source: message.source,
      },
    })
  }
}

async function upsertSampleMediaAndGallery() {
  const beachDayImages = [
    { slug: 'mangalore-sunrise-lineup', title: 'Sunrise lineup', filePath: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', caption: 'Early surf session before the beach gets busy.', altText: 'Surfers waiting in the morning lineup', folderPath: 'gallery/mangalore', tags: ['surf', 'sunrise', 'lesson'] },
    { slug: 'surf-coach-guidance', title: 'Coach guidance', filePath: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=1600&q=80', caption: 'One-on-one instruction in calm conditions.', altText: 'Surf coach helping a learner on the beach', folderPath: 'gallery/lessons', tags: ['coach', 'lesson'] },
    { slug: 'family-session-beach', title: 'Family session', filePath: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80', caption: 'Family-friendly surf days with extra attention to comfort.', altText: 'Family group at the beach before surfing', folderPath: 'gallery/family', tags: ['family', 'group'] },
    { slug: 'board-prep-on-shore', title: 'Board prep', filePath: 'https://images.unsplash.com/photo-1519066629447-267fffa62d4f?auto=format&fit=crop&w=1600&q=80', caption: 'Checking boards before the next lesson starts.', altText: 'Surfboards ready on the sand', folderPath: 'library/general', tags: ['equipment', 'surfboards'] },
    { slug: 'blue-water-action', title: 'Blue water action', filePath: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80', caption: 'Clear conditions and a clean takeoff line.', altText: 'Surfer paddling into a wave', folderPath: 'gallery/action', tags: ['action', 'wave'] },
    { slug: 'group-lesson-briefing', title: 'Group briefing', filePath: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=80', caption: 'Safety and timing guidance before everyone heads out.', altText: 'Instructor briefing a group on the sand', folderPath: 'gallery/groups', tags: ['group', 'safety'] },
    { slug: 'sunset-cleanup', title: 'Sunset cleanup', filePath: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80', caption: 'A calm end to a full day on the water.', altText: 'Sunset beach scene after surf session', folderPath: 'gallery/sunset', tags: ['sunset', 'beach'] },
    { slug: 'coastal-conditions', title: 'Coastal conditions', filePath: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80', caption: 'Reading the water before the first set comes in.', altText: 'Ocean waves rolling toward shore', folderPath: 'gallery/conditions', tags: ['ocean', 'conditions'] },
    { slug: 'lesson-ready-boards', title: 'Lesson-ready boards', filePath: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80', caption: 'Boards lined up for a morning class.', altText: 'Surfboards standing in a row', folderPath: 'gallery/lessons', tags: ['boards', 'lesson'] },
    { slug: 'coastal-ride-overview', title: 'Coastal ride overview', filePath: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', caption: 'Wide beach view for the homepage gallery.', altText: 'A wide coastal surfing scene', folderPath: 'gallery/mangalore', tags: ['coast', 'overview'] },
    { slug: 'panambur-wave-watch', title: 'Panambur wave watch', filePath: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80', caption: 'Reading the first clean sets along the Mangalore coast.', altText: 'Ocean waves near a sandy beach', folderPath: 'gallery/mangalore', tags: ['panambur', 'waves', 'surf'] },
    { slug: 'morning-boardwalk', title: 'Morning boardwalk', filePath: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', caption: 'Quiet early light before the day’s water sessions.', altText: 'Beach horizon in soft morning light', folderPath: 'gallery/sunrise', tags: ['morning', 'coast', 'sunrise'] },
    { slug: 'shoreline-paddle', title: 'Shoreline paddle', filePath: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80', caption: 'A steady paddle out with the shoreline in view.', altText: 'Blue ocean meeting a rocky shoreline', folderPath: 'gallery/action', tags: ['paddle', 'ocean', 'action'] },
    { slug: 'golden-water-session', title: 'Golden water session', filePath: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&w=1600&q=80', caption: 'Warm afternoon light across a relaxed coastal session.', altText: 'Golden sunlight across ocean water', folderPath: 'gallery/sunset', tags: ['golden-hour', 'water', 'sunset'] },
    { slug: 'reef-lineup', title: 'Reef lineup', filePath: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1600&q=80', caption: 'Watching the line and waiting for the right wave.', altText: 'Surfer looking toward an ocean lineup', folderPath: 'gallery/action', tags: ['lineup', 'surf', 'ocean'] },
    { slug: 'coastal-escape', title: 'Coastal escape', filePath: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80', caption: 'A wide coastal view for guests taking a slower beach day.', altText: 'Quiet tropical beach and turquoise water', folderPath: 'gallery/experiences', tags: ['experience', 'beach', 'coast'] },
    { slug: 'board-carry', title: 'Board carry', filePath: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80', caption: 'Carrying boards down for the next guided session.', altText: 'Outdoor path leading toward the coast', folderPath: 'gallery/lessons', tags: ['boards', 'lesson', 'outdoors'] },
    { slug: 'sea-spray-detail', title: 'Sea spray detail', filePath: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1600&q=80', caption: 'Small details that make every ocean morning memorable.', altText: 'Ocean texture and coastal greenery', folderPath: 'gallery/conditions', tags: ['sea', 'texture', 'coast'] },
    { slug: 'open-water-horizon', title: 'Open water horizon', filePath: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80', caption: 'Clear horizon lines on a calm water day.', altText: 'Open blue ocean under a clear sky', folderPath: 'gallery/conditions', tags: ['horizon', 'ocean', 'conditions'] },
    { slug: 'beach-camp-evening', title: 'Beach camp evening', filePath: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80', caption: 'Relaxed conversations after a full day by the water.', altText: 'Beach gathering near the ocean at evening', folderPath: 'gallery/events', tags: ['camp', 'community', 'evening'] },
    { slug: 'tide-and-sky', title: 'Tide and sky', filePath: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80', caption: 'The changing tide sets the rhythm for each outing.', altText: 'Waves rolling beneath a bright coastal sky', folderPath: 'gallery/conditions', tags: ['tide', 'waves', 'sky'] },
    { slug: 'coach-water-briefing', title: 'Coach water briefing', filePath: 'https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=1600&q=80', caption: 'A clear water briefing keeps every group confident and safe.', altText: 'People preparing together near the water', folderPath: 'gallery/groups', tags: ['coach', 'briefing', 'safety'] },
    { slug: 'calm-cove-paddle', title: 'Calm cove paddle', filePath: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80', caption: 'A calm cove makes a welcoming first paddle experience.', altText: 'Paddleboard activity on calm blue water', folderPath: 'gallery/experiences', tags: ['paddle', 'experience', 'water'] },
    { slug: 'after-surf-light', title: 'After-surf light', filePath: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80', caption: 'Soft light settles over the beach after the final ride.', altText: 'Ocean shoreline in evening light', folderPath: 'gallery/sunset', tags: ['after-surf', 'sunset', 'beach'] },
  ]

  const categorySeeds = [
    { slug: 'lessons', name: 'Lessons', shortDescription: 'Beginner and progression lesson moments.', sortOrder: 1 },
    { slug: 'family-sessions', name: 'Family Sessions', shortDescription: 'Relaxed sessions designed for groups and families.', sortOrder: 2 },
    { slug: 'sunrise-surf', name: 'Sunrise Surf', shortDescription: 'Soft light and early water conditions.', sortOrder: 3 },
  ]

  const categories = [] as Array<{ id: number; slug: string }>
  for (const category of categorySeeds) {
    const record = await prisma.galleryCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        title: category.name,
        shortDescription: category.shortDescription,
        description: category.shortDescription,
        status: 'active',
        publishStatus: PublishStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
        isFeatured: category.slug === 'lessons',
        sortOrder: category.sortOrder,
      },
      create: {
        slug: category.slug,
        name: category.name,
        title: category.name,
        shortDescription: category.shortDescription,
        description: category.shortDescription,
        status: 'active',
        publishStatus: PublishStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
        isFeatured: category.slug === 'lessons',
        sortOrder: category.sortOrder,
      },
    })

    categories.push({ id: record.id, slug: record.slug })
  }

  for (const image of beachDayImages) {
    const media = await prisma.media.upsert({
      where: { slug: image.slug },
      update: {
        name: image.title,
        title: image.title,
        description: image.caption,
        status: 'active',
        publishStatus: PublishStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
        mediaType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileName: `${image.slug}.jpg`,
        filePath: image.filePath,
        thumbnailPath: image.filePath,
        folderPath: image.folderPath,
        tags: image.tags,
        caption: image.caption,
        altText: image.altText,
        fileSizeBytes: 250000,
        width: 1600,
        height: 1067,
        usageCount: 1,
      },
      create: {
        slug: image.slug,
        name: image.title,
        title: image.title,
        description: image.caption,
        status: 'active',
        publishStatus: PublishStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
        mediaType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileName: `${image.slug}.jpg`,
        filePath: image.filePath,
        thumbnailPath: image.filePath,
        folderPath: image.folderPath,
        tags: image.tags,
        caption: image.caption,
        altText: image.altText,
        fileSizeBytes: 250000,
        width: 1600,
        height: 1067,
        usageCount: 1,
      },
    })

    await prisma.galleryImage.upsert({
      where: { slug: image.slug },
      update: {
        name: image.title,
        title: image.title,
        altText: image.altText,
        caption: image.caption,
        description: image.caption,
        photographer: 'Surf Mangalore Team',
        tags: image.tags,
        status: 'active',
        publishStatus: PublishStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
        isFeatured: image.slug.includes('sunrise') || image.slug.includes('action'),
        categoryId: categories.find((category) => category.slug === 'lessons')?.id,
        mediaId: media.id,
        sortOrder: beachDayImages.findIndex((entry) => entry.slug === image.slug) + 1,
      },
      create: {
        slug: image.slug,
        name: image.title,
        title: image.title,
        altText: image.altText,
        caption: image.caption,
        description: image.caption,
        photographer: 'Surf Mangalore Team',
        tags: image.tags,
        status: 'active',
        publishStatus: PublishStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
        isFeatured: image.slug.includes('sunrise') || image.slug.includes('action'),
        category: categories.find((category) => category.slug === 'lessons') ? { connect: { id: categories.find((category) => category.slug === 'lessons')!.id } } : undefined,
        media: { connect: { id: media.id } },
        sortOrder: beachDayImages.findIndex((entry) => entry.slug === image.slug) + 1,
      },
    })
  }
}

async function upsertSampleBookableProducts() {
  const future = new Date()
  future.setUTCDate(future.getUTCDate() + 14)
  const dates = [0, 3, 7].map((offset) => { const date = new Date(future); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10) })
  const lessonTitles = ['Beginner Surf Foundations', 'Intermediate Surf Progression', 'Advanced Surf Performance', 'Private One-to-One Surf Coaching', 'Kids Surf Starter Program', 'Family Surf Lesson', 'Women’s Beginner Surf Session', 'Weekend Surf Training Program', 'Wave Reading & Ocean Skills', 'Pop-Up & Board Control Clinic']
  for (const [index, title] of lessonTitles.entries()) { const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); const data = { name: title, title, shortDescription: `Professional Mangalore coaching for ${title.toLowerCase()}.`, description: `A structured training package with safety briefing, coached water time, and practical feedback.`, status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, level: index < 2 ? 'BEGINNER' : index < 4 ? 'INTERMEDIATE' : 'ALL_LEVELS', difficulty: index < 2 ? 'BEGINNER' : index < 4 ? 'INTERMEDIATE' : 'ALL_LEVELS', duration: index === 3 ? '90 minutes' : '2 hours', durationMinutes: index === 3 ? 90 : 120, price: 1800 + index * 350, maxParticipants: index === 3 ? 1 : index === 4 ? 5 : 6, instructor: ['Arjun Nair', 'Meera Shetty', 'Vikram Pai', 'Rohan Shetty'][index % 4], coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80', isFeatured: index < 3, displayOrder: index + 1 }; await prisma.lesson.upsert({ where: { slug }, update: data, create: { slug, ...data } }) }
  const experienceTitles = ['Sunrise Surf Experience', 'Sunset Surf Experience', 'Beginner Snorkeling Experience', 'Coastal Kayaking Adventure', 'Stand-Up Paddleboarding Experience', 'River & Backwater Paddle Tour', 'Surf & Beach Day Experience', 'Private Group Surf Experience', 'Coastal Exploration Experience', 'Weekend Ocean Adventure']
  for (const [index, title] of experienceTitles.entries()) { const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); const availability = dates.map((date, dayIndex) => ({ date, isActive: true, slots: [{ startTime: dayIndex === 2 ? '15:30' : '07:00', endTime: dayIndex === 2 ? '17:30' : '09:00', capacity: 8 + (index % 4), isActive: true }, { startTime: '09:30', endTime: '11:30', capacity: 8 + (index % 4), isActive: true }] })); const data = { name: title, title, shortDescription: `A guided Mangalore water adventure: ${title.toLowerCase()}.`, description: 'A carefully paced activity with local guidance, equipment, and a clear safety briefing.', status: 'active', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, difficulty: index < 2 ? 'BEGINNER' : 'ALL_LEVELS', duration: '2 hours', durationMinutes: 120, basePrice: 2200 + index * 250, maxParticipants: 8 + (index % 4), instructor: ['Neha Rao', 'Kiran Poojary', 'Ananya Bhat'][index % 3], coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', metadata: { availability }, isFeatured: index < 2, displayOrder: index + 1 }; await prisma.experience.upsert({ where: { slug }, update: data, create: { slug, ...data } }) }
  const eventTitles = ['Mangalore Open Surf Challenge', 'Weekend Beach Surf Camp', 'Monsoon Surf Meetup', 'Coastal Cleanup & Surf Day', 'Beginner Surf Community Day', 'Sunset Paddle Gathering', 'Surf Photography Workshop', 'Ocean Safety Workshop', 'Junior Surfers Weekend', 'Mangalore Surf Festival']
  for (const [index, title] of eventTitles.entries()) { const starts = new Date(future); starts.setUTCDate(starts.getUTCDate() + index * 4); starts.setUTCHours(4 + (index % 3), 30, 0, 0); const ends = new Date(starts.getTime() + (index === 1 ? 6 : 2) * 60 * 60 * 1000); const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); const data = { name: title, title, shortDescription: `A fixed-schedule Mangalore event: ${title.toLowerCase()}.`, description: 'A welcoming, professionally coordinated event with a fixed programme and on-site support.', status: 'active', eventStatus: 'SCHEDULED', publishStatus: PublishStatus.PUBLISHED, visibility: Visibility.PUBLIC, eventStartsAt: starts, eventEndsAt: ends, startTimeLabel: starts.toISOString().slice(11, 16), endTimeLabel: ends.toISOString().slice(11, 16), basePrice: 1200 + index * 150, capacityMax: 30 + index * 2, locationName: 'Panambur Beach, Mangalore', coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80', isFeatured: index < 2 }; await prisma.event.upsert({ where: { slug }, update: data, create: { slug, ...data } }) }
  const coaches = await prisma.coach.findMany({ where: { slug: { in: ['arjun-nair', 'meera-shetty', 'ravi-prakash', 'nisha-dsouza', 'kabir-fernandes', 'rohan-shetty', 'neha-rao', 'kiran-poojary', 'ananya-bhat', 'vikram-pai'] } }, select: { id: true } })
  const lessons = await prisma.lesson.findMany({ where: { slug: { in: lessonTitles.map((title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) } }, select: { id: true } })
  const experiences = await prisma.experience.findMany({ where: { slug: { in: experienceTitles.map((title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) } }, select: { id: true } })
  for (const [index, lesson] of lessons.entries()) { const coach = coaches[index % coaches.length]; if (coach) await prisma.lessonCoach.upsert({ where: { lessonId_coachId: { lessonId: lesson.id, coachId: coach.id } }, update: { isPrimary: true }, create: { lessonId: lesson.id, coachId: coach.id, isPrimary: true } }) }
  for (const [index, experience] of experiences.entries()) { const coach = coaches[index % coaches.length]; if (coach) await prisma.coachExperience.upsert({ where: { coachId_experienceId: { coachId: coach.id, experienceId: experience.id } }, update: { isPrimary: true }, create: { coachId: coach.id, experienceId: experience.id, isPrimary: true } }) }
}

async function main() {
  if (env.NODE_ENV === 'production') {
    throw new Error('Refusing to run the development seed script in production')
  }

  await upsertDefaultLocale()
  await upsertDefaultSuperAdmin()
  await upsertAccessControlRolesAndPermissions()
  await upsertSampleAdminUsers()
  await upsertSampleAuditLogs()
  await upsertSampleCoaches()
  await upsertSampleTestimonials()
  await upsertSampleFaqs()
  await upsertSampleContactMessages()
  await upsertSampleMediaAndGallery()
  await upsertSampleBookableProducts()
}

main()
  .catch((error) => {
    console.error('Seed failed', error)
    throw error
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
