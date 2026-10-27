import { notFound } from 'next/navigation';
import { uuidPattern } from '@/features/user/wire';
import { Clubs } from '@/features/user/community';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!uuidPattern.test(id))notFound();return <Clubs id={id} />;}
