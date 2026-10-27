import { notFound } from 'next/navigation';
import { uuidPattern } from '@/features/user/wire';
import { Author } from '@/features/user/social';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!uuidPattern.test(id))notFound();return <Author id={id} consultant/>;}
