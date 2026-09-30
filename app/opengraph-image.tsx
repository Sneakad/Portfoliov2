import { OG_SIZE, ogImage } from '@/lib/og';

export const alt = 'Aditya Mondal | Software Engineer & AI Engineer';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({
    eyebrow: 'ADITYAMONDAL.VERCEL.APP',
    title: 'Aditya Mondal',
    subtitle: 'Software engineer shipping full-stack products with generative AI.',
    chip: 'Open to work · Software Engineer · AI',
  });
}
