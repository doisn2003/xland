import Link from 'next/link';
import {UserShell} from '@/features/user/ui';
export default function Page(){return <UserShell title="NFT bất động sản"><div className="user-panel"><h2>Tính năng sắp ra mắt</h2><p>Xland đang chuẩn bị phương án bất động sản phân đoạn bằng NFT. Hiện chưa mở mua, thanh toán hoặc danh mục nắm giữ.</p><Link className="button" href="/lo-dat">Khám phá lô đất</Link></div></UserShell>;}
