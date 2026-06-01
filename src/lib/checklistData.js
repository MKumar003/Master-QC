export const checklistTemplates = {
  branding: {
    sectionName: 'Branding Check',
    icon: '🏷️',
    items: [
      { name: 'Logo is correct and updated version', checked: false, notes: '' },
      { name: 'Logo alignment is proper', checked: false, notes: '' },
      { name: 'Logo size is consistent', checked: false, notes: '' },
      { name: 'Logo is not stretched or distorted', checked: false, notes: '' },
      { name: 'Brand colors are correct', checked: false, notes: '' },
      { name: 'Brand fonts are used correctly', checked: false, notes: '' },
      { name: 'Brand guidelines are followed', checked: false, notes: '' },
      { name: 'Watermarks are properly placed', checked: false, notes: '' },
      { name: 'No unauthorized logos visible', checked: false, notes: '' },
    ],
  },
  textContent: {
    sectionName: 'Text & Content Check',
    icon: '📝',
    items: [
      { name: 'No spelling mistakes', checked: false, notes: '' },
      { name: 'No grammar mistakes', checked: false, notes: '' },
      { name: 'No punctuation errors', checked: false, notes: '' },
      { name: 'Correct capitalization', checked: false, notes: '' },
      { name: 'Correct date and time format', checked: false, notes: '' },
      { name: 'Correct phone numbers', checked: false, notes: '' },
      { name: 'Correct email addresses', checked: false, notes: '' },
      { name: 'Correct website URLs', checked: false, notes: '' },
      { name: 'Correct product names', checked: false, notes: '' },
      { name: 'Correct company names', checked: false, notes: '' },
      { name: 'Correct pricing information', checked: false, notes: '' },
      { name: 'Correct offers and discounts', checked: false, notes: '' },
      { name: 'CTA (Call-to-Action) is accurate', checked: false, notes: '' },
    ],
  },
  visualDesign: {
    sectionName: 'Visual Design Check',
    icon: '🎨',
    items: [
      { name: 'Proper alignment of all elements', checked: false, notes: '' },
      { name: 'Consistent spacing and margins', checked: false, notes: '' },
      { name: 'Proper hierarchy of information', checked: false, notes: '' },
      { name: 'Design is balanced and clean', checked: false, notes: '' },
      { name: 'No overlapping elements', checked: false, notes: '' },
      { name: 'No cropped text or graphics', checked: false, notes: '' },
      { name: 'Proper icon usage', checked: false, notes: '' },
      { name: 'Images are high quality', checked: false, notes: '' },
      { name: 'No pixelation or blurriness', checked: false, notes: '' },
      { name: 'No unwanted artifacts', checked: false, notes: '' },
    ],
  },
  colorVisibility: {
    sectionName: 'Color & Visibility Check',
    icon: '🌈',
    items: [
      { name: 'Brand colors are accurate', checked: false, notes: '' },
      { name: 'Text has sufficient contrast', checked: false, notes: '' },
      { name: 'Background does not affect readability', checked: false, notes: '' },
      { name: 'Elements are visible on all screens', checked: false, notes: '' },
      { name: 'No color mismatches', checked: false, notes: '' },
      { name: 'Consistent color usage throughout', checked: false, notes: '' },
      { name: 'Accessibility-friendly color combinations', checked: false, notes: '' },
    ],
  },
  photoSpecific: {
    sectionName: 'Photo-Specific QC',
    icon: '📷',
    forType: 'photo',
    items: [
      { name: 'High resolution', checked: false, notes: '' },
      { name: 'Proper focus', checked: false, notes: '' },
      { name: 'Sharp details', checked: false, notes: '' },
      { name: 'No motion blur', checked: false, notes: '' },
      { name: 'Correct exposure', checked: false, notes: '' },
      { name: 'No excessive noise/grain', checked: false, notes: '' },
      { name: 'Subject properly centered/aligned', checked: false, notes: '' },
      { name: 'No distracting background elements', checked: false, notes: '' },
      { name: 'Proper framing', checked: false, notes: '' },
      { name: 'Rule of thirds followed (if required)', checked: false, notes: '' },
      { name: 'Skin tones look natural', checked: false, notes: '' },
      { name: 'No editing artifacts', checked: false, notes: '' },
      { name: 'Proper color correction', checked: false, notes: '' },
      { name: 'Consistent brightness and contrast', checked: false, notes: '' },
      { name: 'Background removal is clean', checked: false, notes: '' },
    ],
  },
  videoSpecific: {
    sectionName: 'Video-Specific QC',
    icon: '🎬',
    forType: 'video',
    items: [
      { name: 'Correct resolution (1080p, 2K, 4K, etc.)', checked: false, notes: '' },
      { name: 'Correct aspect ratio (16:9, 9:16, 1:1, etc.)', checked: false, notes: '' },
      { name: 'Smooth playback', checked: false, notes: '' },
      { name: 'No frame drops', checked: false, notes: '' },
      { name: 'No flickering', checked: false, notes: '' },
      { name: 'Proper stabilization', checked: false, notes: '' },
      { name: 'No black frames', checked: false, notes: '' },
      { name: 'No frozen frames', checked: false, notes: '' },
      { name: 'No unwanted objects visible', checked: false, notes: '' },
      { name: 'Proper transitions', checked: false, notes: '' },
      { name: 'Consistent color grading', checked: false, notes: '' },
      { name: 'Graphics appear correctly', checked: false, notes: '' },
    ],
  },
  audioReview: {
    sectionName: 'Audio Review',
    icon: '🔊',
    forType: 'video',
    items: [
      { name: 'Audio is clear', checked: false, notes: '' },
      { name: 'No background noise', checked: false, notes: '' },
      { name: 'No distortion', checked: false, notes: '' },
      { name: 'Volume levels are balanced', checked: false, notes: '' },
      { name: 'Music levels are appropriate', checked: false, notes: '' },
      { name: 'Voice is understandable', checked: false, notes: '' },
      { name: 'No audio clipping', checked: false, notes: '' },
      { name: 'Audio sync is correct', checked: false, notes: '' },
    ],
  },
  subtitleReview: {
    sectionName: 'Subtitle Review',
    icon: '💬',
    forType: 'video',
    items: [
      { name: 'Correct spelling', checked: false, notes: '' },
      { name: 'Correct timing', checked: false, notes: '' },
      { name: 'Proper positioning', checked: false, notes: '' },
      { name: 'No subtitle cut-off', checked: false, notes: '' },
      { name: 'Readable font size', checked: false, notes: '' },
    ],
  },
  socialMedia: {
    sectionName: 'Social Media QC',
    icon: '📱',
    items: [
      { name: 'Platform dimensions are correct', checked: false, notes: '' },
      { name: 'Thumbnail is attractive', checked: false, notes: '' },
      { name: 'Safe zone followed', checked: false, notes: '' },
      { name: 'Important elements are not cropped', checked: false, notes: '' },
      { name: 'Captions are correct', checked: false, notes: '' },
      { name: 'Hashtags are correct', checked: false, notes: '' },
      { name: 'Links are working', checked: false, notes: '' },
      { name: 'Tags/Mentions are correct', checked: false, notes: '' },
    ],
  },
  motionGraphics: {
    sectionName: 'Motion Graphics QC',
    icon: '✨',
    forType: 'video',
    items: [
      { name: 'Animations are smooth', checked: false, notes: '' },
      { name: 'Timing is correct', checked: false, notes: '' },
      { name: 'No sudden jumps', checked: false, notes: '' },
      { name: 'Keyframes are clean', checked: false, notes: '' },
      { name: 'Motion blur is correct', checked: false, notes: '' },
      { name: 'Graphic elements are aligned', checked: false, notes: '' },
      { name: 'End screen is correct', checked: false, notes: '' },
    ],
  },
  complianceLegal: {
    sectionName: 'Compliance & Legal Check',
    icon: '⚖️',
    items: [
      { name: 'Copyright-approved assets used', checked: false, notes: '' },
      { name: 'Licensed music used', checked: false, notes: '' },
      { name: 'Stock images/videos licensed', checked: false, notes: '' },
      { name: 'Privacy-sensitive information removed', checked: false, notes: '' },
      { name: 'Legal disclaimer included (if required)', checked: false, notes: '' },
      { name: 'Trademark usage is correct', checked: false, notes: '' },
    ],
  },
  finalExport: {
    sectionName: 'Final Export QC',
    icon: '📤',
    items: [
      { name: 'Correct file format (MP4, MOV, JPG, PNG, etc.)', checked: false, notes: '' },
      { name: 'Correct file size', checked: false, notes: '' },
      { name: 'Correct naming convention', checked: false, notes: '' },
      { name: 'Export settings verified', checked: false, notes: '' },
      { name: 'No compression issues', checked: false, notes: '' },
      { name: 'Final review completed', checked: false, notes: '' },
    ],
  },
  finalApproval: {
    sectionName: 'Final Approval',
    icon: '✅',
    items: [
      { name: 'Branding Approved', checked: false, notes: '' },
      { name: 'Content Approved', checked: false, notes: '' },
      { name: 'Design Approved', checked: false, notes: '' },
      { name: 'Audio Approved', checked: false, notes: '' },
      { name: 'Video Approved', checked: false, notes: '' },
      { name: 'Legal Approved', checked: false, notes: '' },
      { name: 'Client Approved', checked: false, notes: '' },
      { name: 'Final Export Approved', checked: false, notes: '' },
    ],
  },
}

export function getChecklistForType(type) {
  const result = {}
  for (const [key, section] of Object.entries(checklistTemplates)) {
    if (!section.forType || section.forType === type) {
      result[key] = {
        sectionName: section.sectionName,
        icon: section.icon,
        items: section.items.map(item => ({ ...item })),
      }
    }
  }
  return result
}

export function calculateProgress(checklistData) {
  let total = 0
  let checked = 0
  for (const section of Object.values(checklistData)) {
    for (const item of section.items) {
      total++
      if (item.checked) checked++
    }
  }
  return total > 0 ? Math.round((checked / total) * 100) : 0
}

export function calculateSectionProgress(items) {
  const checked = items.filter(i => i.checked).length
  return { checked, total: items.length, percent: items.length > 0 ? Math.round((checked / items.length) * 100) : 0 }
}
