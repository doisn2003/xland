import { Bookings } from '@/features/user/requests';
export default async function Page({searchParams}:{searchParams:Promise<{propertyId?:string;sourceVideoId?:string}>}){return <Bookings {...await searchParams}/>;}
