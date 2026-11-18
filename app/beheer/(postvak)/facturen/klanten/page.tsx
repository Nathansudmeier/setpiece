import Link from 'next/link';
import {readBilling} from '@/lib/billing/data';
import {getPeople} from '@/lib/beheer/data';
import CustomerForm from '@/components/beheer/billing/CustomerForm';
export default async function CustomersPage({searchParams}:{searchParams:Promise<{id?:string}>}){
 const data=await readBilling(),{id}=await searchParams,selected=data.customers.find(c=>c.id===id);
 const person=selected?.person_id?(await getPeople('',selected.person_id)).people[0]:undefined;
 return <><div className="bw-heading"><div><h1>Klanten</h1><p>Factuurgegevens staan bij de klant. De contactpersoon blijft gekoppeld aan het bestaande personenbestand.</p></div></div><div className="bw-bill-customer-layout"><section><h2>Factuurklanten</h2>{data.customers.length?<ul className="bw-bill-customers">{data.customers.map(c=><li key={c.id}><Link href={'/beheer/facturen/klanten?id='+c.id}>{c.data.name||'Naam nog niet ingevuld'}</Link><small>{c.active?'Actief':'Gearchiveerd'} · {c.data.city||'Adres nog niet ingevuld'}</small></li>)}</ul>:<p>Er zijn nog geen factuurklanten. Je kunt onbekende gegevens leeg laten.</p>}<Link className="bw-secondary" href="/beheer/facturen/klanten">Nieuwe klant</Link></section><CustomerForm key={selected?.id??'new'} customer={selected} projects={data.projects} person={person}/></div></>;
}
