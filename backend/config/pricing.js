const services = {
  quickshoot: {
    label: 'Quick Shoot Desk',
    description: 'Low-entry mini shoots for profiles, students, families, creators, product snaps, and instant social posts.',
    packages: {
      basic: { label: 'One Shot', price: 149, includes: ['1 final photo', 'basic crop and tone', 'fast delivery'] },
      standard: { label: '2 + 2 Edit', price: 299, includes: ['2 minute shoot', '2 minute edit', 'approx 5 minute output'] },
      premium: { label: 'Creator Mini', price: 999, includes: ['15 minute shoot', '5 edited outputs', 'reel-ready frames'] }
    }
  },
  wedding: {
    label: 'Wedding Story Coverage',
    description: 'Simple wedding coverage for rituals, family portraits, reception moments, and full-day memories with clear deliverables.',
    packages: {
      basic: { label: 'Family Basic', price: 9999, includes: ['1 photographer', '4 hours', '120 edited photos'] },
      standard: { label: 'Full Function', price: 24999, includes: ['photo team', '8 hours', '300 edited photos', 'album option'] },
      premium: { label: 'Photo + Video', price: 44999, includes: ['photo and video team', '10 hours', '500 edited photos', 'highlight video'] }
    }
  },
  prewedding: {
    label: 'Pre-Wedding Editorial',
    description: 'Couple portraits and cinematic frames with simple location planning for budgets from small to full creative shoots.',
    packages: {
      basic: { label: 'Simple Couple', price: 4999, includes: ['1 location', '90 minutes', '35 edited photos'] },
      standard: { label: 'Golden Hour', price: 9999, includes: ['2 locations', '3 hours', '90 edited photos'] },
      premium: { label: 'Cinematic Couple', price: 19999, includes: ['3 locations', '5 hours', '180 edited photos', 'reel cut'] }
    }
  },
  birthday: {
    label: 'Birthday Celebration',
    description: 'Warm candid coverage for kids, families, decor, cake moments, stage moments, and clean group portraits.',
    packages: {
      basic: { label: 'Home Party', price: 2499, includes: ['90 minutes', '35 edited photos'] },
      standard: { label: 'Celebration', price: 5999, includes: ['3 hours', '100 edited photos', 'group portraits'] },
      premium: { label: 'Photo + Reel', price: 11999, includes: ['5 hours', '180 edited photos', 'short video highlights'] }
    }
  },
  personal: {
    label: 'Personal Portfolio',
    description: 'Modern portraits for creators, models, founders, profiles, personal branding, and milestone announcements.',
    packages: {
      basic: { label: 'Profile', price: 999, includes: ['1 outfit', '8 edited photos'] },
      standard: { label: 'Creator', price: 2999, includes: ['2 outfits', '30 edited photos', 'retouching'] },
      premium: { label: 'Brand Story', price: 7999, includes: ['4 outfits', '80 edited photos', 'location planning'] }
    }
  },
  reel: {
    label: 'Reel Production',
    description: 'Short-form vertical videos for creators, businesses, launches, events, and social media campaigns.',
    packages: {
      basic: { label: 'Quick Reel', price: 699, includes: ['15 second reel', '1 setup', 'fast mobile edit'] },
      standard: { label: 'Social Pack', price: 2499, includes: ['30-45 second reel', '2 setups', 'music sync'] },
      premium: { label: 'Campaign', price: 6999, includes: ['up to 90 seconds', '3 setups', 'motion effects'] }
    }
  },
  editing: {
    label: 'Post-Production Suite',
    description: 'Photo retouching, color grading, album layouts, reel edits, video cuts, and delivery-ready finishing.',
    packages: {
      basic: { label: 'Clean Edit', price: 299, includes: ['5 photos', 'basic color correction'] },
      standard: { label: 'Pro Edit', price: 1499, includes: ['35 photos', 'retouching', 'color grade'] },
      premium: { label: 'Album Ready', price: 4999, includes: ['100 photos', 'retouching', 'album layout'] }
    }
  }
};

const addOns = {
  droneCoverage: { label: 'Drone coverage', price: 2500 },
  sameDayEdit: { label: 'Same day edit', price: 999 },
  extraPhotographer: { label: 'Extra photographer', price: 3000 },
  extraHour: { label: 'Extra hour', price: 799 },
  luxuryAlbum: { label: 'Printed album', price: 2500 }
};

module.exports = { services, addOns };
