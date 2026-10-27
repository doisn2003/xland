import Link from 'next/link';
import { Hero } from '@/components/home/hero';
import { XlandStory } from '@/components/home/xland-story';
import { Catalog } from '@/features/user/catalog';
import { HomeConsultants } from '@/features/user/home';
export default function Home() { return <main id="main"><Hero /><Catalog home /><XlandStory /><HomeConsultants /><section className="container final-cta"><div><p className="eyebrow">HÀNH TRÌNH CỦA BẠN</p><h2>Khám phá miền đất.<br />Kết nối cộng đồng.</h2></div><div className="user-actions"><Link href="/video" className="button">Khám phá qua video</Link><Link href="/su-kien" className="button secondary">Sự kiện Xland</Link></div></section></main>; }
