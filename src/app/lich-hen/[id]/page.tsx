import { notFound } from 'next/navigation';
import { uuidPattern } from '@/features/user/wire';
import { BookingDetail } from '@/features/user/requests';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!uuidPattern.test(id))notFound();return <BookingDetail id={id} />;}
