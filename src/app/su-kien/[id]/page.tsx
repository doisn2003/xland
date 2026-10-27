import { notFound } from 'next/navigation';
import { uuidPattern } from '@/features/user/wire';
import { Events } from '@/features/user/community';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!uuidPattern.test(id))notFound();return <Events id={id} />;}
