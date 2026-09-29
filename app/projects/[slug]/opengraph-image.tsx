import { homeProjects } from '@/data/home';
import { OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Project case study by Aditya Mondal';

export function generateStaticParams() {
  return homeProjects.map((p) => ({ slug: p.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = homeProjects.find((x) => x.id === slug) ?? homeProjects[0];
  return ogImage({
    eyebrow: `CASE STUDY ${p.n} · ${p.tag.toUpperCase()}`,
    title: p.name,
    subtitle: p.description,
    chip: p.badge ?? 'by Aditya Mondal',
  });
}
