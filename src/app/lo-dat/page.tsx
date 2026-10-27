import { Catalog } from '@/features/user/catalog';
import { UserShell } from '@/features/user/ui';
import { propertyKeys } from '@/features/user/routes';
export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
 const raw = await searchParams, q = new URLSearchParams();
 for (const key of [...propertyKeys,'cursor']) { const v=raw[key]; if(Array.isArray(v)) return <UserShell title="Bộ lọc không hợp lệ"><p>Mỗi bộ lọc chỉ được xuất hiện một lần.</p></UserShell>; if(v) q.set(key,v); }
 return <UserShell title="Khám phá lô đất"><Catalog key={q.toString()} query={q.toString()} /></UserShell>;
}
