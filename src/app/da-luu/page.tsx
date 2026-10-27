import { Saved } from '@/features/user/community';
export default async function Page({searchParams}:{searchParams:Promise<{tab?:string}>}){return <Saved initialTab={(await searchParams).tab}/>;}
