import { Support } from '@/features/user/requests';
export default async function Page({searchParams}:{searchParams:Promise<{propertyId?:string;consultantId?:string}>}){return <Support {...await searchParams}/>;}
