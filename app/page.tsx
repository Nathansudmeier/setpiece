import WorkspoorHome from '@/components/workspoor/WorkspoorHome';
import {cmsMetadata} from '@/lib/cms/read';
export async function generateMetadata(){return cmsMetadata('home');}
export default function Home(){return <WorkspoorHome/>;}
