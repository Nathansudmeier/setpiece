import {readBilling} from '@/lib/billing/data';
import SettingsForm from '@/components/beheer/billing/SettingsForm';
export default async function SettingsPage(){const data=await readBilling();return <><div className="bw-heading"><div><h1>Factuurinstellingen</h1><p>De gegevens die je bij definitief maken op de factuur vastlegt.</p></div></div><SettingsForm settings={data.settings}/></>;}
