import { Login } from '@/features/user/auth';
export default async function Page({searchParams}:{searchParams:Promise<{returnTo?:string}>}){return <Login destination={(await searchParams).returnTo}/>;}
