export const SITE = {
  name: 'Shahid Khan',
  title: 'Shahid Khan',
  description:
    'Shahid Khan writes software, runs Dawloom with his brother, and studies for a BS in Artificial Intelligence.',
  email: 'shahidkhan.dev88@gmail.com',
  timeZone: 'Asia/Karachi',
  place: 'Pakistan',
};

export const LINKS = {
  email: `mailto:${SITE.email}`,
  whatsapp: 'https://wa.me/923349348631',
  x: 'https://x.com/shahid_khan_dev',
  github: 'https://github.com/Shahid-khan5',
  instagram: 'https://www.instagram.com/shahid_khan_dev/',
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
